// App.jsx
import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, Input, Label, Select, SelectItem } from "@/components/ui";
import { DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import html2canvas from 'html2canvas';

const themes = {
  Birthday: { bg: 'bg-pink-100', stickers: ['🎉', '🎂', '🎈'] },
  Trip: { bg: 'bg-blue-100', stickers: ['✈️', '🌍', '🗺️'] },
  Farewell: { bg: 'bg-gray-100', stickers: ['👋', '🎒', '💼'] }
};

const decorationAssets = [
  'https://example.com/decor1.png',
  'https://example.com/decor2.png',
  // Add more URLs here
];

function App() {
  const [selectedTheme, setSelectedTheme] = useState('Birthday');
  const [items, setItems] = useState([]);
  const scrapbookRef = useRef(null);

  const addImage = (url) => {
    setItems(prev => [...prev, { type: 'image', url, x: 50, y: 50, width: 100, height: 100, borderRadius: 0, opacity: 1 }]);
  };

  const addText = (text) => {
    setItems(prev => [...prev, { type: 'text', text, x: 50, y: 50, fontSize: 16, color: '#000', bgColor: 'transparent', padding: 10 }]);
  };

  const addDecoration = (url) => {
    setItems(prev => [...prev, { type: 'decoration', url, x: 50, y: 50, width: 50, height: 50 }]);
  };

  const updateItem = (index, updates) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const removeItem = (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleExport = () => {
    html2canvas(scrapbookRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'scrapbook.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const ItemControls = ({ item, index }) => (
    <div className="p-2">
      {item.type === 'image' && (
        <>
          <Input type="number" placeholder="Width" value={item.width} onChange={e => updateItem(index, { width: e.target.value })} />
          <Input type="number" placeholder="Opacity" value={item.opacity} onChange={e => updateItem(index, { opacity: e.target.value })} />
        </>
      )}
      {item.type === 'text' && (
        <>
          <Input type="text" placeholder="Text" value={item.text} onChange={e => updateItem(index, { text: e.target.value })} />
          <Input type="number" placeholder="Font Size" value={item.fontSize} onChange={e => updateItem(index, { fontSize: e.target.value })} />
        </>
      )}
      <Button variant="destructive" onClick={() => removeItem(index)}><TrashIcon /> Delete</Button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Pane */}
      <div className="w-full md:w-1/4 p-4 bg-gray-50">
        <Select onValueChange={setSelectedTheme}>
          {Object.keys(themes).map(theme => <SelectItem key={theme} value={theme}>{theme}</SelectItem>)}
        </Select>
        <div className="mt-4">
          <h3 className="font-bold">Stickers</h3>
          {themes[selectedTheme].stickers.map((sticker, idx) => 
            <span key={idx} className="text-2xl cursor-pointer" onClick={() => addText(sticker)}>{sticker}</span>
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Decorations</h3>
          {decorationAssets.map((asset, idx) => 
            <img key={idx} src={asset} alt="decoration" className="w-10 h-10 m-1 cursor-pointer" onClick={() => addDecoration(asset)} />
          )}
        </div>
      </div>

      {/* Middle Pane */}
      <div ref={scrapbookRef} className={`flex-1 p-6 ${themes[selectedTheme].bg}`} style={{ position: 'relative', overflow: 'hidden' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{
            position: 'absolute', 
            left: item.x, 
            top: item.y, 
            opacity: item.type === 'image' ? item.opacity : 1,
            borderRadius: item.borderRadius
          }} draggable onDragEnd={(e) => {
            const rect = e.target.getBoundingClientRect();
            updateItem(idx, { x: rect.left, y: rect.top });
          }}>
            {item.type === 'image' && <img src={item.url} style={{ width: item.width, height: 'auto', borderRadius: item.borderRadius }} />}
            {item.type === 'text' && <div style={{ fontSize: item.fontSize, color: item.color, backgroundColor: item.bgColor, padding: item.padding }}>{item.text}</div>}
            {item.type === 'decoration' && <img src={item.url} style={{ width: item.width, height: item.height }} />}
          </div>
        ))}
      </div>

      {/* Right Pane */}
      <div className="w-full md:w-1/4 p-4 bg-gray-100">
        <Input placeholder="Image URL" onBlur={(e) => e.target.value && addImage(e.target.value)} />
        <Input placeholder="Enter text" onBlur={(e) => e.target.value && addText(e.target.value)} />
        {items.length > 0 && items.map((item, idx) => (
          <Card key={idx} className="my-2">
            <CardContent><ItemControls item={item} index={idx} /></CardContent>
          </Card>
        ))}
        <Button onClick={handleExport}><DownloadIcon /> Export Scrapbook</Button>
      </div>
    </div>
  );
}

export default App;