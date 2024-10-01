import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const StyleControls = ({ onStyleChange }) => {
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isBold, setIsBold] = useState(false);

  const handleStyleChange = (property, value) => {
    onStyleChange(property, value);
    switch (property) {
      case "fontSize":
        setFontSize(value);
        break;
      case "color":
        setTextColor(value);
        break;
      case "backgroundColor":
        setBgColor(value);
        break;
      case "fontWeight":
        setIsBold(value);
        break;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Style Controls</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Font Size</label>
            <Slider
              min={12}
              max={24}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => handleStyleChange("fontSize", value[0])}
            />
            <span className="text-sm">{fontSize}px</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <Input
              type="color"
              value={textColor}
              onChange={(e) => handleStyleChange("color", e.target.value)}
              className="w-full h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Background Color
            </label>
            <Input
              type="color"
              value={bgColor}
              onChange={(e) =>
                handleStyleChange("backgroundColor", e.target.value)
              }
              className="w-full h-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="bold-mode"
              checked={isBold}
              onCheckedChange={(checked) =>
                handleStyleChange("fontWeight", checked ? "bold" : "normal")
              }
            />
            <label htmlFor="bold-mode" className="text-sm font-medium">
              Bold Text
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarkdownEditor = ({ markdown, setMarkdown }) => (
  <textarea
    className="w-full h-full p-4 border rounded-md shadow focus:outline-none focus:ring focus:ring-blue-300 resize-none"
    value={markdown}
    onChange={(e) => setMarkdown(e.target.value)}
    placeholder="Type your markdown here..."
  />
);

const MarkdownPreview = ({ markdown, customStyles }) => {
  const parseMarkdown = (text) => {
    return text
      .replace(
        /^###### (.*$)/gim,
        '<h6 class="text-sm font-bold mb-2">$1</h6>'
      )
      .replace(
        /^##### (.*$)/gim,
        '<h5 class="text-base font-bold mb-2">$1</h5>'
      )
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mb-2">$1</h4>')
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-bold mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-bold mb-2">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold mb-2">$1</h1>'
      )
      .replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/~~(.*?)~~/gim, "<del>$1</del>")
      .replace(
        /\[(.*?)\]\((.*?)\)/gim,
        '<a href="$2" class="text-blue-600 underline">$1</a>'
      )
      .replace(
        /`(.*?)`/gim,
        '<code class="bg-gray-200 text-red-500 p-1 rounded">$1</code>'
      )
      .replace(
        /^\> (.*$)/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>'
      )
      .replace(
        /^\s*[\*\-]\s(.*$)/gim,
        '<ul class="list-disc ml-6"><li>$1</li></ul>'
      )
      .replace(
        /^\d+\.\s(.*$)/gim,
        '<ol class="list-decimal ml-6"><li>$1</li></ol>'
      )
      .replace(
        /^---$/gim,
        '<hr class="my-4 border-t-2 border-gray-300"/>'
      )
      .replace(
        /!\[(.*?)\]\((.*?)\)/gim,
        '<img src="$2" alt="$1" class="my-2 max-w-full h-auto"/>'
      )
      .replace(
        /!\{(.*?)\}\((.*?)\)/gim,
        '<video controls src="$2" class="my-2 max-w-full h-auto">$1</video>'
      )
      .replace(/\n$/gim, "<br/>");
  };

  return (
    <div
      className="markdown-preview h-full p-4 border rounded-md shadow overflow-auto"
      style={customStyles}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
    />
  );
};

export default function App() {
  const [markdown, setMarkdown] = useState("");
  const [customStyles, setCustomStyles] = useState({});

  const handleStyleChange = (property, value) => {
    setCustomStyles((prevStyles) => ({
      ...prevStyles,
      [property]: value,
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-white text-gray-900">
      <div className="w-full sm:w-1/4 p-4 bg-gray-100">
        <StyleControls onStyleChange={handleStyleChange} />
      </div>
      <div className="w-full sm:w-3/4 p-4">
        <Tabs defaultValue="editor" className="w-full h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="h-[calc(100%-40px)]">
            <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
          </TabsContent>
          <TabsContent value="preview" className="h-[calc(100%-40px)]">
            <MarkdownPreview markdown={markdown} customStyles={customStyles} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}