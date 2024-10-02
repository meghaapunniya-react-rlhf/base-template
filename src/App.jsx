import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, Input, Select, SelectItem, Switch, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, Underline, Image, Video, TypeH1, TypeH2, TypeH3 } from "lucide-react";

const Editor = ({ markdown, setMarkdown, style, setStyle }) => (
  <div className="flex-1 p-4 border-r border-gray-200">
    <textarea
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
      className="w-full h-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}px` }}
    />
  </div>
);

const StyleControls = ({ style, setStyle }) => (
  <Card className="w-64 p-4 space-y-4">
    <CardHeader>
      <CardTitle>Style Controls</CardTitle>
    </CardHeader>
    <CardContent>
      <div>
        <label>Font Size:</label>
        <Input type="number" value={style.fontSize} onChange={e => setStyle({...style, fontSize: e.target.value})} />
      </div>
      <div>
        <label>Font Color:</label>
        <Input type="color" value={style.color} onChange={e => setStyle({...style, color: e.target.value})} />
      </div>
      <div>
        <label>Font Weight:</label>
        <Select value={style.fontWeight} onValueChange={value => setStyle({...style, fontWeight: value})}>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="bold">Bold</SelectItem>
        </Select>
      </div>
      <div>
        <label>Text Alignment:</label>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStyle({...style, textAlign: 'left'})}>
            <AlignLeft />
          </Button>
          <Button variant="outline" onClick={() => setStyle({...style, textAlign: 'center'})}>
            <AlignCenter />
          </Button>
          <Button variant="outline" onClick={() => setStyle({...style, textAlign: 'right'})}>
            <AlignRight />
          </Button>
          <Button variant="outline" onClick={() => setStyle({...style, textAlign: 'justify'})}>
            <AlignJustify />
          </Button>
        </div>
      </div>
      <div>
        <label>Background Color:</label>
        <Input type="color" value={style.backgroundColor} onChange={e => setStyle({...style, backgroundColor: e.target.value})} />
      </div>
      <div>
        <Switch checked={style.useBackgroundImage} onCheckedChange={checked => setStyle({...style, useBackgroundImage: checked})}>
          Use Background Image
        </Switch>
        {style.useBackgroundImage && <Input type="text" placeholder="Enter image URL" onChange={e => setStyle({...style, backgroundImage: e.target.value})} />}
      </div>
    </CardContent>
  </Card>
);

const Preview = ({ markdown, style }) => (
  <div className="flex-1 p-4" style={{...style, backgroundImage: style.useBackgroundImage ? `url(${style.backgroundImage})` : 'none'}}>
    <ReactMarkdown>{markdown}</ReactMarkdown>
  </div>
);

export default function App() {
  const [view, setView] = useState('Editor');
  const [markdown, setMarkdown] = useState('Write your **email** here...');
  const [style, setStyle] = useState({
    fontSize: 16,
    color: '#000000',
    fontWeight: 'normal',
    textAlign: 'left',
    backgroundColor: '#ffffff',
    useBackgroundImage: false,
    backgroundImage: ''
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100 sm:flex-row">
      <StyleControls style={style} setStyle={setStyle} />
      <div className="flex flex-col flex-1">
        <div className="flex justify-center p-4 bg-white shadow-md">
          <Button onClick={() => setView('Editor')}>Editor</Button>
          <Button onClick={() => setView('Preview')} className="ml-2">Preview</Button>
        </div>
        {view === 'Editor' ? 
          <Editor markdown={markdown} setMarkdown={setMarkdown} style={style} setStyle={setStyle} /> : 
          <Preview markdown={markdown} style={style} />}
      </div>
    </div>
  );
}