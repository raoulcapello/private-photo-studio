# Changelog

## 2026-02-09

### Changed: WASM by default on mobile, error reporting

**Problem:** Chrome on Android consistently fails with WebGPU even after image downscaling. Firefox (WASM) works fine.

**Solution:**
- **Mobile detection:** The app now detects mobile devices via user agent and screen size. Mobile devices default to WASM (CPU) inference, bypassing unreliable WebGPU. Desktop devices still use WebGPU when available.
- **Error reporting:** On failure, a structured error log is generated containing browser info, screen size, image metadata, and the full error/stack. Users can copy the log or open a pre-filled GitHub issue directly from the error UI.

### Fixed: Android "Source image could not be decoded" error

**Problem:** Android phone cameras produce very large images (12MP+, often 4000×3000px or more). When passed directly to the Transformers.js pipeline with WebGPU, the image can exceed the device's maximum texture size or available GPU memory, causing `createImageBitmap()` or the WebGPU backend to throw "The source image could not be decoded." Desktop GPUs have much higher limits, which is why it worked on Mac.

**Solution:**
- **Image downscaling:** Added a `resizeImageFile` helper that downscales images exceeding 2048px (either dimension) before inference. Uses an `<img>` element for decoding (more compatible on Android than `createImageBitmap`). The original full-resolution image is still shown in the "Original" preview.

**Why 2048px?** Android WebGPU max texture size is commonly 4096–8192, but real-world failures happen well below that due to memory pressure. 2048px preserves good quality while fitting comfortably in mobile GPU memory.
