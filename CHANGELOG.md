# Changelog

## 2026-02-09

### Fixed: Android "Source image could not be decoded" error

**Problem:** Android phone cameras produce very large images (12MP+, often 4000×3000px or more). When passed directly to the Transformers.js pipeline with WebGPU, the image can exceed the device's maximum texture size or available GPU memory, causing `createImageBitmap()` or the WebGPU backend to throw "The source image could not be decoded." Desktop GPUs have much higher limits, which is why it worked on Mac.

**Solution:**
- **Image downscaling:** Added a `resizeImageFile` helper that downscales images exceeding 2048px (either dimension) before inference. Uses an `<img>` element for decoding (more compatible on Android than `createImageBitmap`). The original full-resolution image is still shown in the "Original" preview.
- **WebGPU→WASM fallback:** If WebGPU inference fails, the app now automatically retries with the WASM backend and informs the user via a status message.

**Why 2048px?** Android WebGPU max texture size is commonly 4096–8192, but real-world failures happen well below that due to memory pressure. 2048px preserves good quality while fitting comfortably in mobile GPU memory.
