

## Extract Icon from OG Image for Logo and Favicon

The OG image (`public/og-image.png`) contains a stylized camera icon. We'll use AI image generation to extract/recreate just the icon portion as a square image, then use it as both the nav bar logo and favicon.

### Steps

#### 1. Generate a square icon from the OG image
Use the image editing tool to create a square (512x512) version of just the camera icon from the OG image, with a transparent or matching light background. This will be saved as `public/logo-icon.png`.

#### 2. Generate a 32x32 favicon version
Create a small favicon-sized version of the same icon, saved as `public/favicon.png` (replacing the existing one).

#### 3. `src/components/Header.tsx` -- Replace inline SVG with image logo
Replace the inline SVG camera icon with an `<img>` tag pointing to `/logo-icon.png`, sized to fit the nav bar.

```tsx
<NavLink to="/" className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors">
  <img src="/logo-icon.png" alt="" className="h-7 w-7 object-contain" aria-hidden="true" />
  Private Photo Studio
</NavLink>
```

#### 4. `index.html` -- Update favicon to use new icon
Replace the inline SVG favicon with the new PNG favicon:

```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

Remove the inline SVG `<link>` since the PNG now matches the brand.

#### 5. `src/components/Header.test.tsx` -- Update test
Change the logo assertion from checking for an SVG to checking for an `<img>` element.

### Files to create/modify

| File | Change |
|------|--------|
| `public/logo-icon.png` | New -- square icon extracted from OG image |
| `public/favicon.png` | Replace -- favicon version of the icon |
| `src/components/Header.tsx` | Replace inline SVG with `<img>` tag |
| `index.html` | Simplify to single PNG favicon link |
| `src/components/Header.test.tsx` | Update logo assertion for `<img>` |

### Notes
- The OG image (`public/og-image.png`) stays untouched for social sharing
- The icon will be consistent across favicon, nav logo, and OG image
