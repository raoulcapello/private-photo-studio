

## Mobile-Responsive Hero Logo + Hamburger Nav Menu

### Changes

#### 1. `src/components/HeroSection.tsx` -- Stack logo above title on mobile, shrink it

Change the logo+title flex container to stack vertically on mobile (`flex-col`) and go horizontal on `sm:` and up (`sm:flex-row`). Shrink the logo on mobile from `h-44 w-44` to `h-32 w-32` using responsive classes.

```tsx
<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
  <img src="/logo-icon.png" alt="Private Photo Studio"
       className="h-32 w-32 sm:h-44 sm:w-44 object-contain shrink-0" />
  <h1 className="... text-center sm:text-left">...</h1>
</div>
```

The H1 centers on mobile and left-aligns on `sm:`.

#### 2. `src/components/Header.tsx` -- Replace nav links with hamburger menu on mobile

- Add a hamburger icon button (from lucide `Menu` / `X`) visible only on small screens (`sm:hidden`).
- Hide the text nav links on mobile (`hidden sm:flex`).
- When the hamburger is tapped, show a dropdown/sheet with the Editor and About links.
- "Private Photo Studio" text stays visible since the nav links no longer compete for space.
- Use a simple state toggle with a dropdown panel or the existing Sheet component for the mobile menu.

```
Desktop: [Logo] Private Photo Studio          Editor  About
Mobile:  [Logo] Private Photo Studio              [hamburger]
```

### Files to modify

| File | Change |
|------|--------|
| `src/components/HeroSection.tsx` | Responsive flex direction + smaller mobile logo (`h-32 w-32`) |
| `src/components/Header.tsx` | Hide nav links on mobile, add hamburger menu with Sheet/dropdown |

