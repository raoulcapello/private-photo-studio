

## Hide Eraser on Mobile + Add Desktop Hint + Update About Page

### Overview

Hide the eraser tool on mobile devices and replace it with a short informational message. Update the About page with a more detailed explanation of platform-specific capabilities and limitations.

### Changes

#### 1. `src/components/PreviewSection.tsx` -- Conditionally hide eraser on mobile

- Import `useIsMobile` from `@/hooks/use-mobile`.
- Wrap the eraser toolbar block (lines 165-195) in a `!isMobile` check so the Eraser button, brush size slider, and Undo button are not rendered on mobile.
- When `isMobile` is true and `status === "done"`, show a small muted text instead:
  *"For advanced editing tools like the eraser brush, try using a desktop browser."*

#### 2. `src/pages/About.tsx` -- Add "Platform Differences" section

Add a new section between "Model Accuracy & Limitations" and "Free & Open Source" with a heading like **"Desktop vs. Mobile"** that explains:

- Background removal works on all devices.
- The eraser brush tool for manual cleanup is available on desktop browsers only.
- The custom color picker (eyedropper) depends on browser support and works best on desktop.
- For the best editing experience, a desktop browser is recommended.

#### 3. `CHANGELOG.md` -- Add entry

Document the mobile UX improvement and About page update.

### Files to modify

| File | Change |
|------|--------|
| `src/components/PreviewSection.tsx` | Import `useIsMobile`, hide eraser on mobile, show hint text |
| `src/pages/About.tsx` | Add "Desktop vs. Mobile" section |
| `CHANGELOG.md` | Add entry |
