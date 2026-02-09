import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrivacyFooter } from "./PrivacyFooter";

describe("PrivacyFooter", () => {
  it("renders the privacy statement", () => {
    render(<PrivacyFooter />);
    expect(
      screen.getByText(/your images never leave your device/i)
    ).toBeInTheDocument();
  });

  it("renders BRIA AI attribution link", () => {
    render(<PrivacyFooter />);
    const link = screen.getByRole("link", { name: /bria ai/i });
    expect(link).toHaveAttribute("href", "https://huggingface.co/briaai");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders support link", () => {
    render(<PrivacyFooter />);
    expect(
      screen.getByRole("link", { name: /support development/i })
    ).toHaveAttribute("href", "https://liberapay.com/raoul/donate");
  });

  it("renders feedback link", () => {
    render(<PrivacyFooter />);
    expect(
      screen.getByRole("link", { name: /feedback welcome/i })
    ).toHaveAttribute(
      "href",
      "https://github.com/raoulcapello/private-photo-studio/issues"
    );
  });

  it("renders source code link", () => {
    render(<PrivacyFooter />);
    expect(
      screen.getByRole("link", { name: /source code/i })
    ).toHaveAttribute(
      "href",
      "https://github.com/raoulcapello/private-photo-studio/tree/main"
    );
  });

  it("renders about the developer link", () => {
    render(<PrivacyFooter />);
    expect(
      screen.getByRole("link", { name: /about the developer/i })
    ).toHaveAttribute("href", "https://www.raoulcapello.nl/");
  });
});
