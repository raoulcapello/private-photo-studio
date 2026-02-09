
## Replace Favicon with a Lucide-Style SVG Icon

### What's Changing

Replace the current teal-filled camera favicon with a clean, transparent-background SVG favicon using a lucide-style icon. The `Image` icon (a landscape/photo icon) is a good fit for a photo tool, or alternatively `Camera` or `Scissors` (representing "cutting" backgrounds).

### Approach

Create an inline SVG favicon directly in `index.html` using a data URI. This avoids needing an external file and gives us full control over colors and transparency.

### Icon Choice

Use the **`Camera`** icon silhouette (representing background removal/cutting) in the primary teal color (`#2a9d8f`, matching the project's primary hue) on a **transparent background**.

Alternative: `Image` icon if you prefer a photo-themed look.

### File to Modify

| File | Change |
|------|--------|
| `index.html` | Replace the `<link rel="icon">` tag with an inline SVG data URI favicon |

### Technical Details

- Replace the current `<link rel="icon" type="image/png" href="/favicon.png" />` with a `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">` containing the icon SVG
- The SVG will use `stroke="#2a9d8f"` (teal) on a transparent background
- SVG favicons are supported in all modern browsers
- Keep `favicon.png` as fallback for older browsers
