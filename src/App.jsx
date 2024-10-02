// App.jsx
import React, { useState, useRef } from 'react';
import { Button, Input, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

const ComicFrame = ({ frame, onSelect, isSelected, onUpdate }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const handleDraw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  return (
    <Card 
      className={cn("m-2 border-2", isSelected ? "border-blue-500" : "border-transparent")}
      onClick={() => onSelect(frame.id)}>
      <canvas 
        ref={canvasRef} 
        width="300" height="200" 
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={handleDraw}
        style={{backgroundColor: frame.bgColor}}>
      </canvas>
      <CardContent>
        <Input value={frame.dialogue} onChange={(e) => onUpdate({...frame, dialogue: e.target.value})} placeholder="Enter dialogue" />
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [frames, setFrames] = useState([{ id: 1, bgColor: 'bg-blue-200', dialogue: '' }]);
  const [selectedFrame, setSelectedFrame] = useState(1);
  const [history, setHistory] = useState([JSON.stringify([{ id: 1, bgColor: 'bg-blue-200', dialogue: '' }])]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addFrame = () => {
    const newFrame = { id: Date.now(), bgColor: 'bg-blue-200', dialogue: '' };
    updateFrames([...frames, newFrame]);
  };

  const removeFrame = () => {
    if (frames.length > 1) {
      const newFrames = frames.filter(frame => frame.id !== selectedFrame);
      setSelectedFrame(newFrames[newFrames.length - 1]?.id || null);
      updateFrames(newFrames);
    }
  };

  const updateFrames = (newFrames) => {
    setFrames(newFrames);
    const newHistory = JSON.stringify(newFrames);
    setHistory([...history.slice(0, historyIndex + 1), newHistory]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setFrames(JSON.parse(history[historyIndex - 1]));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setFrames(JSON.parse(history[historyIndex + 1]));
    }
  };

  const exportSVG = () => {
    // Simplified export logic; real implementation would be more complex
    const svg = `<svg width="${frames.length * 300}" height="200">${frames.map(frame => `<rect x="${(frame.id - 1) * 300}" y="0" width="300" height="200" fill="${frame.bgColor.replace('bg-', '')}" />`).join('')}</svg>`;
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comic_strip.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between">
        <Button onClick={addFrame}>Add Frame</Button>
        <Button onClick={removeFrame} disabled={frames.length <= 1}>Remove Frame</Button>
        <Button onClick={handleUndo}>Undo</Button>
        <Button onClick={handleRedo}>Redo</Button>
        <Button onClick={exportSVG}>Export as SVG</Button>
      </div>
      <div className="flex flex-wrap">
        {frames.map(frame => (
          <ComicFrame 
            key={frame.id} 
            frame={frame} 
            isSelected={frame.id === selectedFrame}
            onSelect={setSelectedFrame}
            onUpdate={(updatedFrame) => updateFrames(frames.map(f => f.id === updatedFrame.id ? updatedFrame : f))}
          />
        ))}
      </div>
    </div>
  );
}