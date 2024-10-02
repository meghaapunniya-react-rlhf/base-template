import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Theme and styles
const templates = {
  Birthday: { bg: "bg-pink-100", fillcolor: '#fce7f3', text: "text-pink-800", stickerColor: "text-pink-600" },
  Trip: { bg: "bg-blue-100", fillcolor: 'dbeafe', text: "text-blue-800", stickerColor: "text-blue-600" },
  Farewell: { bg: "bg-purple-100", fillcolor: '#f3e8ff', text: "text-purple-800", stickerColor: "text-purple-600" },
};

// Stickers
const stickers = [
  "🎉", "🎂", "🎁", "🎈", "🌴", "🏖️", "✈️", "🌺", "👋", "😢", "🤗", "💖"
];

// Decoration assets (Predefined PNGs)
const predefinedAssets = [
  "https://static.vecteezy.com/system/resources/thumbnails/021/924/020/small/pieces-of-colorful-scrapbook-washi-tape-strip-label-tag-decorative-scotch-printable-stickers-with-stars-for-planner-or-journal-png.png",
  "https://static.vecteezy.com/system/resources/previews/023/742/042/non_2x/watercolor-hand-drawn-autumn-square-frame-illustration-of-autumn-perfect-for-scrapbooking-kids-design-wedding-invitation-posters-greetings-cards-party-decoration-png.png",
  "https://static.vecteezy.com/system/resources/previews/011/236/429/original/luxury-birthday-decoration-balloons-free-png.png",
  "https://static.vecteezy.com/system/resources/thumbnails/029/490/952/small/triangle-pennants-chain-and-confetti-for-halloween-party-color-concept-birthday-celebration-carnival-anniversary-and-decoration-png.png",
  "https://static.vecteezy.com/system/resources/previews/023/230/156/non_2x/3d-happy-birthday-text-with-gift-boxes-and-glossy-balloon-bunch-over-blue-podium-png.png",
  "https://static.vecteezy.com/system/resources/previews/012/661/561/non_2x/birthday-decoration-illustration-png.png",
  "https://static.vecteezy.com/system/resources/previews/024/861/189/non_2x/travel-is-my-therapy-adventure-and-travel-typography-quote-design-png.png",
  "https://static.vecteezy.com/system/resources/previews/013/261/166/non_2x/colorful-inspirational-quote-lettering-perfect-for-print-illustration-and-decoration-png.png",
  "https://static.vecteezy.com/system/resources/previews/031/107/983/non_2x/bon-voyage-lettering-design-png.png",
  "https://static.vecteezy.com/system/resources/previews/016/733/812/non_2x/holiday-word-decoration-png.png",
  "https://static.vecteezy.com/system/resources/thumbnails/024/919/740/small/cute-cartoon-character-design-isolated-icons-people-cartoon-character-flat-illustration-png.png",
];

function ScrapbookItem({ item, onUpdate, onDelete, onSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: item.x, y: item.y });
  const [isHovered, setIsHovered] = useState(false);


  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    const newX = position.x + e.clientX - e.target.getBoundingClientRect().left;
    const newY = position.y + e.clientY - e.target.getBoundingClientRect().top;
    setPosition({ x: newX, y: newY });
    onUpdate({ ...item, x: newX, y: newY });
  };

  return (
    <div
      className="absolute cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${item.rotation || 0}deg)`,
        width: `${item.size || 100}px`,
        height: `${item.size || 100}px`,
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item)}
    >
      {item.type === "image" && (
        <img
          src={item.content}
          alt=""
          className="w-full h-full object-cover"
          style={{ borderRadius: `${item.borderRadius || 0}px`, opacity: item.opacity || 1 }}
        />
      )}
      {item.type === "text" && (
        <p className="text-xl font-bold break-words" style={{ paddingTop: `${item.paddingTop}px`, paddingBottom: `${item.paddingBottom}px`, paddingLeft: `${item.paddingLeft}px`, paddingRight: `${item.paddingRight}px`, borderRadius: `${item.borderRadius || 0}px`, color: item.fontColor, backgroundColor: item.bgColor, fontSize: `${item.fontSize}px`, opacity: item.opacity || 1 }}>
          {item.content}
        </p>
      )}
      {item.type === "sticker" && (
        <span className={`text-4xl ${item.stickerColor || ""}`}>
          {item.content}
        </span>
      )}

      {/* Show Bin Icon on Hover for Deleting */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
            🗑️
          </Button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("Birthday");
  const [items, setItems] = useState([]);
  const [canvasImageUrl, setCanvasImageUrl] = useState("");
  const [decorationImageUrl, setDecorationImageUrl] = useState("");
  const [text, setText] = useState("");
  const [decorations, setDecorations] = useState(predefinedAssets);
  const [selectedItem, setSelectedItem] = useState(null);
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'decoration' or 'canvas'

  const addItem = (type, content) => {
    setItems([
      ...items,
      { id: Date.now(), type, content, x: 50, y: 50, size: 100, paddingLeft: 2, paddingRight: 2, paddingTop: 2, paddingBottom: 2, rotation: 0, stickerColor: templates[theme].stickerColor },
    ]);
  };

  const updateItem = (updatedItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleDeleteRequest = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDialog(true); // Show confirmation dialog
  };

  const confirmDelete = () => {
    if (deleteType === 'decoration') {
      setDecorations(decorations.filter((decoration) => decoration !== itemToDelete));
    } else if (deleteType === 'canvas') {
      setItems(items.filter((item) => item.id !== itemToDelete.id));
    }
    setShowDialog(false); // Close the dialog after deleting
    setItemToDelete(null);
    setDeleteType(null);
  };

  const handleSettingChange = (property, value) => {
    if (selectedItem) {
      const newItem = { ...selectedItem, [property]: value };
      updateItem(newItem);
      setPosition({ x: newItem.x, y: newItem.y }); // Update local position state
      console.log(`Updated ${property}:`, value); // Log the change
    }
  };

  const exportScrapbook = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Determine the bounding box of all items
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    items.forEach(item => {
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + item.size);
      maxY = Math.max(maxY, item.y + item.size);
    });

    // Add padding
    const padding = 50;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    // Set canvas size to fit all items
    canvas.width = maxX - minX;
    canvas.height = maxY - minY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the background using the template's background color
    const bgColor = templates[theme].fillcolor || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all items on the canvas
    const drawItems = items.map((item) => {
      return new Promise((resolve) => {
        ctx.save();
        ctx.translate(item.x - minX, item.y - minY);
        ctx.rotate((item.rotation * Math.PI) / 180);

        if (item.type === "image") {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = item.content;

          img.onload = () => {
            ctx.drawImage(img, -item.size / 2, -item.size / 2, item.size, item.size);
            ctx.restore();
            resolve();
          };

          img.onerror = () => {
            console.warn("Image failed to load: ", item.content);
            ctx.restore();
            resolve();
          };
        } else if (item.type === "text") {
          ctx.font = `${item.fontSize || 16}px Arial`;
          ctx.fillStyle = item.bgColor || "#ffffff"; // Use the bgColor for background
          const textWidth = ctx.measureText(item.content).width;
          ctx.fillRect(-textWidth / 2 - 5, -item.fontSize / 2 - 5, textWidth + 10, item.fontSize + 10); // Draw background
          ctx.fillStyle = item.fontColor || "#000"; // Set text color
          ctx.fillText(item.content, -textWidth / 2, item.fontSize / 2); // Draw text
          ctx.restore();
          resolve();
        } else if (item.type === "sticker") {
          ctx.font = `${item.size}px Arial`;
          ctx.fillText(item.content, -item.size / 2, item.size / 2);
          ctx.restore();
          resolve();
        } else {
          ctx.restore();
          resolve();
        }
      });
    });

    Promise.all(drawItems).then(() => {
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "scrapbook.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error exporting scrapbook: ", error);
      }
    });
  };

  const addDecoration = (imageUrl) => {
    setDecorations([...decorations, imageUrl]);
    setDecorationImageUrl(""); // Clear the decoration input field after adding
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Pane (Theme, Stickers, and Decorations) */}
      <div className="w-full lg:w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Theme</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{theme}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(templates).map((t) => (
              <DropdownMenuItem key={t} onSelect={() => setTheme(t)}>
                {t}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <h2 className="text-2xl font-bold mt-8 mb-4">Stickers</h2>
        <div className="grid grid-cols-6 gap-2">
          {stickers.map((sticker) => (
            <span key={sticker} onClick={() => addItem("sticker", sticker)} className={`text-2xl ${templates[theme].stickerColor}`}>
              {sticker}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Decorations</h2>
        <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
          {decorations.map((decoration, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setItemToDelete(decoration)}
              onMouseLeave={() => setItemToDelete(null)}
            >
              <img src={decoration} alt="Decoration" className="cursor-pointer w-full h-auto" onClick={() => addItem("image", decoration)} />
            </div>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Add decoration image URL"
          value={decorationImageUrl}
          onChange={(e) => setDecorationImageUrl(e.target.value)}
          className="mt-2"
        />
        <Button className="mt-2 w-full" onClick={() => addDecoration(decorationImageUrl)}>
          Add Decoration
        </Button>
      </div>

      {/* Canvas (Middle Pane) */}
      <div id="canvas" className={`flex-grow min-h-[50vh] lg:min-h-0 lg:h-full p-4 ${templates[theme].bg} ${templates[theme].text} relative overflow-hidden`}>
        {items.map((item) => (
          <ScrapbookItem key={item.id} item={item} onUpdate={updateItem} onDelete={(item) => handleDeleteRequest(item, 'canvas')} onSelect={setSelectedItem} />
        ))}
      </div>

      {/* Right Pane (Controls and Settings) */}
      <div className="w-full lg:w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Image</h2>
        <Input
          type="text"
          placeholder="Add image to scrapbook"
          value={canvasImageUrl}
          onChange={(e) => setCanvasImageUrl(e.target.value)}
        />
        <Button className="mt-2 w-full" onClick={() => addItem("image", canvasImageUrl)}>
          Add Image
        </Button>

        <h2 className="text-2xl font-bold mt-4 mb-4">Add Text</h2>
        <Input type="text" placeholder="Enter text" value={text} onChange={(e) => setText(e.target.value)} />
        <Button className="mt-2 w-full" onClick={() => addItem("text", text)}>
          Add Text
        </Button>

        {selectedItem ? (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">Settings</h2>
            <div className="space-y-4">
              {/* Rotation */}
              <div>
                <label className="block font-bold mb-2">Rotation</label>
                <Slider value={[selectedItem.rotation]} min={0} max={360} onValueChange={(value) => handleSettingChange("rotation", value[0])} />
              </div>

              {selectedItem.type === "image" && (
                <>
                  {/* Size */}
                  <div>
                    <label className="block font-bold mb-2">Size</label>
                    <Slider value={[selectedItem.size]} min={50} max={500} onValueChange={(value) => handleSettingChange("size", value[0])} />
                  </div>
                  {/* Border Radius (for images) */}
                  <div>
                    <label className="block font-bold mb-2">Border Radius</label>
                    <Slider value={[selectedItem.borderRadius || 0]} min={0} max={50} onValueChange={(value) => handleSettingChange("borderRadius", value[0])} />
                  </div>
                </>
              )}

              {/* Opacity */}
              <div>
                <label className="block font-bold mb-2">Opacity</label>
                <Slider value={[selectedItem.opacity || 1]} min={0.1} max={1} step={0.1} onValueChange={(value) => handleSettingChange("opacity", value[0])} />
              </div>

              {/* Font Settings (for text) */}
              {selectedItem.type === "text" && (
                <>
                  <div>
                    <label className="block font-bold mb-2">Font Size</label>
                    <Slider value={[selectedItem.fontSize || 16]} min={12} max={100} onValueChange={(value) => handleSettingChange("fontSize", value[0])} />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block font-bold mb-2">Size</label>
                    <Slider value={[selectedItem.size]} min={50} max={500} onValueChange={(value) => handleSettingChange("size", value[0])} />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Padding</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Slider value={[selectedItem.paddingTop]} min={1} max={20} onValueChange={(value) => handleSettingChange("paddingTop", value[0])} />
                      <Slider value={[selectedItem.paddingBottom]} min={1} max={20} onValueChange={(value) => handleSettingChange("paddingBottom", value[0])} />
                      <Slider value={[selectedItem.paddingLeft]} min={1} max={20} onValueChange={(value) => handleSettingChange("paddingLeft", value[0])} />
                      <Slider value={[selectedItem.paddingRight]} min={1} max={20} onValueChange={(value) => handleSettingChange("paddingRight", value[0])} />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Font Color</label>
                    <Input type="color" value={selectedItem.fontColor || "#000000"} onChange={(e) => handleSettingChange("fontColor", e.target.value)} />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Background Color</label>
                    <Input type="color" value={selectedItem.bgColor || "#ffffff"} onChange={(e) => handleSettingChange("bgColor", e.target.value)} />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">Border Radius</label>
                    <Slider value={[selectedItem.borderRadius || 0]} min={0} max={50} onValueChange={(value) => handleSettingChange("borderRadius", value[0])} />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <h6 className="mt-4">Select an item to edit its settings.</h6>
        )}
        
        <Button className="mt-8 w-full" onClick={exportScrapbook}>
          Export Scrapbook
        </Button>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" width={800} height={600} />
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this item?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
