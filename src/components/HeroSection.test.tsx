import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  const onFileSelect = vi.fn();

  it("renders headline with primary keyword", () => {
    render(<HeroSection onFileSelect={onFileSelect} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Free AI Profile Picture Background Remover"
    );
  });

  it("renders subtext with LinkedIn/CVs keywords", () => {
    render(<HeroSection onFileSelect={onFileSelect} />);
    expect(
      screen.getByText(/Create professional headshots for LinkedIn/i)
    ).toBeInTheDocument();
  });

  it("renders all three privacy badges", () => {
    render(<HeroSection onFileSelect={onFileSelect} />);
    expect(screen.getByText("No uploads")).toBeInTheDocument();
    expect(screen.getByText("No tracking")).toBeInTheDocument();
    expect(screen.getByText("Runs locally")).toBeInTheDocument();
  });

  it("renders the CTA button", () => {
    render(<HeroSection onFileSelect={onFileSelect} />);
    expect(
      screen.getByRole("button", { name: /select a photo/i })
    ).toBeInTheDocument();
  });

  it("calls onFileSelect when a file is chosen", () => {
    render(<HeroSection onFileSelect={onFileSelect} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["pixels"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it("renders all three use case items", () => {
    render(<HeroSection onFileSelect={onFileSelect} />);
    expect(screen.getByText("Professional Headshots")).toBeInTheDocument();
    expect(screen.getByText("Social Media")).toBeInTheDocument();
    expect(screen.getByText("AI-Powered")).toBeInTheDocument();
  });

  it("renders processing info subtext", () => {
    render(<HeroSection onFileSelect={onFileSelect} />);
    expect(
      screen.getByText(/All processing happens in your browser/i)
    ).toBeInTheDocument();
  });
});
