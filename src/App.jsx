import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';

const themes = {
  Birthday: { bg: 'bg-pink-100', stickers: ['🎉', '🎂', '🎈'] },
  Trip: { bg: 'bg-blue-100', stickers: ['✈️', '🗺️', '🏖️'] },
  Farewell: { bg: 'bg-gray-100', stickers: ['👋', '😢', '🚀'] }
};

const decorationAssets = [
  'https://example.com/deco1.png',
  'https://example.com/deco2.png',
  'https://example.com/deco3.png',
  'https://example.com/deco4.png',
  'https://example.com/deco5.png'
];

function ScrapbookItem({item, onSelect, onDelete, selected}) {
  const handleStyle = {
    cursor: 'move',
    border: selected ? '2px dashed blue' : 'none',
    opacity: item.opacity / 100
  };

  return (
    <div 
      style={handleStyle} 
      className="absolute" 
      onClick={() => onSelect(item)}
      onDragEnd={(e) => {
        const rect = e.target.getBoundingClientRect();
        onSelect({...item, x: rect.x, y: rect.y});
      }}
    >
      {item.type === 'image' && 
        <img src={item.src} style={{width: item.width, height: item.height, borderRadius: `${item.radius}%`}} draggable={false} />}
      {item.type === 'text' && 
        <div style={{fontSize: `${item.fontSize}px`, color: item.color, backgroundColor: item.bgColor, padding: `${item.padding}px`}}>{item.text}</div>}
      {item.type === 'decoration' && 
        <img src={item.src} style={{width: item.width, height: 'auto'}} draggable={false} />}
    </div>
  );
}

function App() {
  const [selectedTheme, setSelectedTheme] = useState('Birthday');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const scrapbookRef = useRef(null);
  const { toast } = useToast();

  const handleAddImage = (url) => {
    setItems(prev => [...prev, {type: 'image', src: url, x: 50, y: 50, width: 100, height: 100, radius: 0, opacity: 100}]);
  };

  const handleAddText = (text) => {
    setItems(prev => [...prev, {type: 'text', text, x: 50, y: 50, fontSize: 16, color: '#000000', bgColor: 'transparent', padding: 10}]);
  };

  const handleAddDecoration = (src) => {
    setItems(prev => [...prev, {type: 'decoration', src, x: 50, y: 50, width: 50}]);
  };

  const handleExport = async () => {
    const canvas = await html2canvas(scrapbookRef.current);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'scrapbook.png';
    link.href = dataUrl;
    link.click();
    toast({ title: "Scrapbook exported!", description: "Your scrapbook has been saved as an image." });
  };

  const handleItemChange = (key, value) => {
    setItems(items.map(item => 
      item === selectedItem ? {...item, [key]: value} : item
    ));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="w-full md:w-1/4 p-4 bg-white shadow-lg">
        <Card>
          <CardHeader>
            <CardTitle>Theme Selection</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(themes).map(theme => 
              <Button key={theme} variant={theme === selectedTheme ? 'secondary' : 'outline'} onClick={() => setSelectedTheme(theme)} className="mb-2">
                {theme}
              </Button>
            )}
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Stickers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap">
            {themes[selectedTheme].stickers.map(sticker => 
              <span key={sticker} onClick={() => handleAddText(sticker)} className="cursor-pointer p-2">{sticker}</span>
            )}
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Decorations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap">
            {decorationAssets.map(src => 
              <img key={src} src={src} onClick={() => handleAddDecoration(src)} className="w-12 h-12 object-cover m-1 cursor-pointer" />
            )}
          </CardContent>
        </Card>
      </div>
      <div ref={scrapbookRef} className={`flex-grow relative overflow-auto p-4 ${themes[selectedTheme].bg}`}>
        {items.map(item => 
          <ScrapbookItem 
            key={item.id || JSON.stringify(item)} 
            item={item} 
            onSelect={setSelectedItem}
            onDelete={() => { setSelectedItem(item); setShowDeleteDialog(true); }}
            selected={item === selectedItem}
          />
        )}
      </div>
      <div className="w-full md:w-1/4 p-4 bg-white shadow-lg">
        {selectedItem ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem.type === 'image' && (
                <>
                  <Label>URL</Label>
                  <Input value={selectedItem.src} onChange={e => handleItemChange('src', e.target.value)} />
                  <Label>Width</Label>
                  <Slider defaultValue={[selectedItem.width]} onValueChange={v => handleItemChange('width', v[0])} max={300} />
                  <Label>Height</Label>
                  <Slider defaultValue={[selectedItem.height]} onValueChange={v => handleItemChange('height', v[0])} max={300} />
                  <Label>Border Radius</Label>
                  <Slider defaultValue={[selectedItem.radius]} onValueChange={v => handleItemChange('radius', v[0])} max={50} />
                  <Label>Opacity</Label>
                  <Slider defaultValue={[selectedItem.opacity]} onValueChange={v => handleItemChange('opacity', v[0])} max={100} />
                </>
              )}
              {selectedItem.type === 'text' && (
                <>
                  <Label>Text</Label>
                  <Input value={selectedItem.text} onChange={e => handleItemChange('text', e.target.value)} />
                  <Label>Font Size</Label>
                  <Slider defaultValue={[selectedItem.fontSize]} onValueChange={v => handleItemChange('fontSize', v[0])} max={50} />
                  <Label>Text Color</Label>
                  <Input type="color" value={selectedItem.color} onChange={e => handleItemChange('color', e.target.value)} />
                  <Label>Background Color</Label>
                  <Input type="color" value={selectedItem.bgColor} onChange={e => handleItemChange('bgColor', e.target.value)} />
                  <Label>Padding</Label>
                  <Slider defaultValue={[selectedItem.padding]} onValueChange={v => handleItemChange('padding', v[0])} max={50} />
                </>
              )}
              {selectedItem.type === 'decoration' && (
                <>
                  <Label>URL</Label>
                  <Input value={selectedItem.src} onChange={e => handleItemChange('src', e.target.value)} />
                  <Label>Width</Label>
                  <Slider defaultValue={[selectedItem.width]} onValueChange={v => handleItemChange('width', v[0])} max={200} />
                </>
              )}
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="mt-4">Delete Item</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Image URL" onKeyDown={(e) => { if(e.key === 'Enter') handleAddImage(e.target.value); }} />
              <Button onClick={() => handleAddText('New Text')}>Add Text</Button>
            </CardContent>
          </Card>
        )}
        <Button onClick={handleExport} className="mt-4 w-full">Export Scrapbook</Button>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={() => setShowDeleteDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this item?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" onClick={() => {
              setItems(items.filter(item => item !== selectedItem));
              setSelectedItem(null);
              setShowDeleteDialog(false);
            }}>Confirm</Button>
            <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;