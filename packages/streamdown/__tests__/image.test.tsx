import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Importação necessária para os matchers
import { describe, expect, it } from "vitest";
import { ImageComponent } from "../lib/image";

describe("Image Component", () => {
  it("should render an image with default wrapper", () => {
    const src = "https://example.com/image.png";
    const alt = "Example image";

    const { container } = render(<ImageComponent alt={alt} src={src} />);

    const img = screen.getByAltText(alt);
    expect(img).toHaveAttribute("src", src);
    const wrapper = container.querySelector('[data-streamdown="image-wrapper"]');
    expect(wrapper).toBeTruthy();
  });

  it("should render an image with inline wrapper when in paragraph context", () => {
    const src = "https://example.com/image.png";
    const alt = "Example image";

    // Simular que a imagem está em um parágrafo (mesma linha de início e fim)
    const node = {
      position: {
        start: { line: 1, column: 1 },
        end: { line: 1, column: 50 },
      },
    };

    const { container } = render(
      <ImageComponent alt={alt} node={node as any} src={src} />
    );

    const img = screen.getByAltText(alt);
    expect(img).toHaveAttribute("src", src);
    const wrapper = container.querySelector(
      '[data-streamdown="image-inline-wrapper"]'
    );
    expect(wrapper).toBeTruthy();
  });

  it("should not render anything when src is not provided", () => {
    const { container } = render(<ImageComponent alt="No source" />);
    expect(container.firstChild).toBeNull();
  });

  it("should include download button in both block and inline versions", () => {
    // Block version
    const { rerender, container } = render(
      <ImageComponent alt="Block image" src="https://example.com/image.png" />
    );

    const blockButton = container.querySelector("button");
    expect(blockButton).toHaveAttribute("title", "Download image");

    // Inline version
    const node = {
      position: {
        start: { line: 1, column: 1 },
        end: { line: 1, column: 50 },
      },
    };

    rerender(
      <ImageComponent
        alt="Inline image"
        node={node as any}
        src="https://example.com/image.png"
      />
    );

    const inlineButton = container.querySelector("button");
    expect(inlineButton).toHaveAttribute("title", "Download image");
  });
});
