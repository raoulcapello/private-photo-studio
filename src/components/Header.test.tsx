import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";

describe("Header", () => {
  const renderHeader = () =>
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

  it("renders app name with logo", () => {
    renderHeader();
    expect(screen.getByText("Private Photo Studio")).toBeInTheDocument();
    const logo = document.querySelector('img[aria-hidden="true"]');
    expect(logo).toBeInTheDocument();
  });

  it("renders Editor nav link", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: /editor/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders About nav link", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "/about"
    );
  });
});
