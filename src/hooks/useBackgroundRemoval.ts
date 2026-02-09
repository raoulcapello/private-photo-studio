import { useState, useCallback, useRef } from "react";

export type ProcessingStatus = "idle" | "loading-model" | "processing" | "done" | "error";

interface BackgroundRemovalState {
  status: ProcessingStatus;
  statusMessage: string;
  resultUrl: string | null;
  error: string | null;
}

export function useBackgroundRemoval() {
  const [state, setState] = useState<BackgroundRemovalState>({
    status: "idle",
    statusMessage: "",
    resultUrl: null,
    error: null,
  });
  const resultBlobRef = useRef<Blob | null>(null);

  const processImage = useCallback(async (file: File) => {
    setState({ status: "loading-model", statusMessage: "Loading model…", resultUrl: null, error: null });

    try {
      const { pipeline, RawImage } = await import("@huggingface/transformers");

      // Check WebGPU support
      let device: "webgpu" | "wasm" = "wasm";
      if ("gpu" in navigator) {
        try {
          const adapter = await (navigator as any).gpu.requestAdapter();
          if (adapter) device = "webgpu";
        } catch {
          // fall back to wasm
        }
      }

      setState((s) => ({ ...s, statusMessage: `Loading model (${device})…` }));

      const segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
        device,
      });

      setState((s) => ({ ...s, status: "processing", statusMessage: "Removing background…" }));

      const imageUrl = URL.createObjectURL(file);
      const result = await segmenter(imageUrl);
      URL.revokeObjectURL(imageUrl);

      // result is an array with mask data — get the first result
      const maskData = (result as any)[0];

      // Load original image to composite
      const rawImage = await RawImage.fromBlob(file);
      const { width, height } = rawImage;

      // Create canvas for compositing
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // Draw original image
      const imgBitmap = await createImageBitmap(file);
      ctx.drawImage(imgBitmap, 0, 0);

      // Get the mask as a RawImage and resize to match original
      const mask = maskData.mask;
      const resizedMask = await mask.resize(width, height);

      // Apply mask as alpha channel
      const imageData = ctx.getImageData(0, 0, width, height);
      const maskPixels = resizedMask.data;

      for (let i = 0; i < width * height; i++) {
        // mask is single-channel (grayscale), use it as alpha
        imageData.data[i * 4 + 3] = maskPixels[i];
      }

      ctx.putImageData(imageData, 0, 0);

      // Export as PNG blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );

      resultBlobRef.current = blob;
      const resultUrl = URL.createObjectURL(blob);

      setState({ status: "done", statusMessage: "Done!", resultUrl, error: null });
    } catch (err: any) {
      console.error("Background removal failed:", err);
      setState({
        status: "error",
        statusMessage: "",
        resultUrl: null,
        error: err?.message || "Something went wrong. Please try again.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    resultBlobRef.current = null;
    setState({ status: "idle", statusMessage: "", resultUrl: null, error: null });
  }, [state.resultUrl]);

  const downloadResult = useCallback(() => {
    if (!resultBlobRef.current) return;
    const url = URL.createObjectURL(resultBlobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = "background-removed.png";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { ...state, processImage, reset, downloadResult };
}
