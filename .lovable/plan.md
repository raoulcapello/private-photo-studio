
## On Mobile, Default to WASM and Add Error Reporting

### Overview
On mobile, Switch the inference backend from WebGPU-first to WASM-only (fixing Chrome Android failures), and replace the plain error message with a copyable error log and a link to file a GitHub issue.

### Changes

#### 1. `src/hooks/useBackgroundRemoval.ts` -- Default to WASM on mobile devices

- Add logic that tries to detect if it's run on a mobile device - if not mobile, use WebGPU, if mobile, or unclear, fallback to WASM
- The status message should say what it's using and why
- Simplify inference to a single `result = await segmenter(imageUrl)` call (no retry logic needed)
- Collect diagnostic info on error (see below)

#### 2. `src/hooks/useBackgroundRemoval.ts` -- Generate error log on failure

In the `catch` block, build a structured error report string containing:
- Browser user agent
- Screen dimensions
- Image file name, size, and type
- Error message and stack trace
- Timestamp

Store this error log string in state (add an `errorLog` field to `BackgroundRemovalState`).

Updated state interface:
```
interface BackgroundRemovalState {
  status: ProcessingStatus;
  statusMessage: string;
  resultUrl: string | null;
  error: string | null;
  errorLog: string | null;  // NEW
}
```

Return `errorLog` from the hook alongside the other fields.

#### 3. `src/components/PreviewSection.tsx` -- Show error log with copy + report buttons

- Add `errorLog: string | null` to `PreviewSectionProps`
- In the error state UI (lines 70-74), replace the plain text with:
  - The error message (as before)
  - A `<pre>` block with the error log, styled with a small monospace font and a subtle background
  - A "Copy error log" button that copies `errorLog` to the clipboard using `navigator.clipboard.writeText()`
  - A "Report issue" link/button that opens a pre-filled GitHub issue URL: `https://github.com/raoulcapello/private-photo-studio/issues/new?title=Processing+error&body={encodedErrorLog}`

#### 4. `src/pages/Index.tsx` -- Pass `errorLog` through

- Destructure `errorLog` from `useBackgroundRemoval()` and pass it to `PreviewSection`

#### 5. `CHANGELOG.md` -- Document the changes

- Add entry for switching to WASM by default and adding error reporting

### Technical Details

**Error log format example:**
```
--- Private Photo Studio Error Report ---
Time: 2026-02-09T12:34:56.789Z
Browser: Mozilla/5.0 (Linux; Android 14; ...)
Screen: 412x915
Device: wasm
Image: photo.jpg (3.2 MB, image/jpeg)
Error: The source image could not be decoded
Stack: Error: The source image could not be decoded
    at ...
```

**GitHub issue URL construction:**
```
const issueUrl = `https://github.com/raoulcapello/private-photo-studio/issues/new?title=${encodeURIComponent("Processing error: " + errorMessage)}&body=${encodeURIComponent(errorLog)}`;
```

### Files to modify

| File | Change |
|------|--------|
| `src/hooks/useBackgroundRemoval.ts` | Remove WebGPU logic, default to WASM, add `errorLog` generation |
| `src/components/PreviewSection.tsx` | Show error log with copy and report buttons |
| `src/pages/Index.tsx` | Pass `errorLog` prop through |
| `CHANGELOG.md` | Document changes |
