

## Eraser Brush for Artifact Cleanup

### Overview

Add an eraser brush tool that lets users paint over leftover background artifacts to make them transparent. The brush appears as a toggle next to the existing color picker row, and edits are applied directly to the result image. Undo support is included.

### User Flow

1. After background removal completes, the user sees the result as today.
2. A new "Eraser" toggle button appears in the toolbar row (next to the color swatches).
3. When active, the cursor changes to a circle brush and the user can paint on the Result image to erase artifacts (set pixels to transparent).
4. A brush size slider appears while the eraser is active.
5. An "Undo" button lets the user revert the last stroke.
6. Eraser edits update the underlying result blob, so the color picker previews and download all reflect the cleaned-up image.
7. Clicking "Eraser" again deactivates it.

### Layout (when eraser is active)

```text
[Original]         [Result - interactive canvas]

Eraser: [ON]  Size: [----o----]  [Undo]

Variants: [transparent] [white] [gray] [navy] [+ custom]

[Download PNG]  [Try another photo]
```

### Changes

#### 1. New component: `src/components/EraserCanvas.tsx`

A canvas overlay component that:
- Renders the result image on a `<canvas>` element (replacing the `<img>` when eraser mode is active).
- Shows the selected background color (or checkerboard) behind the image, matching the existing preview behavior.
- Tracks mouse/touch events to paint transparent strokes (`globalCompositeOperation = "destination-out"`).
- Accepts `brushSize` as a prop.
- Shows a circular cursor preview that follows the pointer.
- On each stroke end (mouseup/touchend), calls `onEdit(updatedBlob)` to push the new image state upward.
- Works on both desktop (mouse) and mobile (touch).

#### 2. `src/hooks/useBackgroundRemoval.ts` -- Add `updateResult` method

Add a new `updateResult(blob: Blob)` function that:
- Updates `resultBlobRef.current` with the new blob.
- Revokes the old `resultUrl` and creates a new one.
- Updates state so all downstream consumers (color previews, download) use the edited image.

Also add undo support:
- Maintain a `historyRef` (array of Blobs, capped at ~20 entries).
- `updateResult` pushes the previous blob onto the history stack.
- New `undoEdit()` function pops the last blob and restores it.
- Expose `undoEdit` and `canUndo` (boolean) from the hook.

#### 3. `src/components/PreviewSection.tsx` -- Integrate eraser UI

- Add `eraserActive` boolean state and `brushSize` state (default 20, range 5-80).
- Import `EraserCanvas` component.
- When `eraserActive` is true and `status === "done"`, render `<EraserCanvas>` instead of the static `<img>` in the Result card.
- Add a toolbar row between the Result cards and the color swatches containing:
  - An "Eraser" toggle button (uses `Eraser` icon from lucide-react).
  - A brush size slider (using the existing `Slider` component) -- only visible when eraser is active.
  - An "Undo" button (uses `Undo2` icon) -- only visible when eraser is active and `canUndo` is true.
- Accept `onUpdateResult`, `onUndo`, and `canUndo` as new props.

#### 4. `src/pages/Index.tsx` -- Wire new props

Pass `updateResult`, `undoEdit`, and `canUndo` from the hook to `PreviewSection`.

#### 5. `CHANGELOG.md` -- Add entry

Document the eraser brush feature.

### Technical details

- The eraser canvas uses `globalCompositeOperation = "destination-out"` with a round brush to punch transparent holes in the image. This is a standard Canvas 2D technique -- no extra libraries needed.
- The canvas dimensions match the actual image dimensions. CSS scaling ensures it fits in the preview area (same `max-h-72` constraint as the current `<img>`).
- Touch support uses `touchstart`/`touchmove`/`touchend` with `e.preventDefault()` to avoid scrolling while drawing.
- History is stored as an array of Blobs (not data URLs) to minimize memory. Capped at 20 entries.
- The `resultUrl` object URL is revoked and recreated on each edit to ensure React re-renders the color swatch thumbnails.

### Files to create/modify

| File | Action |
|------|--------|
| `src/components/EraserCanvas.tsx` | Create -- canvas component with eraser painting |
| `src/hooks/useBackgroundRemoval.ts` | Modify -- add `updateResult`, undo history, `undoEdit`, `canUndo` |
| `src/components/PreviewSection.tsx` | Modify -- add eraser toggle, brush slider, undo button, swap img/canvas |
| `src/pages/Index.tsx` | Modify -- pass new props |
| `CHANGELOG.md` | Modify -- add entry |
