

# pfppg — Privacy-First Profile Picture Background Remover

## Overview
A single-page web app that removes photo backgrounds entirely in the browser using the RMBG-1.4 model via Transformers.js. No uploads, no accounts, no tracking — just fast, private background removal.

## Design Direction
Minimal, calm, and trustworthy. Clean whites and soft grays with a single accent color. Large typography, generous whitespace, and a linear top-to-bottom flow that guides users step by step.

## Page Flow

### 1. Hero Section
- **Headline:** "Remove backgrounds. Keep photos private."
- **Subtext:** "All processing happens in your browser—nothing is uploaded."
- **CTA button:** "Select a photo" — opens the native file picker
- **Privacy badges** displayed prominently: "No uploads", "No tracking", "Runs locally" — each with a small icon

### 2. Preview & Processing Area
- Appears after a photo is selected
- **Before card** showing the original image
- **After card** showing the result with a transparent checkerboard background
- **Progress indicator** during processing with a friendly status message (e.g., "Loading model…", "Removing background…")
- WebGPU is used when available; falls back to WASM automatically with no user action needed

### 3. Download Section
- Once processing completes, a prominent **"Download PNG"** button appears below the result
- Option to **"Try another photo"** to reset and start over

### 4. Privacy Footer
- Brief explanation of how it works: model runs in-browser, images never leave the device
- No cookies, no analytics, no external requests beyond loading the app itself

## Technical Approach
- **Model:** RMBG-1.4 loaded via `@huggingface/transformers` package for in-browser inference
- **Device selection:** Attempt WebGPU first, fall back to WASM
- **No backend needed** — purely static, client-side app
- Model assets bundled or loaded from same origin
- Result rendered to a canvas and exported as a transparent PNG for download

