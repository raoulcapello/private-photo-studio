

## Add Temporary "Test Error Report" Button

### What's Changing

Add a temporary button that appears after successful image processing (status === "done") to simulate an error and test the error log generation + GitHub issue reporting UI. This button will be removed in a future update.

### Changes

#### `src/components/PreviewSection.tsx`

- Add a "Test Error Report" button (styled as a small outline/ghost button) next to the existing action buttons when `status === "done"`
- Clicking it will trigger a callback that simulates an error state

#### `src/hooks/useBackgroundRemoval.ts`

- Export a new `simulateError` function from the hook that:
  - Calls `buildErrorLog` with device `"wasm"`, a fake file, and a synthetic error
  - Sets state to `status: "error"` with a test error message and the generated `errorLog`
  - This lets us test the full error UI (pre block, copy button, report issue link) without actually causing a failure

#### `src/pages/Index.tsx`

- Destructure `simulateError` from `useBackgroundRemoval()` and pass it to `PreviewSection` as `onSimulateError`

### Technical Details

**Simulated error in the hook:**
```text
simulateError = useCallback(() => {
  const fakeFile = new File([""], "test-image.jpg", { type: "image/jpeg" });
  Object.defineProperty(fakeFile, "size", { value: 3_200_000 });
  const fakeError = new Error("Simulated error for testing error report UI");
  const log = buildErrorLog("wasm", fakeFile, fakeError);
  setState({
    status: "error",
    statusMessage: "",
    resultUrl: null,
    error: fakeError.message,
    errorLog: log,
  });
}, []);
```

**Button in PreviewSection (temporary, next to "Try another photo"):**
- Label: "Test error report"
- Variant: `ghost`, size: `sm`
- Only visible when `status === "done"`

### Files to modify

| File | Change |
|------|--------|
| `src/hooks/useBackgroundRemoval.ts` | Add `simulateError` function, export it |
| `src/components/PreviewSection.tsx` | Add optional `onSimulateError` prop, render test button when done |
| `src/pages/Index.tsx` | Pass `simulateError` through to PreviewSection |

