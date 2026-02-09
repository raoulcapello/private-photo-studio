

## Enlarge Logos Further

### Changes

#### 1. `src/components/Header.tsx` -- Nav logo from `h-10 w-10` to `h-16 w-16`
This roughly 1.6x the current size. The nav bar stays at `h-14` -- the logo will slightly overflow vertically but `object-contain` keeps it visually clean.

#### 2. `src/components/HeroSection.tsx` -- Hero logo from `h-20 w-20` to `h-60 w-60`
3x the current size for a bold, prominent brand mark above the headline.

### Files to modify

| File | Change |
|------|--------|
| `src/components/Header.tsx` | `h-10 w-10` → `h-16 w-16` |
| `src/components/HeroSection.tsx` | `h-20 w-20` → `h-60 w-60` |

