# Verifying Browser-Only Processing

The core promise of this app is that your photos never leave your device. Here's how to confirm that.

---

## Method 1: Network Inspection

1. Open the app in your browser
2. Open DevTools (F12 or Cmd+Shift+I)
3. Go to the **Network** tab
4. Clear the network log, then select and process an image

**What you SHOULD see:**
- Model files fetched from `huggingface.co` (config, weights — these are the AI model, not your image)
- WASM runtime files from `cdn.jsdelivr.net` (only if WebGPU is unavailable)

**What you should NEVER see:**
- Any POST request containing image data
- Any request to a server with your photo as payload
- Any upload to cloud storage

The model files are one-time downloads cached by your browser. Your actual image data stays local.

---

## Method 2: Code Review

The processing logic lives in `src/hooks/useBackgroundRemoval.ts`. Key evidence:

**Lines 46-48 — Image stays local:**
```typescript
const imageUrl = URL.createObjectURL(file);
const result = await segmenter(imageUrl);
URL.revokeObjectURL(imageUrl);
```
`URL.createObjectURL()` creates an in-memory reference to the file. It's a `blob:` URL that only exists in your browser's memory — it cannot be accessed by any server.

**Lines 58-80 — Canvas compositing:**
```typescript
const canvas = document.createElement("canvas");
// ... drawing and mask application
ctx.putImageData(imageData, 0, 0);
```
All pixel manipulation happens via the browser's native `CanvasRenderingContext2D` API. This is a client-side graphics API with no network capability.

**Lines 83-85 — Result export:**
```typescript
const blob = await new Promise<Blob>((resolve) =>
  canvas.toBlob((b) => resolve(b!), "image/png")
);
```
`canvas.toBlob()` generates the final PNG entirely in memory. The blob is then wrapped in another local URL for download.

---

## Method 3: Understanding the Runtime

The `@huggingface/transformers` library runs AI models directly in the browser using:

- **WebGPU** (preferred): Hardware-accelerated inference on your GPU
- **WASM** (fallback): CPU-based inference via WebAssembly

Both are client-side runtimes. The model weights are downloaded once and cached, but all inference (the actual image processing) happens locally.
