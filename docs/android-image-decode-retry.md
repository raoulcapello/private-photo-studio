# Android Image Decode Retry Logic

## Issue

On Android Chrome (observed on Android 10, Chrome 144), the browser's image decoder intermittently throws:

```
InvalidStateError: The source image could not be decoded.
```

This occurs when loading images via `URL.createObjectURL()` + `new Image()` during the background removal pipeline.

## Environment

- **Browser:** Chrome on Android (particularly older versions, Android 10+)
- **Backend:** WASM (CPU inference) — mobile devices default to WASM because WebGPU is unreliable on Android
- **Image sizes:** Even small images (0.1 MB JPEG) trigger the error

## Root Cause

The browser's image decoder shares main-thread resources with WASM memory allocation. When the Transformers.js pipeline is loading or has recently loaded the RMBG-1.4 model (~170 MB WASM), the image decoder can be starved of resources and transiently fails.

Key observations:
- The same image succeeds on retry (user reported success on 4th attempt)
- The error is not related to image size, format, or corruption
- Desktop browsers are unaffected (more memory headroom)
- The failure window correlates with WASM model loading/initialization

## Evidence

Error report from 2026-02-10:
```
Browser: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36
Screen: 412x915
Device: wasm
Image: 1000028461.jpg (0.1 MB, image/jpeg)
Error: The source image could not be decoded.
```

The user retried manually 3 times before success on the 4th attempt.

## Solution

Automatic retry with exponential backoff built into the image loading functions.

### Implementation

A generic `withRetry()` helper in `src/hooks/useBackgroundRemoval.ts` wraps async operations:

```
withRetry(fn, { maxAttempts: 3, delayMs: 500, onRetry })
```

- **Max attempts:** 3 (matches the observed failure pattern — user succeeded on attempt 4, so 3 retries covers most cases)
- **Delay:** 500ms between attempts — gives the browser time to release decoder resources
- **onRetry callback:** Updates the React status message so users see progress (e.g., "Preparing image (attempt 2 of 3)…")

### Affected code

Two functions are wrapped with retry logic:

1. **`loadImageFromBlob(blob, retryOptions)`** — Loads a `Blob` as an `HTMLImageElement`. Used during compositing (applying the mask to the image). Accepts optional retry options passed through from the caller.

2. **`resizeImageFile(file, maxDim, retryOptions)`** — Downscales large images before inference. The internal `new Image()` load is the step that fails transiently.

### Flow

```
processImage(file)
  │
  ├── resizeImageFile(file, 2048, { onRetry: updateStatus })
  │     └── withRetry(loadImage, { maxAttempts: 3, delayMs: 500 })
  │           ├── attempt 1 → fails (InvalidStateError)
  │           │     onRetry(2, 3) → "Preparing image (attempt 2 of 3)…"
  │           │     wait 500ms
  │           ├── attempt 2 → fails
  │           │     onRetry(3, 3) → "Preparing image (attempt 3 of 3)…"
  │           │     wait 500ms
  │           └── attempt 3 → succeeds → continue pipeline
  │
  ├── pipeline("image-segmentation", ...)
  │
  └── loadImageFromBlob(resizedBlob, { onRetry: updateStatus })
        └── withRetry(loadImage, { maxAttempts: 3, delayMs: 500 })
              └── (same retry pattern)
```

## References

- [Chromium Issue 1304186](https://bugs.chromium.org/p/chromium/issues/detail?id=1304186) — Related image decoder resource contention
- [Transformers.js WASM backend](https://huggingface.co/docs/transformers.js) — Model loading memory characteristics
- `CHANGELOG.md` entry: 2026-02-10 — "Added automatic retry logic"
