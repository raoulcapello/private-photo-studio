

## Add Automatic Retry Logic for Transient Image Decoding Failures

### Problem

On Android Chrome (observed on Android 10, Chrome 144), the browser's image decoder intermittently throws `InvalidStateError: The source image could not be decoded` when loading images via `URL.createObjectURL()` + `new Image()`. This is a transient failure caused by resource pressure during WASM model loading. Retrying the same image succeeds after a few attempts.

### Changes

#### 1. `src/hooks/useBackgroundRemoval.ts` -- Add retry wrappers

Create a generic `withRetry()` helper at the top of the file that:
- Accepts an async function, a max attempt count (default 3), and a delay (default 500ms).
- On failure, waits the delay then retries.
- Logs each retry attempt to the console for diagnostics.

Wrap two call sites with retry logic:
- **`resizeImageFile()`** -- the initial image load for resizing (line 37-64). Wrap the internal `new Image()` load in the retry helper.
- **`loadImageFromBlob()`** -- used for compositing (line 25-33). Wrap similarly.

Update the `processImage` function to show retry status in `statusMessage`:
- On the resize step: `"Preparing image (attempt 2 of 3)…"`
- This way the user sees something is happening rather than a silent wait.

Add clear comments on every retry-related line explaining:
- **What**: retrying image decode on transient failure.
- **Why**: Android Chrome intermittently fails to decode images under resource pressure during WASM model loading.
- **How**: ties into the status message shown in `PreviewSection` via `statusMessage` state.

#### 2. `docs/android-image-decode-retry.md` -- New documentation

Create a detailed document covering:
- **Issue**: Description of the `InvalidStateError: The source image could not be decoded` error.
- **Environment**: Android Chrome, particularly older versions (Android 10+), WASM backend.
- **Root cause**: Browser image decoder contention with WASM memory allocation. The decoder shares resources with the main thread; under pressure from model loading, it intermittently fails.
- **Evidence**: Error report from 2026-02-10, 0.1 MB JPEG, succeeded on 4th attempt.
- **Solution**: Automatic retry with 500ms delay, up to 3 attempts, with user-visible status messages.
- **Affected code**: `loadImageFromBlob()` and `resizeImageFile()` in `useBackgroundRemoval.ts`.
- **References**: Link to related Chromium bug patterns if known.

#### 3. `CHANGELOG.md` -- Add entry

Add bullet: "Added automatic retry logic (up to 3 attempts) for transient image decoding failures on Android, with user-visible status messages."

### Implementation Detail

```text
withRetry(fn, { maxAttempts: 3, delayMs: 500, onRetry })
  |
  +-- attempt 1 --> fails (InvalidStateError)
  |     onRetry(1, 3) --> setState("Preparing image (attempt 2 of 3)...")
  |     wait 500ms
  +-- attempt 2 --> fails
  |     onRetry(2, 3) --> setState("Preparing image (attempt 3 of 3)...")
  |     wait 500ms
  +-- attempt 3 --> succeeds --> continue pipeline
```

The `onRetry` callback is passed from `processImage` so it can update the status message without the retry helper needing to know about React state.

### Files to create/modify

| File | Action |
|------|--------|
| `src/hooks/useBackgroundRemoval.ts` | Modify -- add `withRetry()` helper, wrap `resizeImageFile` and `loadImageFromBlob`, update status messages |
| `docs/android-image-decode-retry.md` | Create -- detailed documentation of the issue, cause, and solution |
| `CHANGELOG.md` | Modify -- add entry |

