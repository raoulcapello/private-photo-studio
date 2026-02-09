import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Copy, ExternalLink, Check } from "lucide-react";
import type { ProcessingStatus } from "@/hooks/useBackgroundRemoval";

interface PreviewSectionProps {
  originalUrl: string;
  resultUrl: string | null;
  status: ProcessingStatus;
  statusMessage: string;
  error: string | null;
  errorLog: string | null;
  onDownload: () => void;
  onReset: () => void;
  onSimulateError?: () => void;
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
  onSimulateError,
}: PreviewSectionProps) {
  const isProcessing = status === "loading-model" || status === "processing";
  const progressValue = status === "loading-model" ? 30 : status === "processing" ? 70 : 100;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!errorLog) return;
    await navigator.clipboard.writeText(errorLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const issueUrl = errorLog
    ? `https://github.com/raoulcapello/private-photo-studio/issues/new?title=${encodeURIComponent("Processing error: " + (error || "Unknown"))}&body=${encodeURIComponent(errorLog)}`
    : "#";

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
            <div className="checkerboard flex items-center justify-center p-4 min-h-[280px]">
              {isProcessing && (
                <div className="flex flex-col items-center gap-3 w-full px-4">
                  <Progress value={progressValue} className="w-full" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    {statusMessage}
                  </p>
                </div>
              )}
              {status === "done" && resultUrl && (
                <img
                  src={resultUrl}
                  alt="Background removed"
                  className="max-h-72 w-auto rounded-md object-contain"
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

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        {status === "done" && (
          <Button size="lg" className="gap-2 px-8" onClick={onDownload}>
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
        )}
        <Button variant="outline" size="lg" className="gap-2" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Try another photo
        </Button>
        {status === "done" && onSimulateError && (
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={onSimulateError}>
            Test error report
          </Button>
        )}
      </div>
    </section>
  );
}
