import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";


const presetBackgrounds = [
  { id: "bg1", color: "bg-blue-200" },
  { id: "bg2", color: "bg-green-200" },
  { id: "bg3", color: "bg-red-200" },
];

const presetCharacters = [
  { id: "char1", type: "emoji", content: "😃" },
  { id: "char2", type: "emoji", content: "😎" },
  { id: "char3", type: "emoji", content: "🤖" },
];

const AssetLibrary = ({ onSelectAsset }) => {
  const [customImageUrl, setCustomImageUrl] = useState("");

  const handleCustomImageSubmit = (e) => {
    e.preventDefault();
    onSelectAsset("character", { type: "image", content: customImageUrl });
    setCustomImageUrl("");
  };

  return (
    
        <Tabs defaultValue="backgrounds">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
          </TabsList>
          <TabsContent value="backgrounds">
            <div className="grid grid-cols-3 gap-2">
              {presetBackgrounds.map((bg) => (
                <div
                  key={bg.id}
                  className={`w-full h-12 ${bg.color} cursor-pointer`}
                  onClick={() => onSelectAsset("background", bg)}
                ></div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="characters">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetCharacters.map((char) => (
                <div
                  key={char.id}
                  className="w-full h-12 flex items-center justify-center text-2xl cursor-pointer"
                  onClick={() => onSelectAsset("character", char)}
                >
                  {char.content}
                </div>
              ))}
            </div>
            <form onSubmit={handleCustomImageSubmit}>
              <Input
                type="url"
                placeholder="Enter image URL"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="mb-2"
              />
              <Button type="submit">Add Custom Image</Button>
            </form>
          </TabsContent>
        </Tabs>
  );
};

const ComicFrame = ({ frame, onUpdateFrame, isDrawing, drawingTool, onDraw, onUndoRedoDraw }) => {
  const canvasRef = useRef(null);
  const [isDrawingInFrame, setIsDrawingInFrame] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (frame.drawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = frame.drawing;
    }
  }, [frame.drawing]);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    onUpdateFrame({ ...frame, [data.type]: data.asset });
  };

  const handleMouseDown = (e) => {
    if (isDrawing) {
      setIsDrawingInFrame(true);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDraw(canvas, x, y, false);
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && isDrawingInFrame) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDraw(canvas, x, y, true);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && isDrawingInFrame) {
      setIsDrawingInFrame(false);
      const canvas = canvasRef.current;
      onUpdateFrame({ ...frame, drawing: canvas.toDataURL() });
      onUndoRedoDraw();
    }
  };

  return (
    <div
      className={`w-full aspect-square ${frame.background?.color || "bg-gray-200"} relative overflow-hidden`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {frame.character && (
        <div
          className="absolute text-6xl transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${frame.characterPosition?.y || 50}%`,
            left: `${frame.characterPosition?.x || 50}%`,
            fontSize: `${frame.characterSize || 6}rem`,
          }}
        >
          {frame.character.type === "emoji" ? (
            frame.character.content
          ) : (
            <img
              src={frame.character.content}
              alt="Character"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </div>
      )}
      {frame.dialogue && (
        <div
          className="absolute bg-white p-2 rounded-lg shadow"
          style={{
            top: `${frame.dialoguePosition?.y || 80}%`,
            left: `${frame.dialoguePosition?.x || 10}%`,
            width: `${frame.dialogueSize || 80}%`,
          }}
        >
          {frame.dialogue}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={300}
        height={300}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

const DialogueEditor = ({ frame, onUpdateFrame }) => {
  const [dialogue, setDialogue] = useState(frame.dialogue || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateFrame({ ...frame, dialogue });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Input
        value={dialogue}
        onChange={(e) => setDialogue(e.target.value)}
        placeholder="Enter dialogue..."
        className="mb-2"
      />
      <Button type="submit">Update Dialogue</Button>
    </form>
  );
};


const PositionControl = ({ position, onUpdate, label }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium mb-2">{label} Position</h3>
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="text-xs">X</label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[position?.x || 50]}
          onValueChange={(value) => onUpdate({ x: value[0], y: position?.y || 50 })}
        />
      </div>
      <div className="flex-1">
        <label className="text-xs">Y</label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[position?.y || 50]}
          onValueChange={(value) => onUpdate({ x: position?.x || 50, y: value[0] })}
        />
      </div>
    </div>
  </div>
);

const SizeControl = ({ size, onUpdate, label, min = 1, max = 10 }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium mb-2">{label} Size</h3>
    <Slider
      min={min}
      max={max}
      step={0.1}
      value={[size || (label === "Character" ? 6 : 80)]}
      onValueChange={(value) => onUpdate(value[0])}
    />
  </div>
);

export default function App() {
  const [frames, setFrames] = useState([{ id: 1, drawing: null }]);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [editMode, setEditMode] = useState("asset");
  const [drawingTool, setDrawingTool] = useState("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const comicRef = useRef(null);
  const [history, setHistory] = useState([frames]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (JSON.stringify(frames) !== JSON.stringify(history[historyIndex])) {
      setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), frames]);
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  }, [frames, history, historyIndex]);

  const handleSelectAsset = (type, asset) => {
    const updatedFrames = [...frames];
    updatedFrames[selectedFrame] = { ...updatedFrames[selectedFrame], [type]: asset };
    setFrames(updatedFrames);
  };

  const handleUpdateFrame = (updatedFrame) => {
    const updatedFrames = [...frames];
    updatedFrames[selectedFrame] = updatedFrame;
    setFrames(updatedFrames);
  };

  const addFrame = () => {
    setFrames([...frames, { id: frames.length + 1, drawing: null }]);
  };

  const removeFrame = (index) => {
    if (frames.length > 1) {
      const updatedFrames = frames.filter((_, i) => i !== index);
      setFrames(updatedFrames);
      setSelectedFrame(Math.min(selectedFrame, updatedFrames.length - 1));
    }
  };

  const handleExport = () => {
    if (comicRef.current) {
      const svgData = new XMLSerializer().serializeToString(comicRef.current);
      const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "comic_strip.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleDraw = (canvas, x, y, isDrawing) => {
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawingTool === 'eraser' ? '#e5e7eb' : '#000000';
    
    if (isDrawing) {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setFrames(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setFrames(history[historyIndex + 1]);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Comic Strip Creator</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Asset Library</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetLibrary onSelectAsset={handleSelectAsset} />
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Edit Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <ToggleGroup type="single" value={editMode} onValueChange={setEditMode}>
                <ToggleGroupItem value="asset" aria-label="Asset">
                  Asset
                </ToggleGroupItem>
                <ToggleGroupItem value="draw" aria-label="Draw" onClick={() => setIsDrawing(true)}>
                  Draw
                </ToggleGroupItem>
              </ToggleGroup>
              {editMode === "draw" && (
                <ToggleGroup type="single" value={drawingTool} onValueChange={setDrawingTool} className="mt-2">
                  <ToggleGroupItem value="pen" aria-label="Pen">
                    Pen
                  </ToggleGroupItem>
                  <ToggleGroupItem value="eraser" aria-label="Eraser">
                    Eraser
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            </CardContent>
          </Card>
          {editMode === "asset" && (
            <Card>
              <CardHeader>
                <CardTitle>Asset Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <PositionControl
                  position={frames[selectedFrame].characterPosition}
                  onUpdate={(position) =>
                    handleUpdateFrame({
                      ...frames[selectedFrame],
                      characterPosition: position,
                    })
                  }
                  label="Character"
                />
                <SizeControl
                  size={frames[selectedFrame].characterSize}
                  onUpdate={(size) =>
                    handleUpdateFrame({
                      ...frames[selectedFrame],
                      characterSize: size,
                    })
                  }
                  label="Character"
                />
                <Separator className="my-4" />
                <PositionControl
                  position={frames[selectedFrame].dialoguePosition}
                  onUpdate={(position) =>
                    handleUpdateFrame({
                      ...frames[selectedFrame],
                      dialoguePosition: position,
                    })
                  }
                  label="Dialogue"
                />
                <SizeControl
                  size={frames[selectedFrame].dialogueSize}
                  onUpdate={(size) =>
                    handleUpdateFrame({
                      ...frames[selectedFrame],
                      dialogueSize: size,
                    })
                  }
                  label="Dialogue"
                  min={20}
                  max={100}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex-1">
          <Card className="mb-6">
            <CardContent className="p-4 overflow-y-scroll max-h-[500px]">
              <div ref={comicRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {frames.map((frame, index) => (
                  <Card
                    key={frame.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedFrame === index ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedFrame(index)}
                  >
                    <CardContent className="p-2">
                      <ComicFrame
                        frame={frame}
                        onUpdateFrame={handleUpdateFrame}
                        isDrawing={isDrawing && editMode === "draw"}
                        drawingTool={drawingTool}
                        onDraw={handleDraw}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-around mb-6">
            <Button onClick={addFrame} className="bg-green-500 hover:bg-green-600">Add Frame</Button>
            {frames.length > 1 && (
              <Button onClick={() => removeFrame(selectedFrame)} variant="destructive" className="bg-red-500 hover:bg-red-600">
                Remove Frame
              </Button>
            )}
            <Button onClick={handleExport} className="bg-purple-500 hover:bg-purple-600">Export</Button>
            <Button onClick={handleUndo} disabled={historyIndex === 0} className="bg-yellow-500 hover:bg-yellow-600">Undo</Button>
            <Button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="bg-yellow-500 hover:bg-yellow-600">Redo</Button>
          </div>
          {editMode === "asset" && (
            <Card>
              <CardHeader>
                <CardTitle>Dialogue Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <DialogueEditor
                  frame={frames[selectedFrame]}
                  onUpdateFrame={handleUpdateFrame}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}