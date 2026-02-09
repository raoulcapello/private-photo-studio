
## Fix "Source image could not be decoded" on Android

### Root Cause

Android phone cameras produce very large images (12MP+, often 4000x3000 pixels or more). When passed directly to the Transformers.js pipeline with WebGPU, the image can exceed the device's maximum texture size or available GPU memory, causing `createImageBitmap()` or the WebGPU backend to throw "The source image could not be decoded."

Desktop GPUs have much higher limits, which is why it works on Mac.

### Solution

**Pre-process (downscale) the image before inference**, and add a **graceful fallback from WebGPU to WASM** if inference still fails.

---

### Changes to `src/hooks/useBackgroundRemoval.ts`

**1. Add a helper function to downscale images**

Create a `resizeImageFile` helper that:
- Loads the file into an `<img>` element (more compatible than `createImageBitmap` for this step)
- If either dimension exceeds a max threshold (e.g., 2048px), scales it down proportionally
- Returns a new `Blob` from a canvas
- This ensures the image stays within Android WebGPU texture limits

**2. Call the resize helper before processing**

Before passing the image to the segmenter pipeline, resize the file. The resized blob is used for both the pipeline input and the canvas compositing step. The original file's object URL is still shown as the "before" preview (handled in `Index.tsx`, unchanged).

**3. Add WebGPU-to-WASM retry logic**

Wrap the segmenter call in a try/catch. If it fails with WebGPU, retry with WASM as the device. Update the status message to inform the user of the fallback.

**4. Use the resized image consistently**

Both `segmenter(imageUrl)` (line 47) and `RawImage.fromBlob(file)` (line 54) and `createImageBitmap(file)` (line 64) should use the resized blob instead of the original file, so all processing stays within safe dimensions.

---

### Pseudocode for resize helper

```text
async function resizeImageFile(file: File, maxDim = 2048): Promise<Blob>
  1. Create an Image element, load the file via object URL
  2. Wait for it to load
  3. If width <= maxDim AND height <= maxDim, return original file as-is
  4. Calculate new dimensions maintaining aspect ratio
  5. Draw onto a canvas at the new size
  6. Export canvas as PNG blob
  7. Return the resized blob
```

### Pseudocode for retry logic

```text
try:
  result = await segmenter(imageUrl)   // using chosen device (webgpu or wasm)
catch (inferenceError):
  if device was "webgpu":
    update status: "WebGPU failed, retrying with CPU..."
    recreate segmenter with device = "wasm"
    result = await segmenter(imageUrl)  // retry with wasm
  else:
    throw inferenceError                // already on wasm, nothing to fall back to
```

---

### Files to modify

| File | Change |
|------|--------|
| `src/hooks/useBackgroundRemoval.ts` | Add `resizeImageFile` helper, use it before inference, add WebGPU-to-WASM fallback |

### Why 2048px max?

- Android WebGPU max texture size is commonly 4096 or 8192, but real-world failures happen well below that due to memory pressure
- 2048px is a safe ceiling that preserves good quality while fitting comfortably in mobile GPU memory
- The original full-resolution image is still shown in the "Original" preview card (unchanged)

### Document the why
- Ensure sufficient documentation in comments, any relevant existing docs (except the readme), and the changelog doc (create if it doesn't exist yet)
