

## Background Color Picker + Preset Color Results

### Overview

When the result is ready, show the transparent-background result plus 3 preset color variants. Add a color picker so the user can choose a custom background color. If a custom color is selected, that result appears first; otherwise transparent comes first. The download button downloads whichever variant the user has selected.

All compositing happens client-side on a canvas. The hook already stores the transparent PNG blob. We reuse that transparent image to composite colored backgrounds on-the-fly in the UI -- no re-processing needed.

### Changes

#### 1. `src/hooks/useBackgroundRemoval.ts` -- Add `downloadWithBackground` method

Add a new function `downloadWithBackground(color: string | null)` that:
- If `color` is null, downloads the existing transparent PNG (current behavior).
- If `color` is a hex string, draws the color on a canvas, composites the transparent result on top, and downloads that.

#### 2. `src/components/PreviewSection.tsx` -- Add color picker + preset thumbnails

After the current "Result" card (when `status === "done"`), add a new section:

- **Selected result card**: Shows the currently selected variant (transparent or colored) as the main large preview.
- **Thumbnail row**: 4 small clickable thumbnails below the main result:
  1. Transparent (checkerboard background)
  2. White (`#FFFFFF`)
  3. Light gray (`#E5E7EB`)
  4. Navy blue (`#1E3A5F`)
- **Color picker**: A small "Custom color" button with an HTML `<input type="color">` for picking any color.
- Clicking a thumbnail selects it as the active preview and download target.

**Layout (when done)**:
```text
  [Original]         [Result - selected variant]

  Variants: [transparent] [white] [gray] [navy] [+ custom color picker]

  [Download PNG]  [Try another photo]
```

#### 3. `src/components/PreviewSection.tsx` -- Update props

- Accept `downloadWithBackground: (color: string | null) => void` as a new prop.
- Manage `selectedColor: string | null` state internally (null = transparent).

#### 4. `src/pages/Index.tsx` -- Pass new prop

Pass `downloadWithBackground` from the hook to `PreviewSection`.

#### 5. `CHANGELOG.md` -- Add entry for this feature

Add a new dated section documenting the background color picker feature:
- Color picker and 3 preset background color options added to the result view.
- Custom color support via native color input.
- Download composites the selected background color client-side.

### Preset colors

| Swatch | Hex | Label |
|--------|-----|-------|
| Checkerboard | null | Transparent |
| White | #FFFFFF | White |
| Light gray | #E5E7EB | Gray |
| Navy | #1E3A5F | Navy |

### Technical details

- Thumbnails show the transparent PNG `<img>` over a CSS `backgroundColor` -- no extra canvas needed for preview. Canvas compositing only happens at download time.
- The color picker uses a native `<input type="color">` styled as a small swatch button.

### Files to modify

| File | Change |
|------|--------|
| `src/hooks/useBackgroundRemoval.ts` | Add `downloadWithBackground(color)` method |
| `src/components/PreviewSection.tsx` | Add color state, thumbnail row, color picker, update main preview |
| `src/pages/Index.tsx` | Pass `downloadWithBackground` prop |
| `CHANGELOG.md` | Add entry for background color picker feature |

