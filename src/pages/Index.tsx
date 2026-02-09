import { useState, useCallback } from "react";
import { HeroSection } from "@/components/HeroSection";
import { PreviewSection } from "@/components/PreviewSection";
import { PrivacyFooter } from "@/components/PrivacyFooter";
import { Header } from "@/components/Header";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";

const Index = () => {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const { status, statusMessage, resultUrl, error, errorLog, processImage, reset, downloadResult, downloadWithBackground } =
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
      <Header />
      <main className="flex-1 pt-14">
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
              errorLog={errorLog}
              onDownload={downloadResult}
              onReset={handleReset}
              downloadWithBackground={downloadWithBackground}
            />
          </div>
        )}
      </main>
      <PrivacyFooter />
    </div>
  );
};

export default Index;
