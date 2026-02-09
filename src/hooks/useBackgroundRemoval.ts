import { useState, useCallback, useRef } from "react";

export type ProcessingStatus = "idle" | "loading-model" | "processing" | "done" | "error";

interface BackgroundRemovalState {
  status: ProcessingStatus;
  statusMessage: string;
  resultUrl: string | null;
  error: string | null;
}

/**
 * Downscale an image file if either dimension exceeds maxDim.
 * Uses an <img> element for decoding (more compatible on Android than createImageBitmap).
 * Returns the original file as-is if already within bounds.
 *
 * Why 2048px? Android WebGPU max texture size is commonly 4096-8192, but
 * real-world failures happen well below that due to GPU memory pressure.
 * 2048px preserves good quality while fitting comfortably in mobile GPU memory.
 */
async function resizeImageFile(file: File, maxDim = 2048): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;
      if (w <= maxDim && h <= maxDim) {
        resolve(file);
        return;
      }
      const scale = Math.min(maxDim / w, maxDim / h);
      const nw = Math.round(w * scale);
      const nh = Math.round(h * scale);
      const canvas = document.createElement("canvas");
      canvas.width = nw;
      canvas.height = nh;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, nw, nh);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to resize image"));
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for resizing"));
    };
    img.src = url;
  });
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

      // Pre-process: downscale large images to stay within mobile GPU limits
      const resizedBlob = await resizeImageFile(file);

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

      let segmenter: any = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
        device,
      });

      setState((s) => ({ ...s, status: "processing", statusMessage: "Removing background…" }));

      const imageUrl = URL.createObjectURL(resizedBlob);
      let result: any;

      // Run inference with WebGPU→WASM fallback
      try {
        result = await segmenter(imageUrl);
      } catch (inferenceError) {
        if (device === "webgpu") {
          console.warn("WebGPU inference failed, retrying with WASM:", inferenceError);
          setState((s) => ({ ...s, statusMessage: "WebGPU failed, retrying with CPU…" }));
          // Dispose previous pipeline and retry with WASM
          await segmenter.dispose();
          segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
            device: "wasm",
          });
          result = await segmenter(imageUrl);
        } else {
          throw inferenceError;
        }
      }

      URL.revokeObjectURL(imageUrl);

      // result is an array with mask data — get the first result
      const maskData = result[0];

      // Load resized image to composite (use resized blob for consistent dimensions)
      const rawImage = await RawImage.fromBlob(resizedBlob);
      const { width, height } = rawImage;

      // Create canvas for compositing
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // Draw the resized image
      const imgBitmap = await createImageBitmap(resizedBlob);
      ctx.drawImage(imgBitmap, 0, 0);

      // Get the mask as a RawImage and resize to match
      const mask = maskData.mask;
      const resizedMask = await mask.resize(width, height);

      // Apply mask as alpha channel
      const imageData = ctx.getImageData(0, 0, width, height);
      const maskPixels = resizedMask.data;

      for (let i = 0; i < width * height; i++) {
        imageData.data[i * 4 + 3] = maskPixels[i];
      }

      ctx.putImageData(imageData, 0, 0);

      // Export as PNG blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );

      resultBlobRef.current = blob;
      const resultUrlNew = URL.createObjectURL(blob);

      setState({ status: "done", statusMessage: "Done!", resultUrl: resultUrlNew, error: null });
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
