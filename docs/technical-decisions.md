# Technical Decisions

## Why WebGPU first, then WASM?

WebGPU provides GPU-accelerated inference, which is significantly faster for image processing. However, it's not supported in all browsers yet. WASM provides a universal fallback that works everywhere, just slower.

## Why canvas compositing?

The RMBG-1.4 model outputs a mask (grayscale image indicating foreground). We composite this mask as the alpha channel of the original image using canvas APIs. This ensures proper transparency in the final PNG.

## Why local blob URLs?

`URL.createObjectURL()` creates ephemeral, in-memory references. They're:
- Fast (no encoding/decoding overhead)
- Private (not accessible outside the browser tab)
- Memory-efficient (automatically garbage collected when revoked)

## Why RMBG-1.4?

It's accurate, lightweight (~170MB), open-source (Apache 2.0), and specifically designed for background removal. The model runs well in browser environments via Transformers.js.
