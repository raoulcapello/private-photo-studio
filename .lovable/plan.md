

## Remove Temporary "Test Error Report" Button

### Overview
Remove the temporary test button and keep the error reporting UI (error log, copy button, report issue link) only for actual errors.

### Changes

#### 1. `src/components/PreviewSection.tsx`
- Remove the `onSimulateError` prop from the interface and destructuring
- Remove the "Test error report" button (lines 137-142)

#### 2. `src/pages/Index.tsx`
- Remove `simulateError` from the `useBackgroundRemoval()` destructuring
- Remove the `onSimulateError={simulateError}` prop from `PreviewSection`

#### 3. `src/hooks/useBackgroundRemoval.ts`
- Remove the `simulateError` callback function
- Remove `simulateError` from the return statement

No other changes needed -- the error log generation and reporting UI in the error state remains intact and will activate whenever a real processing error occurs.

### Files to modify

| File | Change |
|------|--------|
| `src/components/PreviewSection.tsx` | Remove `onSimulateError` prop and test button |
| `src/pages/Index.tsx` | Remove `simulateError` usage |
| `src/hooks/useBackgroundRemoval.ts` | Remove `simulateError` function and export |

