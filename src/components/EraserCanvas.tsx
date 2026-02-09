import { useRef, useEffect, useCallback, useState } from "react";

interface EraserCanvasProps {
  imageUrl: string;
  brushSize: number;
  backgroundColor: string | null;
  onEdit: (blob: Blob) => void;
}

export function EraserCanvas({ imageUrl, brushSize, backgroundColor, onEdit }: EraserCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Load image onto canvas
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const getContainerCoords = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const drawStroke = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }, [brushSize]);

  const emitBlob = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) onEdit(blob);
    }, "image/png");
  }, [onEdit]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDrawing.current = true;
    const pos = getCanvasCoords(e.clientX, e.clientY);
    lastPos.current = pos;
    // Draw a dot at click point
    drawStroke(pos, pos);
  }, [getCanvasCoords, drawStroke]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos(getContainerCoords(e.clientX, e.clientY));
    if (!isDrawing.current || !lastPos.current) return;
    const pos = getCanvasCoords(e.clientX, e.clientY);
    drawStroke(lastPos.current, pos);
    lastPos.current = pos;
  }, [getCanvasCoords, getContainerCoords, drawStroke]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPos.current = null;
      emitBlob();
    }
  }, [emitBlob]);

  const handleMouseLeave = useCallback(() => {
    setCursorPos(null);
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPos.current = null;
      emitBlob();
    }
  }, [emitBlob]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const touch = e.touches[0];
    const pos = getCanvasCoords(touch.clientX, touch.clientY);
    lastPos.current = pos;
    drawStroke(pos, pos);
  }, [getCanvasCoords, drawStroke]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current || !lastPos.current) return;
    const touch = e.touches[0];
    const pos = getCanvasCoords(touch.clientX, touch.clientY);
    drawStroke(lastPos.current, pos);
    lastPos.current = pos;
  }, [getCanvasCoords, drawStroke]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPos.current = null;
      emitBlob();
    }
  }, [emitBlob]);

  // Compute CSS cursor size (brush in image pixels → CSS pixels)
  const getCursorSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return brushSize;
    const rect = canvas.getBoundingClientRect();
    return brushSize * (rect.width / canvas.width);
  };

  const bgClass = backgroundColor ? "" : "checkerboard";
  const bgStyle = backgroundColor ? { backgroundColor } : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${bgClass}`}
      style={{ ...bgStyle, cursor: "none" }}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="max-h-72 w-auto rounded-md object-contain"
        style={{ display: dimensions.width ? "block" : "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {cursorPos && (
        <div
          className="pointer-events-none absolute rounded-full border-2 border-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{
            width: getCursorSize(),
            height: getCursorSize(),
            left: cursorPos.x - getCursorSize() / 2,
            top: cursorPos.y - getCursorSize() / 2,
          }}
        />
      )}
    </div>
  );
}
