import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PreviewSection } from "./PreviewSection";

const baseProps = {
  originalUrl: "blob:http://localhost/original",
  resultUrl: null,
  status: "idle" as const,
  statusMessage: "",
  error: null,
  errorLog: null,
  onDownload: vi.fn(),
  onReset: vi.fn(),
};

describe("PreviewSection", () => {
  it("shows original image", () => {
    render(<PreviewSection {...baseProps} />);
    const img = screen.getByAltText("Original photo") as HTMLImageElement;
    expect(img.src).toContain("original");
  });

  it("shows progress and status during loading-model", () => {
    render(
      <PreviewSection
        {...baseProps}
        status="loading-model"
        statusMessage="Loading model…"
      />
    );
    expect(screen.getByText("Loading model…")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows progress and status during processing", () => {
    render(
      <PreviewSection
        {...baseProps}
        status="processing"
        statusMessage="Removing background…"
      />
    );
    expect(screen.getByText("Removing background…")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows result image and download button when done", () => {
    render(
      <PreviewSection
        {...baseProps}
        status="done"
        statusMessage="Done!"
        resultUrl="blob:http://localhost/result"
      />
    );
    expect(screen.getByAltText("Background removed")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download png/i })
    ).toBeInTheDocument();
  });

  it("calls onDownload when download button is clicked", () => {
    const onDownload = vi.fn();
    render(
      <PreviewSection
        {...baseProps}
        status="done"
        resultUrl="blob:http://localhost/result"
        onDownload={onDownload}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /download png/i }));
    expect(onDownload).toHaveBeenCalled();
  });

  it("shows error message on error status", () => {
    render(
      <PreviewSection
        {...baseProps}
        status="error"
        error="Something went wrong"
      />
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows error log, copy button, and report issue link", () => {
    const errorLog = "--- Error Report ---\nError: test failure";
    render(
      <PreviewSection
        {...baseProps}
        status="error"
        error="Decode failed"
        errorLog={errorLog}
      />
    );
    expect(screen.getByText(/Error Report/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy error log/i })
    ).toBeInTheDocument();
    const reportLink = screen.getByRole("link", { name: /report issue/i });
    expect(reportLink).toHaveAttribute(
      "href",
      expect.stringContaining("github.com/raoulcapello/private-photo-studio/issues/new")
    );
    expect(reportLink).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent("Decode failed"))
    );
  });

  it("calls onReset when 'Try another photo' is clicked", () => {
    const onReset = vi.fn();
    render(<PreviewSection {...baseProps} onReset={onReset} />);
    fireEvent.click(
      screen.getByRole("button", { name: /try another photo/i })
    );
    expect(onReset).toHaveBeenCalled();
  });
});
