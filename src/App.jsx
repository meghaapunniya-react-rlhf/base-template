import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

function ComicFrame({ frame, index, selectFrame, deleteFrame, updateFrame }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (frame.image) {
      const img = new Image();
      img.onload = () => context.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = frame.image;
    }
    // Draw existing paths
    frame.paths.forEach(path => {
      context.beginPath();
      path.forEach((point, i) => {
        if (i === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.strokeStyle = path.color;
      context.lineWidth = path.width;
      context.stroke();
    });
  }, [frame]);

  const handleMouseDown = (e) => {
    if (!isDrawing) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPath = [{ x, y }];
    updateFrame(index, { paths: [...frame.paths, { color: '#000', width: 2, data: newPath }] });
    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const context = canvasRef.current.getContext('2d');
    const paths = [...frame.paths];
    const currentPath = paths[paths.length - 1];
    currentPath.data.push({ x, y });
    updateFrame(index, { paths });
    context.lineTo(x, y);
    context.stroke();
  };

  return (
    <Card className={`border-2 ${frame.selected ? 'border-blue-500' : 'border-gray-300'} m-2`} onClick={() => selectFrame(index)}>
      <CardHeader>
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={200}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          className="border border-gray-400 bg-white"
        />
      </CardHeader>
      <CardContent>
        <Input 
          value={frame.dialogue} 
          onChange={e => updateFrame(index, { dialogue: e.target.value })} 
          placeholder="Enter dialogue..."
        />
      </CardContent>
      <CardFooter>
        <Button onClick={(e) => { e.stopPropagation(); deleteFrame(index); }}>Delete</Button>
        <Switch checked={isDrawing} onCheckedChange={(checked) => setIsDrawing(checked)}>Draw</Switch>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [frames, setFrames] = useState([{ paths: [], dialogue: '', image: '', selected: true, background: 'bg-blue-200' }]);
  const [assetUrl, setAssetUrl] = useState('');
  const [currentTool, setCurrentTool] = useState('asset');

  const selectFrame = (index) => {
    setFrames(prev => prev.map((f, i) => ({...f, selected: i === index})));
  };

  const addFrame = () => {
    setFrames(prev => [...prev, { paths: [], dialogue: '', image: '', selected: false, background: 'bg-blue-200' }]);
  };

  const deleteFrame = (index) => {
    if (frames.length > 1) {
      setFrames(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateFrame = (index, updates) => {
    setFrames(prev => prev.map((frame, i) => i === index ? { ...frame, ...updates } : frame));
  };

  const exportComic = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '1000');
    svg.setAttribute('height', '300');
    frames.forEach((frame, i) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute('x', i * 310);
      rect.setAttribute('y', '0');
      rect.setAttribute('width', '300');
      rect.setAttribute('height', '200');
      rect.setAttribute('fill', frame.background.replace('bg-', ''));
      svg.appendChild(rect);
      // Add logic to draw paths, text, and images here
    });
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comic_strip.svg';
    a.click();
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Comic Strip Creator</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {frames.map((frame, index) => (
          <ComicFrame 
            key={index} 
            frame={frame} 
            index={index} 
            selectFrame={selectFrame} 
            deleteFrame={deleteFrame} 
            updateFrame={updateFrame}
          />
        ))}
      </div>
      <div className="flex space-x-2">
        <Button onClick={addFrame}>Add Frame</Button>
        <Button onClick={exportComic}>Export as SVG</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={currentTool === 'draw'} onCheckedChange={(checked) => setCurrentTool(checked ? 'draw' : 'asset')}>Draw Mode</Switch>
        {currentTool === 'asset' && (
          <>
            <Input 
              value={assetUrl} 
              onChange={e => setAssetUrl(e.target.value)} 
              placeholder="Enter image URL"
            />
            <Button onClick={() => {
              const selectedFrame = frames.findIndex(f => f.selected);
              if (selectedFrame !== -1) {
                updateFrame(selectedFrame, { image: assetUrl });
                setAssetUrl('');
              }
            }}>Add Asset</Button>
            <Button onClick={() => {
              const selectedFrame = frames.findIndex(f => f.selected);
              if (selectedFrame !== -1) {
                updateFrame(selectedFrame, { background: 'bg-blue-200' });
              }
            }} className="bg-blue-200">Blue</Button>
            <Button onClick={() => {
              const selectedFrame = frames.findIndex(f => f.selected);
              if (selectedFrame !== -1) {
                updateFrame(selectedFrame, { background: 'bg-green-200' });
              }
            }} className="bg-green-200">Green</Button>
            <Button onClick={() => {
              const selectedFrame = frames.findIndex(f => f.selected);
              if (selectedFrame !== -1) {
                updateFrame(selectedFrame, { background: 'bg-red-200' });
              }
            }} className="bg-red-200">Red</Button>
          </>
        )}
      </div>
    </div>
  );
}