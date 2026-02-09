

## Fix Favicon: Remove Duplicate and Improve Contrast

### What Went Wrong
There are two competing `<link rel="icon">` tags in `index.html` (line 6: inline SVG, line 7: PNG file). Browsers show the inline SVG, which uses teal (`#2a9d8f`) -- this blends into dark tab bars and the icon itself.

### Fix

#### `index.html`
1. Remove the PNG favicon link (line 7) to eliminate the duplicate
2. Update the inline SVG favicon to use **white (`#ffffff`)** stroke instead of teal, keeping the transparent background -- this gives strong contrast on both light and dark browser chrome
3. The camera icon shape stays the same

The single changed line will look like:
```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'/%3E%3Ccircle cx='12' cy='13' r='3'/%3E%3C/svg%3E" />
```

Note: White works well on dark tabs but may be invisible on light tabs. If you'd prefer a color that works on both (e.g., dark gray `#333` or keeping teal but bolder), let me know and I'll adjust.

### Files to modify

| File | Change |
|------|--------|
| `index.html` | Remove duplicate PNG favicon link, change SVG stroke from `#2a9d8f` to `#ffffff` |

