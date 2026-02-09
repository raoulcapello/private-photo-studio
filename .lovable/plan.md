

## Fix Intermittent "Source image could not be decoded" on Android Chrome

### Root Cause

Line 152 in `useBackgroundRemoval.ts` uses `createImageBitmap(resizedBlob)` to draw the image onto the compositing canvas. On Android Chrome, `createImageBitmap` is known to intermittently fail -- the same reason the `resizeImageFile` helper already uses an `<img>` element instead.

### Fix

Replace the `createImageBitmap` call with an `<img>` element approach (consistent with how `resizeImageFile` already works):

```ts
// Before (flaky on Android Chrome):
const imgBitmap = await createImageBitmap(resizedBlob);
ctx.drawImage(imgBitmap, 0, 0);

// After (reliable):
const imgEl = await loadImageFromBlob(resizedBlob);
ctx.drawImage(imgEl, 0, 0);
```

### Changes

#### `src/hooks/useBackgroundRemoval.ts`

1. Add a small helper `loadImageFromBlob(blob: Blob): Promise<HTMLImageElement>` that creates an `<img>`, sets its `src` to a blob URL, waits for `onload`, and revokes the URL.
2. Replace line 152 (`createImageBitmap`) with a call to this helper.
3. Update CHANGELOG entry.

### Technical Details

**New helper:**
```ts
function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}
```

This is the exact same pattern already used in `resizeImageFile` (lines 24-44), so it's consistent with the existing codebase.

### Files to modify

| File | Change |
|------|--------|
| `src/hooks/useBackgroundRemoval.ts` | Add `loadImageFromBlob` helper, replace `createImageBitmap` call |
| `CHANGELOG.md` | Document the fix |

