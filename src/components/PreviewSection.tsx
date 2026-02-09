import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, RotateCcw, Copy, ExternalLink, Check, Plus, Eraser, Undo2 } from "lucide-react";
import { EraserCanvas } from "@/components/EraserCanvas";
import type { ProcessingStatus } from "@/hooks/useBackgroundRemoval";

const PRESET_COLORS: { color: string | null; label: string }[] = [
  { color: null, label: "Transparent" },
  { color: "#FFFFFF", label: "White" },
  { color: "#E5E7EB", label: "Gray" },
  { color: "#1E3A5F", label: "Navy" },
];

interface PreviewSectionProps {
  originalUrl: string;
  resultUrl: string | null;
  status: ProcessingStatus;
  statusMessage: string;
  error: string | null;
  errorLog: string | null;
  onDownload: () => void;
  onReset: () => void;
  downloadWithBackground: (color: string | null) => void;
  onUpdateResult: (blob: Blob) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function PreviewSection({
  originalUrl,
  resultUrl,
  status,
  statusMessage,
  error,
  errorLog,
  onDownload,
  onReset,
  downloadWithBackground,
  onUpdateResult,
  onUndo,
  canUndo,
}: PreviewSectionProps) {
  const isProcessing = status === "loading-model" || status === "processing";
  const progressValue = status === "loading-model" ? 30 : status === "processing" ? 70 : 100;
  const [copied, setCopied] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [eraserActive, setEraserActive] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    if (!errorLog) return;
    await navigator.clipboard.writeText(errorLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const issueUrl = errorLog
    ? `https://github.com/raoulcapello/private-photo-studio/issues/new?title=${encodeURIComponent("Processing error: " + (error || "Unknown"))}&body=${encodeURIComponent(errorLog)}`
    : "#";

  const resultBgStyle = selectedColor
    ? { backgroundColor: selectedColor }
    : undefined;

  const resultBgClass = selectedColor ? "" : "checkerboard";

  return (
    <section className="flex flex-col items-center gap-8 px-4 pb-16">
      <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        {/* Before */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Original
            </div>
            <div className="flex items-center justify-center p-4">
              <img
                src={originalUrl}
                alt="Original photo"
                className="max-h-72 w-auto rounded-md object-contain"
              />
            </div>
          </CardContent>
        </Card>

        {/* After */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Result
            </div>
            <div
              className={`flex items-center justify-center p-4 min-h-[280px] ${resultBgClass}`}
              style={resultBgStyle}
            >
              {isProcessing && (
                <div className="flex flex-col items-center gap-3 w-full px-4">
                  <Progress value={progressValue} className="w-full" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    {statusMessage}
                  </p>
                </div>
              )}
              {status === "done" && resultUrl && !eraserActive && (
                <img
                  src={resultUrl}
                  alt="Background removed"
                  className="max-h-72 w-auto rounded-md object-contain"
                />
              )}
              {status === "done" && resultUrl && eraserActive && (
                <EraserCanvas
                  imageUrl={resultUrl}
                  brushSize={brushSize}
                  backgroundColor={selectedColor}
                  onEdit={onUpdateResult}
                />
              )}
              {status === "error" && (
                <div className="flex flex-col items-center gap-3 w-full px-4">
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                  {errorLog && (
                    <>
                      <pre className="mt-2 w-full max-h-40 overflow-auto rounded-md bg-muted p-3 text-[10px] leading-tight font-mono text-muted-foreground whitespace-pre-wrap break-all">
                        {errorLog}
                      </pre>
                      <div className="flex flex-wrap justify-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={handleCopy}
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copied ? "Copied!" : "Copy error log"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          asChild
                        >
                          <a href={issueUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                            Report issue
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eraser toolbar */}
      {status === "done" && resultUrl && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant={eraserActive ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setEraserActive((v) => !v)}
          >
            <Eraser className="h-4 w-4" />
            Eraser
          </Button>
          {eraserActive && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Size:</span>
                <Slider
                  value={[brushSize]}
                  onValueChange={([v]) => setBrushSize(v)}
                  min={5}
                  max={80}
                  step={1}
                  className="w-28"
                />
              </div>
              {canUndo && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={onUndo}>
                  <Undo2 className="h-4 w-4" />
                  Undo
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* Color variants */}
      {status === "done" && resultUrl && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESET_COLORS.map(({ color, label }) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={label}
                title={label}
                onClick={() => setSelectedColor(color)}
                className={`relative h-10 w-10 rounded-md border-2 overflow-hidden transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 scale-110"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`absolute inset-0 ${color ? "" : "checkerboard"}`}
                  style={color ? { backgroundColor: color } : undefined}
                />
                <img
                  src={resultUrl}
                  alt={label}
                  className="relative h-full w-full object-contain"
                />
              </button>
            );
          })}

          {/* Custom color */}
          {customColor && (
            <button
              title={`Custom (${customColor})`}
              onClick={() => setSelectedColor(customColor)}
              className={`relative h-10 w-10 rounded-md border-2 overflow-hidden transition-all ${
                selectedColor === customColor
                  ? "border-primary ring-2 ring-primary/30 scale-110"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundColor: customColor }}
              />
              <img
                src={resultUrl}
                alt="Custom color"
                className="relative h-full w-full object-contain"
              />
            </button>
          )}

          <button
            title="Custom color"
            onClick={() => colorInputRef.current?.click()}
            className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-dashed border-border hover:border-primary/50 transition-colors"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            <input
              ref={colorInputRef}
              type="color"
              className="sr-only"
              value={customColor || "#FF5733"}
              onChange={(e) => {
                const c = e.target.value;
                setCustomColor(c);
                setSelectedColor(c);
              }}
            />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        {status === "done" && (
          <Button size="lg" className="gap-2 px-8" onClick={() => downloadWithBackground(selectedColor)}>
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
        )}
        <Button variant="outline" size="lg" className="gap-2" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Try another photo
        </Button>
      </div>
    </section>
  );
}
