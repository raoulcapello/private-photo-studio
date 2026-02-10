

## Restructure README into Shorter Docs

### Overview

Break the current README.md into focused pages in `docs/`, keep the README short and high-level with links, and add the three uploaded screenshots as example images with photo credits.

### New File Structure

```text
README.md                              (rewritten -- short overview + links)
docs/
  android-image-decode-retry.md        (already exists, unchanged)
  verifying-privacy.md                 (new -- "Verifying Browser-Only Processing")
  running-locally.md                   (new -- prerequisites, install, dev, build, tests)
  technical-decisions.md               (new -- WebGPU, canvas, blob URLs, RMBG-1.4)
  troubleshooting.md                   (new -- slow model, WASM fallback, browser support)
public/
  screenshots/
    example-1.png                      (copy from user-uploads, green background removal)
    example-2.png                      (copy from user-uploads, custom yellow-green bg)
    example-3.png                      (copy from user-uploads, navy bg + eraser)
```

### File Details

#### `README.md` (rewritten)

Short, scannable README containing:
- Project name and one-line description
- 3 screenshot examples in a row with photo credits beneath
- "Key Files" table (kept from original)
- "Links & Support" section (kept from original)
- Links to each doc page:
  - [Verifying Privacy](docs/verifying-privacy.md)
  - [Running Locally](docs/running-locally.md)
  - [Technical Decisions](docs/technical-decisions.md)
  - [Troubleshooting](docs/troubleshooting.md)
  - [Android Image Decode Retry](docs/android-image-decode-retry.md)

Photo credits block at the bottom of the examples section using the exact HTML provided by the user.

#### `docs/verifying-privacy.md` (new)

Content extracted from README "Verifying Browser-Only Processing" section:
- Method 1: Network Inspection
- Method 2: Code Review
- Method 3: Understanding the Runtime

#### `docs/running-locally.md` (new)

Content extracted from README "Running Locally" section:
- Prerequisites
- Installation
- Development Server
- Production Build
- Running Tests

#### `docs/technical-decisions.md` (new)

Content extracted from README "Technical Decisions" section:
- Why WebGPU first, then WASM?
- Why canvas compositing?
- Why local blob URLs?
- Why RMBG-1.4?

#### `docs/troubleshooting.md` (new)

Content extracted from README "Troubleshooting" section:
- Slow model loading
- Slow processing
- Browser not supported
- Link to `android-image-decode-retry.md` for the specific Android decode issue

### Screenshots

The three uploaded images will be copied to `public/screenshots/` and referenced in README.md using relative paths (`public/screenshots/example-1.png` etc.) so they render on GitHub.

### Files to create/modify

| File | Action |
|------|--------|
| `public/screenshots/example-1.png` | Copy from user-uploads (green bg removal) |
| `public/screenshots/example-2.png` | Copy from user-uploads (yellow-green bg) |
| `public/screenshots/example-3.png` | Copy from user-uploads (navy bg + eraser) |
| `README.md` | Rewrite -- short overview, screenshots, links to docs |
| `docs/verifying-privacy.md` | Create -- extracted from README |
| `docs/running-locally.md` | Create -- extracted from README |
| `docs/technical-decisions.md` | Create -- extracted from README |
| `docs/troubleshooting.md` | Create -- extracted from README |

