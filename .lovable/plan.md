

## Enlarge Nav Logo + Add Logo to Hero Section

### Changes

#### 1. `src/components/Header.tsx` -- Make nav logo bigger
Increase the logo image size from `h-7 w-7` to `h-10 w-10` so it fills more of the 56px (h-14) nav bar without changing the header height or font size.

```tsx
<img src="/logo-icon.png" alt="" className="h-10 w-10 object-contain" aria-hidden="true" />
```

#### 2. `src/components/HeroSection.tsx` -- Add logo above/left of the hero title
Add a larger version of the logo (e.g. `h-20 w-20`) positioned just above or inline-left of the H1 headline to reinforce branding on the landing page.

```tsx
<section className="flex flex-col items-center gap-8 px-4 pt-24 pb-16 text-center">
  <img src="/logo-icon.png" alt="Private Photo Studio" className="h-20 w-20 object-contain" />
  <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
    Free AI Profile Picture{" "}
    <span className="text-primary">Background Remover</span>
  </h1>
  ...
```

### Files to modify

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Increase logo from `h-7 w-7` to `h-10 w-10` |
| `src/components/HeroSection.tsx` | Add `h-20 w-20` logo image above the H1 |

