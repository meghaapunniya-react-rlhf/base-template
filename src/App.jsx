import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const StyleControls = ({ onStyleChange, onBackgroundChange }) => {
  const [selectedElement, setSelectedElement] = useState("text");
  const [styles, setStyles] = useState({
    text: { fontSize: 16, color: "#000000", fontWeight: "normal", textAlign: "left", verticalAlign: "baseline" },
    heading: { fontSize: 24, color: "#000000", fontWeight: "bold", textAlign: "left", verticalAlign: "baseline" },
    image: { width: "100%", maxHeight: "300px", display: "block", margin: "auto" },
    video: { width: "100%", maxHeight: "300px", display: "block", margin: "auto" },
  });
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");

  const handleStyleChange = (property, value) => {
    setStyles(prevStyles => ({
      ...prevStyles,
      [selectedElement]: {
        ...prevStyles[selectedElement],
        [property]: value
      }
    }));
    onStyleChange(selectedElement, property, value);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
    onBackgroundChange({ color });
  };

  const handleBackgroundImageChange = (image) => {
    setBackgroundImage(image);
    onBackgroundChange({ image });
  };

  const renderControls = () => {
    switch (selectedElement) {
      case "text":
      case "heading":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fontSize" className="text-sm font-medium">Font Size</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="fontSize"
                    min={12}
                    max={48}
                    step={1}
                    value={[styles[selectedElement].fontSize]}
                    onValueChange={(value) => handleStyleChange("fontSize", value[0])}
                    className="flex-grow"
                  />
                  <span className="text-sm font-medium w-12 text-right">{styles[selectedElement].fontSize}px</span>
                </div>
              </div>
              <div>
                <Label htmlFor="color" className="text-sm font-medium">Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={styles[selectedElement].color}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="w-12 h-10 p-1 rounded-md"
                  />
                  <Input
                    type="text"
                    value={styles[selectedElement].color}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="bold-mode"
                  checked={styles[selectedElement].fontWeight === "bold"}
                  onCheckedChange={(checked) =>
                    handleStyleChange("fontWeight", checked ? "bold" : "normal")
                  }
                />
                <Label htmlFor="bold-mode" className="text-sm font-medium">Bold</Label>
              </div>
              <div>
                <Label htmlFor="textAlign" className="text-sm font-medium">Horizontal Alignment</Label>
                <Select
                  id="textAlign"
                  onValueChange={(value) => handleStyleChange("textAlign", value)}
                  defaultValue={styles[selectedElement].textAlign}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="verticalAlign" className="text-sm font-medium">Vertical Alignment</Label>
                <Select
                  id="verticalAlign"
                  onValueChange={(value) => handleStyleChange("verticalAlign", value)}
                  defaultValue={styles[selectedElement].verticalAlign}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select vertical alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseline">Baseline</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case "image":
      case "video":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="width" className="text-sm font-medium">Width</Label>
                <Input
                  id="width"
                  type="text"
                  value={styles[selectedElement].width}
                  onChange={(e) => handleStyleChange("width", e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="maxHeight" className="text-sm font-medium">Max Height</Label>
                <Input
                  id="maxHeight"
                  type="text"
                  value={styles[selectedElement].maxHeight}
                  onChange={(e) => handleStyleChange("maxHeight", e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="alignment" className="text-sm font-medium">Alignment</Label>
                <Select
                  id="alignment"
                  onValueChange={(value) => {
                    handleStyleChange("display", "block");
                    if (value === "center") {
                      handleStyleChange("margin", "auto");
                    } else if (value === "right") {
                      handleStyleChange("margin", "0 0 0 auto");
                    } else {
                      handleStyleChange("margin", "0");
                    }
                  }}
                  defaultValue={styles[selectedElement].margin === "auto" ? "center" : 
                                styles[selectedElement].margin === "0 0 0 auto" ? "right" : "left"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Style Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="elementSelect" className="text-sm font-medium">Element to Style</Label>
          <Select id="elementSelect" onValueChange={setSelectedElement} defaultValue={selectedElement}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select element to style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="heading">Heading</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        {renderControls()}
        <Separator />
        <div className="space-y-4">
          <div>
            <Label htmlFor="backgroundColor" className="text-sm font-medium">Background Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="w-12 h-10 p-1 rounded-md"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="flex-grow"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="backgroundImage" className="text-sm font-medium">Background Image URL</Label>
            <Input
              id="backgroundImage"
              type="text"
              value={backgroundImage}
              onChange={(e) => handleBackgroundImageChange(e.target.value)}
              placeholder="Enter image URL"
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarkdownEditor = ({ markdown, setMarkdown }) => (
  <textarea
    className="w-full h-full min-h-[400px] p-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
    value={markdown}
    onChange={(e) => setMarkdown(e.target.value)}
    placeholder="Type your markdown here..."
  />
);

const MarkdownPreview = ({ markdown, customStyles,background }) => {
  const parseMarkdown = (text) => {
    const headingStyle = `font-size: ${customStyles.heading.fontSize}px; color: ${customStyles.heading.color}; font-weight: ${customStyles.heading.fontWeight}; text-align: ${customStyles.heading.textAlign}; vertical-align: ${customStyles.heading.verticalAlign};`;
    const textStyle = `font-size: ${customStyles.text.fontSize}px; color: ${customStyles.text.color}; font-weight: ${customStyles.text.fontWeight}; text-align: ${customStyles.text.textAlign}; vertical-align: ${customStyles.text.verticalAlign};`;
    const imageStyle = `width: ${customStyles.image.width}; max-height: ${customStyles.image.maxHeight}; object-fit: contain; display: ${customStyles.image.display}; margin: ${customStyles.image.margin};`;
    const videoStyle = `width: ${customStyles.video.width}; max-height: ${customStyles.video.maxHeight}; display: ${customStyles.video.display}; margin: ${customStyles.video.margin};`;

    return text
      .replace(/!\[(.*?)\]\((.*?)\)/gim, (match, alt, src) => {
        const isValidSrc = src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('./') || src.startsWith('../'));
        return isValidSrc
          ? `<img src="${src}" alt="${alt}" style="${imageStyle}" />`
          : match;
      })
      .replace(/^###### (.*$)/gim, `<h6 style="${headingStyle}">$1</h6>`)
      .replace(/^##### (.*$)/gim, `<h5 style="${headingStyle}">$1</h5>`)
      .replace(/^#### (.*$)/gim, `<h4 style="${headingStyle}">$1</h4>`)
      .replace(/^### (.*$)/gim, `<h3 style="${headingStyle}">$1</h3>`)
      .replace(/^## (.*$)/gim, `<h2 style="${headingStyle}">$1</h2>`)
      .replace(/^# (.*$)/gim, `<h1 style="${headingStyle}">$1</h1>`)
      .replace(/\*\*\*(.*?)\*\*\*/gim, `<strong><em style="${textStyle}">$1</em></strong>`)
      .replace(/\*\*(.*?)\*\*/gim, `<strong style="${textStyle}">$1</strong>`)
      .replace(/\*(.*?)\*/gim, `<em style="${textStyle}">$1</em>`)
      .replace(/~~(.*?)~~/gim, `<del style="${textStyle}">$1</del>`)
      .replace(/\[(.*?)\]\((.*?)\)/gim, `<a href="$2" style="${textStyle}" class="text-blue-600 hover:underline">$1</a>`)
      .replace(/`(.*?)`/gim, `<code style="${textStyle}" class="bg-gray-100 text-red-500 px-1 rounded">$1</code>`)
      .replace(/^\> (.*$)/gim, `<blockquote style="${textStyle}" class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>`)
      .replace(/^\s*[\*\-]\s(.*$)/gim, `<ul class="list-disc ml-6"><li style="${textStyle}">$1</li></ul>`)
      .replace(/^\d+\.\s(.*$)/gim, `<ol class="list-decimal ml-6"><li style="${textStyle}">$1</li></ol>`)
      .replace(/^---$/gim, '<hr class="my-4 border-t-2 border-gray-300"/>')
      .replace(/!\{(.*?)\}\((.*?)\)/gim, `<video controls src="$2" style="${videoStyle}">$1</video>`)
      .replace(/\n$/gim, "<br/>")
      .replace(/([^>]\n)(?=[^<])/g, `$1<p style="${textStyle}">`)
      .replace(/([^>]\n)(?=[^<])/g, "$1</p>");
  };

  const containerStyle = {
    backgroundColor: background.color || '#ffffff',
    backgroundImage: background.image ? `url(${background.image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div
    className="w-full h-full min-h-[400px] p-4 border rounded-md shadow-sm overflow-auto"
    style={containerStyle}
  >
      <div dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }} />
    </div>
  );
};

export default function App() {
  const [markdown, setMarkdown] = useState("");
  const [customStyles, setCustomStyles] = useState({
    text: { fontSize: 16, color: "#000000", fontWeight: "normal", textAlign: "left", verticalAlign: "baseline" },
    heading: { fontSize: 24, color: "#000000", fontWeight: "bold", textAlign: "left", verticalAlign: "baseline" },
    image: { width: "100%", maxHeight: "300px", display: "block", margin: "auto" },
    video: { width: "100%", maxHeight: "300px", display: "block", margin: "auto" },
  });
  const [background, setBackground] = useState({ color: "#ffffff", image: "" });


  const handleStyleChange = (element, property, value) => {
    setCustomStyles(prevStyles => ({
      ...prevStyles,
      [element]: {
        ...prevStyles[element],
        [property]: value
      }
    }));
  };

  const handleBackgroundChange = (newBackground) => {
    setBackground(prevBackground => ({ ...prevBackground, ...newBackground }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 text-gray-900">
      <div className="w-full lg:w-1/4 p-4 lg:overflow-auto lg:h-full overflow-y-auto">
        <StyleControls onStyleChange={handleStyleChange} onBackgroundChange={handleBackgroundChange} />
      </div>

      {/* Markdown Editor and Preview */}
      <div className="w-full lg:w-3/4 p-4 flex-grow">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <Tabs defaultValue="editor" className="w-full h-full flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="editor" className="w-1/2">Editor</TabsTrigger>
                <TabsTrigger value="preview" className="w-1/2">Preview</TabsTrigger>
              </TabsList>

              <div className="p-4 flex-grow lg:overflow-hidden overflow-visible lg:h-full">
                <TabsContent value="editor" className="h-full">
                <div className="h-full max-h-[45vh] lg:max-h-[100vh] overflow-y-auto">
                  <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="h-full">
                  <div className="h-full max-h-[45vh] lg:max-h-[100vh] overflow-y-auto"> 
                    <MarkdownPreview markdown={markdown} customStyles={customStyles} background={background} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
);
}
