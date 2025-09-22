import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VizDataTable from "../lib/viz/viz-data-table";

describe("VizDataTable Component", () => {
  const sampleData = [
    { id: 1, name: "João", email: "joao@exemplo.com" },
    { id: 2, name: "Maria", email: "maria@exemplo.com" },
    { id: 3, name: "Pedro", email: "pedro@exemplo.com" },
  ];

  it("renders table with array of objects data", () => {
    const { getByTestId } = render(<VizDataTable data={sampleData} />);

    const table = getByTestId("viz-data-table");
    expect(table).toBeInTheDocument();

    // Verifica se as colunas estão corretas
    const headerCells = table.querySelectorAll("th");
    expect(headerCells.length).toBe(3);
    expect(headerCells[0].textContent).toBe("id");
    expect(headerCells[1].textContent).toBe("name");
    expect(headerCells[2].textContent).toBe("email");

    // Verifica se os dados estão corretos
    const rows = table.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);

    // Verifica primeira linha
    const firstRowCells = rows[0].querySelectorAll("td");
    expect(firstRowCells[0].textContent).toBe("1");
    expect(firstRowCells[1].textContent).toBe("João");
    expect(firstRowCells[2].textContent).toBe("joao@exemplo.com");
  });

  it("renders table with JSON string data", () => {
    const jsonData = JSON.stringify(sampleData);
    const { getByTestId } = render(<VizDataTable data={jsonData} />);

    const table = getByTestId("viz-data-table");
    expect(table).toBeInTheDocument();

    // Verifica se os dados foram processados corretamente
    const rows = table.querySelectorAll("tbody tr");
    expect(rows.length).toBe(3);
  });

  it("renders table with a single object as JSON string", () => {
    const singleObject = { id: 1, name: "João", email: "joao@exemplo.com" };
    const jsonData = JSON.stringify(singleObject);

    const { getByTestId } = render(<VizDataTable data={jsonData} />);

    const table = getByTestId("viz-data-table");
    expect(table).toBeInTheDocument();

    // Verifica se há apenas uma linha para o objeto único
    const rows = table.querySelectorAll("tbody tr");
    expect(rows.length).toBe(1);
  });

  it("renders error message when JSON is invalid", () => {
    const invalidJson = "{ isso não é um JSON válido }";
    const { container } = render(<VizDataTable data={invalidJson} />);

    const errorMessage = container.querySelector(".p-4.text-red-500");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage?.textContent).toContain("Erro ao renderizar a tabela");
  });

  it("renders error message when data is not an array of objects", () => {
    const invalidData = JSON.stringify("string simples");
    const { container } = render(<VizDataTable data={invalidData} />);

    const errorMessage = container.querySelector(".p-4.text-red-500");
    expect(errorMessage).toBeInTheDocument();
  });

  it("applies zebra striping when zebra prop is true", () => {
    const { getByTestId } = render(<VizDataTable data={sampleData} zebra />);

    const table = getByTestId("viz-data-table");
    const rows = table.querySelectorAll("tbody tr");

    // Verifica se a classe de zebra foi aplicada (varia dependendo da implementação)
    expect(rows[0].className).toContain("hover:bg-muted/50");
    expect(rows[1].className).toContain("even:bg-muted/20");
  });

  it("highlights first row when highlightFirstRow is true", () => {
    const { getByTestId } = render(
      <VizDataTable data={sampleData} highlightFirstRow />
    );

    const table = getByTestId("viz-data-table");
    const firstRow = table.querySelector("tbody tr:first-child");

    expect(firstRow?.className).toContain("bg-muted/50");
  });

  it("highlights first column when highlightFirstColumn is true", () => {
    const { getByTestId } = render(
      <VizDataTable data={sampleData} highlightFirstColumn />
    );

    const table = getByTestId("viz-data-table");
    const firstColumnCells = table.querySelectorAll("td:first-child");

    for (const cell of firstColumnCells) {
      expect(cell.className).toContain("bg-muted/30");
    }
  });

  it("applies bordered style when bordered prop is true", () => {
    const { getByTestId } = render(<VizDataTable bordered data={sampleData} />);

    const table = getByTestId("viz-data-table");
    const tableElement = table.querySelector("table");

    expect(tableElement?.className).toContain("border");
  });

  it("applies compact style when compact prop is true", () => {
    const { getByTestId } = render(<VizDataTable compact data={sampleData} />);

    const table = getByTestId("viz-data-table");
    const tableElement = table.querySelector("table");

    expect(tableElement?.className).toContain("text-xs");
  });

  it("renders caption when caption prop is provided", () => {
    const captionText = "Tabela de usuários";
    const { getByText } = render(
      <VizDataTable caption={captionText} data={sampleData} />
    );

    expect(getByText(captionText)).toBeInTheDocument();
  });

  it("applies maxHeight style when maxHeight prop is provided", () => {
    const { getByTestId } = render(
      <VizDataTable data={sampleData} maxHeight={200} />
    );

    const table = getByTestId("viz-data-table");

    expect(table.style.maxHeight).toBe("200px");
  });

  it("handles complex object values by converting them to JSON strings", () => {
    const complexData = [
      {
        id: 1,
        name: "João",
        address: { street: "Rua A", city: "São Paulo" },
      },
    ];

    const { getByTestId } = render(<VizDataTable data={complexData} />);

    const table = getByTestId("viz-data-table");
    const addressCell = table.querySelector("td:nth-child(3)");

    // O objeto complexo deve ser convertido para string JSON
    expect(addressCell?.textContent).toContain(
      '{"street":"Rua A","city":"São Paulo"}'
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <VizDataTable className="custom-class" data={sampleData} />
    );

    const tableContainer = container.firstChild;
    expect(tableContainer).toHaveClass("custom-class");
  });

  it("handles empty array data", () => {
    const { container } = render(<VizDataTable data={[]} />);

    const errorMessage = container.querySelector(".p-4.text-red-500");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage?.textContent).toContain("Array de dados vazio");
  });
});
