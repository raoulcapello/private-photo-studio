# Troubleshooting

## "Loading model" takes a long time on first run

The model weights (~170MB) are downloaded on first use and cached by your browser. Subsequent runs are much faster.

## Processing is slow

If WebGPU isn't available, the app falls back to WASM (CPU-based), which is slower. Check the status message — it shows which runtime is being used.

## Browser not supported

The app requires a modern browser with:
- ES2020+ support
- WebAssembly support (for WASM fallback)
- Optionally: WebGPU for faster processing (Chrome 113+, Edge 113+)

## Image fails to load on Android

On Android Chrome, the browser's image decoder can intermittently fail under memory pressure during WASM model loading. The app automatically retries up to 3 times with a 500ms delay. See [Android Image Decode Retry](android-image-decode-retry.md) for full details.
