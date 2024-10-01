import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Slider, Switch } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const EditorView = () => {
  const [markdown, setMarkdown] = useState('');
  const [styles, setStyles] = useState({
    textColor: '#000000',
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'left',
    bgColor: '#ffffff',
    bgImage: '',
    imageSize: 100,
    videoSize: 300
  });
  const [view, setView] = useState('Editor');

  const handleStyleChange = (key, value) => {
    setStyles(prev => ({...prev, [key]: value}));
  };

  const Editor = () => (
    <textarea 
      value={markdown} 
      onChange={(e) => setMarkdown(e.target.value)} 
      className="w-full h-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );

  const Preview = () => (
    <div 
      style={{
        backgroundColor: styles.bgColor,
        backgroundImage: `url(${styles.bgImage})`,
        backgroundSize: 'cover'
      }}
      className="w-full p-4 rounded-md overflow-y-auto"
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        children={markdown}
        components={{
          p: ({node, ...props}) => <p style={{color: styles.textColor, fontSize: `${styles.fontSize}px`, fontWeight: styles.fontWeight, textAlign: styles.textAlign}} {...props} />,
          h1: ({node, ...props}) => <h1 style={{color: styles.textColor, fontSize: `${styles.fontSize * 1.5}px`, fontWeight: styles.fontWeight}} {...props} />,
          img: ({node, ...props}) => <img style={{width: `${styles.imageSize}%`}} {...props} />,
          // Here you would need to handle video elements if markdown supports it directly or through a custom component
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Card className="sm:w-1/3">
        <CardHeader><h3 className="text-lg font-semibold">Style Controls</h3></CardHeader>
        <CardContent>
          <Input label="Text Color" type="color" value={styles.textColor} onChange={(e) => handleStyleChange('textColor', e.target.value)} />
          <Slider label="Font Size" value={[styles.fontSize]} onValueChange={(value) => handleStyleChange('fontSize', value[0])} max={32} />
          <Select label="Font Weight" value={styles.fontWeight.toString()} onChange={(value) => handleStyleChange('fontWeight', Number(value))}>
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(w => <option key={w} value={w}>{w}</option>)}
          </Select>
          {/* Add more controls similarly */}
        </CardContent>
      </Card>
      <Card className="sm:w-2/3">
        <CardHeader>
          <div className="flex justify-between">
            <Button onClick={() => setView(view === 'Editor' ? 'Preview' : 'Editor')}>
              Switch to {view === 'Editor' ? 'Preview' : 'Editor'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {view === 'Editor' ? <Editor /> : <Preview />}
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl mb-4">Markdown Email Editor</h1>
      <EditorView />
    </div>
  );
}