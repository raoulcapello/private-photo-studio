

## Add Camera Logo to Header + Fix Favicon PNG Fallback

### Changes

#### 1. `src/components/Header.tsx` -- Add inline SVG camera icon as logo
Add the same camera SVG icon (used in the favicon) next to the "Private Photo Studio" text in the nav header, using `currentColor` for the stroke so it inherits the text color and works with theming.

#### 2. `index.html` -- Re-add PNG favicon as fallback
Add back the PNG fallback link that was removed in the last edit:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

#### 3. `public/favicon.png` -- Update background to transparent
Since the current `favicon.png` likely has a teal background, we'll generate a new one with a transparent background and white camera icon (matching the SVG favicon). This will be a simple 32x32 PNG.

**Note:** Since we can't inspect the binary PNG, we'll replace it with an SVG-based approach: add a second `<link>` for the SVG as the primary icon and keep the PNG as a legacy fallback. If you want the PNG itself updated, you'd need to provide a new image file or I can create one programmatically using a canvas-based approach in a small build script -- but the simplest fix is to just rely on the SVG (which all modern browsers support) and accept the PNG as-is for older browsers.

#### 4. `src/components/Header.test.tsx` -- Update test
Add assertion for the logo SVG element in the header.

### Technical Details

**Header logo markup:**
```tsx
<NavLink to="/" className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
  Private Photo Studio
</NavLink>
```

### Files to modify

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Add inline camera SVG next to app name |
| `src/components/Header.test.tsx` | Update test for new logo markup |
| `index.html` | Re-add PNG favicon fallback link |

