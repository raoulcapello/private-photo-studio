import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBackgroundRemoval } from "./useBackgroundRemoval";

describe("useBackgroundRemoval", () => {
  it("initializes with idle status and null values", () => {
    const { result } = renderHook(() => useBackgroundRemoval());
    expect(result.current.status).toBe("idle");
    expect(result.current.resultUrl).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.errorLog).toBeNull();
    expect(result.current.statusMessage).toBe("");
  });

  it("reset returns state to idle", () => {
    const { result } = renderHook(() => useBackgroundRemoval());
    act(() => result.current.reset());
    expect(result.current.status).toBe("idle");
    expect(result.current.resultUrl).toBeNull();
  });

  it("downloadResult is a no-op when no result exists", () => {
    const { result } = renderHook(() => useBackgroundRemoval());
    // Should not throw
    expect(() => act(() => result.current.downloadResult())).not.toThrow();
  });
});
