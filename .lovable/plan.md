
## Hero Logo Repositioning + Nav Logo Background Fix

### Changes

#### 1. `src/components/HeroSection.tsx` -- Move logo left of title, shrink to ~h-44

Wrap the logo and H1 in a horizontal flex row. Shrink logo from `h-60 w-60` to `h-44 w-44`. Set H1 to `text-left`.

```tsx
<div className="flex items-center gap-6">
  <img src="/logo-icon.png" alt="Private Photo Studio" className="h-44 w-44 object-contain shrink-0" />
  <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground text-left">
    Free AI Profile Picture{" "}
    <span className="text-primary">Background Remover</span>
  </h1>
</div>
```

#### 2. `src/components/Header.tsx` -- Clip logo to prevent white background overflow

The `h-16 w-16` logo image has a white/opaque background that bleeds past the nav bar's bottom border. Fix by adding `overflow-hidden` to the nav container and making the logo background transparent via CSS. Since the PNG itself has a white background baked in, the simplest fix is to clip the nav element with `overflow-hidden` so nothing visually extends below the border line.

```tsx
<nav className="container mx-auto flex items-center justify-between h-14 px-4 overflow-hidden">
```

This keeps the icon at `h-16 w-16` (so it appears large) but clips any overflow so the white background doesn't cross the bottom border.

### Files to modify

| File | Change |
|------|--------|
| `src/components/HeroSection.tsx` | Wrap logo + H1 in horizontal flex, shrink logo to `h-44 w-44` |
| `src/components/Header.tsx` | Add `overflow-hidden` to `<nav>` to clip logo overflow |
