import { useState, useCallback } from "react";
import { HeroSection } from "@/components/HeroSection";
import { PreviewSection } from "@/components/PreviewSection";
import { PrivacyFooter } from "@/components/PrivacyFooter";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";

const Index = () => {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const { status, statusMessage, resultUrl, error, processImage, reset, downloadResult } =
    useBackgroundRemoval();

  const handleFileSelect = useCallback(
    (file: File) => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      setOriginalUrl(URL.createObjectURL(file));
      processImage(file);
    },
    [originalUrl, processImage]
  );

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalUrl(null);
    reset();
  }, [originalUrl, reset]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {!originalUrl ? (
          <HeroSection onFileSelect={handleFileSelect} />
        ) : (
          <div className="pt-12">
            <PreviewSection
              originalUrl={originalUrl}
              resultUrl={resultUrl}
              status={status}
              statusMessage={statusMessage}
              error={error}
              onDownload={downloadResult}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
      <PrivacyFooter />
    </div>
  );
};

export default Index;
