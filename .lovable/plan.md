

## Add FAQ Page + Navigation

### Overview

Create a dedicated FAQ page using Radix accordion components for a clean expand/collapse UI. Add it to the main navigation. Move the "Model Accuracy & Limitations" and "Desktop vs. Mobile" sections from the About page into the FAQ (they fit better as Q&A), and keep the About page focused on what the tool is, who it's for, and the open-source story.

### FAQ Questions & Answers

1. **Why is this app free?**
   We use BRIA AI's RMBG-1.4 model (link to https://huggingface.co/briaai/RMBG-1.4), which is free for non-commercial use. The app is still in development -- I'm gathering feedback to make it better. It works well in many cases, but I don't feel it's ready to charge for. It's also a tool I wanted for myself, so I built it and decided to share it as a showcase of my work as a software architect and developer.

2. **Is my photo uploaded anywhere?**
   No. All processing happens in your browser using a local AI model. Your images never leave your device -- no uploads, no cookies, no tracking.

3. **Why didn't the background removal work perfectly on my photo?**
   The AI model doesn't handle all images equally well. Results depend on lighting, contrast between subject and background, and image clarity. Photos with clear edges and good lighting produce the best results. You can use the eraser brush (desktop) to manually clean up remaining artifacts.

4. **Does it work on my phone?**
   Yes, background removal works on all devices. However, some editing features like the eraser brush and the custom color eyedropper are only available on desktop browsers. On mobile, the app uses a slower but more compatible processing mode (WASM instead of WebGPU).

5. **Why is processing slow on my device?**
   The AI model runs entirely in your browser, so speed depends on your device's hardware. Desktop computers with modern GPUs process images fastest via WebGPU. Mobile devices and older computers fall back to CPU-based processing (WASM), which is slower but works reliably. The model also needs to be downloaded once on first use.

6. **What image formats are supported?**
   You can select any common image format (JPEG, PNG, WebP, etc.). The result is always downloaded as a transparent PNG.

7. **Can I use this for commercial purposes?**
   The app code is MIT-licensed, but the underlying AI model (RMBG-1.4 by BRIA AI) has its own license terms. Check the model's license for commercial use. The app itself is free for personal and non-commercial use.

### Content Migration from About Page

Move these sections **out of** About and **into** the FAQ:

- **"Model Accuracy & Limitations"** -- becomes FAQ item #3 above.
- **"Desktop vs. Mobile"** -- becomes FAQ item #4 above.

The About page keeps: What Is This Tool, Perfect For, How It Works, Why Privacy Matters, Free & Open Source.

### Changes

#### 1. `src/pages/FAQ.tsx` -- New page

- Use the same layout pattern as About (Header, main content, PrivacyFooter).
- Use the Radix `Accordion` component (already installed) for the Q&A items.
- H1: "Frequently Asked Questions"
- Subtitle with brief intro text.
- Each FAQ item is an AccordionItem with the question as trigger and the answer as content.

#### 2. `src/components/Header.tsx` -- Add FAQ link

- Add "FAQ" nav link to both desktop and mobile navigation, between "Editor" and "About".

#### 3. `src/App.tsx` -- Add route

- Import FAQ page and add `/faq` route.

#### 4. `src/pages/About.tsx` -- Remove migrated sections

- Remove the "Model Accuracy & Limitations" section (lines 135-153).
- Remove the "Desktop vs. Mobile" section (lines 155-177).
- This keeps About focused on: intro, use cases, how it works, privacy, and open source.

#### 5. `CHANGELOG.md` -- Add entry

Document the new FAQ page and content reorganization.

### Files to create/modify

| File | Action |
|------|--------|
| `src/pages/FAQ.tsx` | Create -- FAQ page with accordion |
| `src/components/Header.tsx` | Modify -- add FAQ nav link |
| `src/App.tsx` | Modify -- add /faq route |
| `src/pages/About.tsx` | Modify -- remove migrated sections |
| `CHANGELOG.md` | Modify -- add entry |

