

## Add Tests for Essential Functionality

### Overview
Add tests covering the core UI components, the key user flows, and the specific fixes documented in the changelog. Tests will use the existing Vitest + React Testing Library setup.

### Test Files to Create

#### 1. `src/components/HeroSection.test.tsx` -- Landing Page
- Renders the headline, subtext, and CTA button
- Renders all three privacy badges ("No uploads", "No tracking", "Runs locally")
- File input triggers `onFileSelect` callback when a file is chosen
- Use cases grid renders all three items

#### 2. `src/components/PreviewSection.test.tsx` -- Preview States
- Shows "Original" card with the provided image
- Shows progress bar and status message during `loading-model` state
- Shows progress bar and status message during `processing` state
- Shows result image and "Download PNG" button when `status === "done"`
- Shows error message when `status === "error"`
- Shows error log, "Copy error log" button, and "Report issue" link when error has `errorLog`
- "Report issue" link contains a GitHub Issues URL with encoded error info
- "Try another photo" button calls `onReset`
- "Download PNG" button calls `onDownload`

#### 3. `src/components/PrivacyFooter.test.tsx` -- Privacy Messaging
- Renders the privacy statement text
- Renders BRIA AI attribution link
- Renders support/feedback/source/about links

#### 4. `src/components/Header.test.tsx` -- Navigation
- Renders app name "Private Photo Studio"
- Renders "Editor" and "About" nav links

#### 5. `src/hooks/useBackgroundRemoval.test.ts` -- Hook Logic (unit tests for pure functions)
- Since the internal helpers (`isMobileDevice`, `buildErrorLog`, `resizeImageFile`, `loadImageFromBlob`) are not exported, we'll test them indirectly via the hook's behavior, or extract lightweight assertions where feasible.
- Hook initializes with `status: "idle"` and null result/error
- `reset()` returns state to idle
- `downloadResult()` is a no-op when no result exists

### Technical Details

- All component tests wrap renders in `MemoryRouter` (needed for `NavLink` in Header)
- `PreviewSection` tests cover every `ProcessingStatus` variant to ensure the correct UI is shown for each state
- Error reporting tests verify the GitHub issue URL structure matches the pattern used in the component
- No mocking of `@huggingface/transformers` needed -- we test the UI states, not the inference pipeline
- Tests use `screen.getByText`, `getByRole`, `getByAlt` queries following Testing Library best practices

### Files to create

| File | What it tests |
|------|---------------|
| `src/components/HeroSection.test.tsx` | Landing page content, privacy badges, file selection |
| `src/components/PreviewSection.test.tsx` | All processing states, error reporting UI, actions |
| `src/components/PrivacyFooter.test.tsx` | Privacy copy, attribution, links |
| `src/components/Header.test.tsx` | Navigation structure |
| `src/hooks/useBackgroundRemoval.test.ts` | Hook initial state and reset behavior |

