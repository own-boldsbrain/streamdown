import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VizCallout from "../lib/viz/viz-callout";

describe("VizCallout Component", () => {
  it("renders with default props", () => {
    const { getByTestId } = render(
      <VizCallout>Este é um callout básico</VizCallout>
    );

    const callout = getByTestId("viz-callout");
    expect(callout).toBeInTheDocument();
    expect(callout.getAttribute("data-callout-type")).toBe("note");
    expect(callout.textContent).toContain("Este é um callout básico");
  });

  it("renders each callout type with correct styling", () => {
    const types = [
      "info",
      "warning",
      "error",
      "success",
      "tip",
      "note",
      "help",
      "important",
    ] as const;

    for (const type of types) {
      const { getByTestId } = render(
        <VizCallout type={type}>Conteúdo do callout</VizCallout>
      );

      const callout = getByTestId("viz-callout");
      expect(callout).toBeInTheDocument();
      expect(callout.getAttribute("data-callout-type")).toBe(type);
    }
  });

  it("renders with title", () => {
    const { getByText } = render(
      <VizCallout title="Título do Callout">Conteúdo do callout</VizCallout>
    );

    expect(getByText("Título do Callout")).toBeInTheDocument();
  });

  it("renders without icon when icon prop is false", () => {
    const { getByTestId } = render(
      <VizCallout icon={false}>Callout sem ícone</VizCallout>
    );

    const callout = getByTestId("viz-callout");
    const svgElement = callout.querySelector("svg");
    expect(svgElement).toBeNull();
  });

  it("applies custom className", () => {
    const { getByTestId } = render(
      <VizCallout className="custom-class">
        Callout com classe personalizada
      </VizCallout>
    );

    const callout = getByTestId("viz-callout");
    expect(callout.classList.contains("custom-class")).toBe(true);
  });

  it("passes additional props to the component", () => {
    const { getByTestId } = render(
      <VizCallout data-extra="test-value">
        Callout com props adicionais
      </VizCallout>
    );

    const callout = getByTestId("viz-callout");
    expect(callout.getAttribute("data-extra")).toBe("test-value");
  });

  it("renders with different icon for each type", () => {
    const types = [
      "info",
      "warning",
      "error",
      "success",
      "tip",
      "note",
      "help",
      "important",
    ] as const;

    for (const type of types) {
      const { getByTestId } = render(
        <VizCallout type={type}>Conteúdo do callout</VizCallout>
      );

      const callout = getByTestId("viz-callout");
      const iconElement = callout.querySelector("svg");
      expect(iconElement).toBeInTheDocument();
    }
  });

  it("renders nested content correctly", () => {
    const { getByText } = render(
      <VizCallout>
        <p>Parágrafo 1</p>
        <p>Parágrafo 2</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </VizCallout>
    );

    expect(getByText("Parágrafo 1")).toBeInTheDocument();
    expect(getByText("Parágrafo 2")).toBeInTheDocument();
    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("Item 2")).toBeInTheDocument();
  });
});
