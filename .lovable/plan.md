
# Developer Documentation Plan for pfppg

## File to Create
Create a new file: `DEVELOPER.md` in the project root

## Content Structure

### 1. **Verifying Browser-Only Processing**
This section will help developers confirm that images never leave the browser:

- **Network Inspection Method**
  - Open DevTools → Network tab
  - Load an image and process it
  - Show that the ONLY external requests are:
    - Model config files from `huggingface.co` (not image data)
    - WASM runtime files from `cdn.jsdelivr.net` (for fallback)
    - NO image data is ever sent to any server
  - Explain what requests ARE expected (model artifacts) vs. what should NEVER happen (image uploads)

- **Code Review Approach**
  - Point to `src/hooks/useBackgroundRemoval.ts` lines 46-48 where the image is converted to a local blob URL
  - Highlight lines 58-80 where processing happens entirely on canvas (browser's `CanvasRenderingContext2D`)
  - Note line 83-85 where result is exported as a local blob, never sent anywhere
  - Explain that `createImageBitmap` and canvas operations are all browser APIs

- **Browser API Evidence**
  - Show that `URL.createObjectURL()` creates local, in-memory references
  - Explain `canvas.toBlob()` generates data entirely in the browser
  - Mention that the model (`@huggingface/transformers`) runs via WebGPU or WASM (both client-side runtimes)

### 2. **Running Locally**
Step-by-step guide for developers:

- **Prerequisites**
  - Node.js 16+ (recommend checking with `node --version`)
  - npm or bun (project uses bun.lockb)

- **Installation Steps**
  - Clone the repository
  - Navigate to project directory
  - `npm install` or `bun install`
  - Explains what gets installed (React, Vite, @huggingface/transformers, Tailwind, shadcn-ui)

- **Running Dev Server**
  - `npm run dev` or `bun run dev`
  - Server starts on `http://localhost:8080`
  - Hot module replacement enabled (changes reflect instantly)
  - Explains the HMR overlay is disabled in config for better UX

- **Building for Production**
  - `npm run build` or `bun run build`
  - Output in `dist/` directory
  - Explains that vite optimizes the build (code splitting, minification)
  - Can be served as static files anywhere

- **Testing**
  - `npm run test` or `bun run test`
  - `npm run test:watch` for watch mode
  - Uses Vitest

### 3. **Key Files to Understand**
Brief guide to architecture:

- `src/hooks/useBackgroundRemoval.ts` - Core business logic
- `src/pages/Index.tsx` - Main orchestration
- `src/components/` - UI components (Hero, Preview, Footer)
- `vite.config.ts` - Build and dev server configuration

### 4. **Technical Decisions Explained**
Address common "why" questions:

- Why WebGPU first, then WASM fallback? (Performance + compatibility)
- Why canvas compositing? (Proper alpha channel handling for transparent PNG)
- Why local blob URLs? (Memory efficient, no server round-trip)
- Why RMBG-1.4? (Accurate, lightweight, open-source)

## Tone & Approach
- Written for developers (not beginners, but not assuming expert knowledge of these specific tools)
- Use practical verification steps (network tab inspection)
- Provide code line references
- Explain "why" behind technical choices
- Include troubleshooting tips (e.g., if WebGPU not available, WASM fallback handles it)

