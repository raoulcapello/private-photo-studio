import { useState, useCallback, useRef } from "react";

export type ProcessingStatus = "idle" | "loading-model" | "processing" | "done" | "error";

interface BackgroundRemovalState {
  status: ProcessingStatus;
  statusMessage: string;
  resultUrl: string | null;
  error: string | null;
  errorLog: string | null;
}

/**
 * Generic retry wrapper for async operations that may transiently fail.
 *
 * **Why this exists:** Android Chrome intermittently throws
 * `InvalidStateError: The source image could not be decoded` when loading
 * images via `URL.createObjectURL()` + `new Image()`. The failure is caused
 * by resource contention between the browser's image decoder and WASM memory
 * allocation during model loading. Retrying after a short delay succeeds.
 *
 * **How it ties in:** The optional `onRetry` callback lets callers (e.g.
 * `processImage`) update the React status message shown in `PreviewSection`,
 * so the user sees "Preparing image (attempt 2 of 3)…" instead of silence.
 *
 * @param fn        - The async operation to attempt.
 * @param options.maxAttempts - How many times to try before giving up (default 3).
 * @param options.delayMs     - Milliseconds to wait between retries (default 500).
 * @param options.onRetry     - Called before each retry with (attemptNumber, maxAttempts).
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    onRetry?: (attempt: number, maxAttempts: number) => void;
  } = {},
): Promise<T> {
  const { maxAttempts = 3, delayMs = 500, onRetry } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt) throw err;

      // Log retry for diagnostics — helpful when reading error reports.
      console.warn(
        `[withRetry] Attempt ${attempt}/${maxAttempts} failed, retrying in ${delayMs}ms:`,
        err,
      );

      // Notify caller so it can update UI (e.g. status message).
      onRetry?.(attempt + 1, maxAttempts);

      // Wait before retrying — gives the browser time to release decoder resources.
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // TypeScript: unreachable, but satisfies the compiler.
  throw new Error("withRetry: exhausted attempts");
}

/**
 * Load a Blob as an HTMLImageElement.
 *
 * Uses `<img>` element instead of `createImageBitmap` because the latter is
 * flaky on Android Chrome (see docs/android-image-decode-retry.md).
 *
 * Wrapped with `withRetry` internally to handle transient decode failures
 * caused by browser resource pressure during WASM model loading.
 */
function loadImageFromBlob(
  blob: Blob,
  retryOptions?: Parameters<typeof withRetry>[1],
): Promise<HTMLImageElement> {
  return withRetry(
    () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
        img.src = url;
      }),
    retryOptions,
  );
}

/**
 * Downscale an image file if either dimension exceeds maxDim.
 * Uses an <img> element for decoding (more compatible on Android than createImageBitmap).
 * Returns the original file as-is if already within bounds.
 *
 * Why 2048px? Android WebGPU max texture size is commonly 4096-8192, but
 * real-world failures happen well below that due to GPU memory pressure.
 * 2048px preserves good quality while fitting comfortably in mobile GPU memory.
 *
 * The internal image load is wrapped with `withRetry` to handle transient
 * `InvalidStateError` on Android Chrome (see docs/android-image-decode-retry.md).
 */
async function resizeImageFile(
  file: File,
  maxDim = 2048,
  retryOptions?: Parameters<typeof withRetry>[1],
): Promise<Blob> {
  // Wrap the image loading step in retry logic — this is the step that
  // intermittently fails on Android Chrome under WASM memory pressure.
  const img = await withRetry(
    () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const el = new Image();
        el.onload = () => { URL.revokeObjectURL(url); resolve(el); };
        el.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image for resizing")); };
        el.src = url;
      }),
    retryOptions,
  );

  const { naturalWidth: w, naturalHeight: h } = img;
  if (w <= maxDim && h <= maxDim) {
    return file;
  }

  const scale = Math.min(maxDim / w, maxDim / h);
  const nw = Math.round(w * scale);
  const nh = Math.round(h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = nw;
  canvas.height = nh;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, nw, nh);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to resize image"));
    }, "image/png");
  });
}

/**
 * Detect if the current device is mobile.
 * Uses a combination of user agent and screen size heuristics.
 */
function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  // Fallback: small screen likely means mobile
  if (window.screen.width <= 768 || window.screen.height <= 768) {
    return true;
  }
  return false;
}

/**
 * Build a structured error report for diagnostics and bug filing.
 */
function buildErrorLog(
  device: "webgpu" | "wasm",
  file: File,
  err: any,
): string {
  const lines = [
    "--- Private Photo Studio Error Report ---",
    `Time: ${new Date().toISOString()}`,
    `Browser: ${navigator.userAgent}`,
    `Screen: ${window.screen.width}x${window.screen.height}`,
    `Device: ${device}`,
    `Mobile detected: ${isMobileDevice()}`,
    `Image: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB, ${file.type})`,
    `Error: ${err?.message || String(err)}`,
    `Stack: ${err?.stack || "N/A"}`,
  ];
  return lines.join("\n");
}

export function useBackgroundRemoval() {
  const [state, setState] = useState<BackgroundRemovalState>({
    status: "idle",
    statusMessage: "",
    resultUrl: null,
    error: null,
    errorLog: null,
  });
  const resultBlobRef = useRef<Blob | null>(null);
  const historyRef = useRef<Blob[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const processImage = useCallback(async (file: File) => {
    setState({ status: "loading-model", statusMessage: "Loading model…", resultUrl: null, error: null, errorLog: null });

    // Choose backend: WASM on mobile (more reliable), WebGPU on desktop
    const mobile = isMobileDevice();
    let device: "webgpu" | "wasm" = "wasm";

    if (!mobile && "gpu" in navigator) {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (adapter) device = "webgpu";
      } catch {
        // fall back to wasm
      }
    }

    const reason = mobile ? "mobile device detected" : device === "webgpu" ? "desktop with WebGPU" : "WebGPU unavailable";

    try {
      const { pipeline, RawImage } = await import("@huggingface/transformers");

      // Pre-process: downscale large images to stay within GPU limits.
      // Retry options update the status message so the user sees progress
      // during transient Android decode failures (see docs/android-image-decode-retry.md).
      const resizedBlob = await resizeImageFile(file, 2048, {
        maxAttempts: 3,
        delayMs: 500,
        onRetry: (attempt, max) => {
          setState((s) => ({
            ...s,
            statusMessage: `Preparing image (attempt ${attempt} of ${max})…`,
          }));
        },
      });

      setState((s) => ({ ...s, statusMessage: `Loading model (${device}, ${reason})…` }));

      const segmenter = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
        device,
      });

      setState((s) => ({ ...s, status: "processing", statusMessage: "Removing background…" }));

      const imageUrl = URL.createObjectURL(resizedBlob);
      const result = await segmenter(imageUrl);
      URL.revokeObjectURL(imageUrl);

      // result is an array with mask data — get the first result
      const maskData = result[0];

      // Load resized image to composite (use resized blob for consistent dimensions).
      // Retry handles transient Android decode failures during compositing step.
      const rawImage = await RawImage.fromBlob(resizedBlob);
      const { width, height } = rawImage;

      // Create canvas for compositing
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // Draw the resized image — loadImageFromBlob retries internally on transient failures.
      const imgEl = await loadImageFromBlob(resizedBlob, {
        maxAttempts: 3,
        delayMs: 500,
        onRetry: (attempt, max) => {
          setState((s) => ({
            ...s,
            statusMessage: `Compositing image (attempt ${attempt} of ${max})…`,
          }));
        },
      });
      ctx.drawImage(imgEl, 0, 0);

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

      setState({ status: "done", statusMessage: "Done!", resultUrl: resultUrlNew, error: null, errorLog: null });
    } catch (err: any) {
      console.error("Background removal failed:", err);
      const errorLog = buildErrorLog(device, file, err);
      setState({
        status: "error",
        statusMessage: "",
        resultUrl: null,
        error: err?.message || "Something went wrong. Please try again.",
        errorLog,
      });
    }
  }, []);

  const updateResult = useCallback((blob: Blob) => {
    // Push current blob to history before replacing
    if (resultBlobRef.current) {
      historyRef.current = [...historyRef.current.slice(-19), resultBlobRef.current];
      setCanUndo(true);
    }
    resultBlobRef.current = blob;
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    const newUrl = URL.createObjectURL(blob);
    setState((s) => ({ ...s, resultUrl: newUrl }));
  }, [state.resultUrl]);

  const undoEdit = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current.pop()!;
    setCanUndo(historyRef.current.length > 0);
    resultBlobRef.current = prev;
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    const newUrl = URL.createObjectURL(prev);
    setState((s) => ({ ...s, resultUrl: newUrl }));
  }, [state.resultUrl]);

  const reset = useCallback(() => {
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    resultBlobRef.current = null;
    historyRef.current = [];
    setCanUndo(false);
    setState({ status: "idle", statusMessage: "", resultUrl: null, error: null, errorLog: null });
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

  const downloadWithBackground = useCallback(async (color: string | null) => {
    if (!resultBlobRef.current) return;
    if (!color) {
      downloadResult();
      return;
    }
    const img = await loadImageFromBlob(resultBlobRef.current);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "background-removed.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [downloadResult]);

  return { ...state, processImage, reset, downloadResult, downloadWithBackground, updateResult, undoEdit, canUndo };
}
