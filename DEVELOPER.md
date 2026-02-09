# Developer Guide

This guide explains how to verify that pfppg processes images entirely in your browser, and how to run the app locally.

---

## Verifying Browser-Only Processing

The core promise of this app is that your photos never leave your device. Here's how to confirm that.

### Method 1: Network Inspection

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

### Method 2: Code Review

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

### Method 3: Understanding the Runtime

The `@huggingface/transformers` library runs AI models directly in the browser using:

- **WebGPU** (preferred): Hardware-accelerated inference on your GPU
- **WASM** (fallback): CPU-based inference via WebAssembly

Both are client-side runtimes. The model weights are downloaded once and cached, but all inference (the actual image processing) happens locally.

---

## Running Locally

### Prerequisites

- **Node.js 16+** — Check with `node --version`
- **npm** or **bun** — The project includes both lockfiles

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pfppg

# Install dependencies
npm install
# or
bun install
```

This installs React, Vite, Tailwind CSS, shadcn-ui components, and `@huggingface/transformers` for local AI inference.

### Development Server

```bash
npm run dev
# or
bun run dev
```

The server starts at `http://localhost:8080`. Hot module replacement is enabled — your changes appear instantly without a full reload.

> **Note:** The HMR error overlay is disabled in `vite.config.ts` for a cleaner development experience.

### Production Build

```bash
npm run build
# or
bun run build
```

Output goes to the `dist/` directory. The build is fully static — you can deploy it to any static hosting service (Netlify, Vercel, GitHub Pages, S3, etc.) with no server required.

### Running Tests

```bash
# Run tests once
npm run test

# Watch mode (re-runs on file changes)
npm run test:watch
```

Tests use Vitest with jsdom for DOM simulation.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useBackgroundRemoval.ts` | Core logic: model loading, inference, canvas compositing |
| `src/pages/Index.tsx` | Main page orchestration and state management |
| `src/components/HeroSection.tsx` | Landing UI with privacy messaging and file picker |
| `src/components/PreviewSection.tsx` | Before/after preview cards and download button |
| `src/components/PrivacyFooter.tsx` | Privacy reassurance footer |
| `vite.config.ts` | Dev server and build configuration |

---

## Technical Decisions

### Why WebGPU first, then WASM?

WebGPU provides GPU-accelerated inference, which is significantly faster for image processing. However, it's not supported in all browsers yet. WASM provides a universal fallback that works everywhere, just slower.

### Why canvas compositing?

The RMBG-1.4 model outputs a mask (grayscale image indicating foreground). We composite this mask as the alpha channel of the original image using canvas APIs. This ensures proper transparency in the final PNG.

### Why local blob URLs?

`URL.createObjectURL()` creates ephemeral, in-memory references. They're:
- Fast (no encoding/decoding overhead)
- Private (not accessible outside the browser tab)
- Memory-efficient (automatically garbage collected when revoked)

### Why RMBG-1.4?

It's accurate, lightweight (~170MB), open-source (Apache 2.0), and specifically designed for background removal. The model runs well in browser environments via Transformers.js.

---

## Troubleshooting

**"Loading model" takes a long time on first run**

The model weights (~170MB) are downloaded on first use and cached by your browser. Subsequent runs are much faster.

**Processing is slow**

If WebGPU isn't available, the app falls back to WASM (CPU-based), which is slower. Check the status message — it shows which runtime is being used.

**Browser not supported**

The app requires a modern browser with:
- ES2020+ support
- WebAssembly support (for WASM fallback)
- Optionally: WebGPU for faster processing (Chrome 113+, Edge 113+)
