import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  TableCopyButton,
  TableDownloadButton,
  TableDownloadDropdown,
} from "../lib/table";

// Mock for navigator.clipboard
const mockClipboard = {
  write: vi.fn().mockResolvedValue(undefined),
  writeText: vi.fn().mockResolvedValue(undefined),
};

// Mock for URL functions
const mockCreateObjectURL = vi.fn().mockReturnValue("mock-url");
const mockRevokeObjectURL = vi.fn();

// Mock for document functions
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

// Mock for creating download link
const mockAnchorElement = {
  href: "",
  download: "",
  click: vi.fn(),
};

// Helper to create a table HTML structure
const createTableElement = () => {
  const table = document.createElement("table");

  // Create thead
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Name", "Age", "Email"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create tbody
  const tbody = document.createElement("tbody");
  const rows = [
    ["John Doe", "30", "john@example.com"],
    ["Jane Smith", "25", "jane@example.com"],
  ];

  rows.forEach((rowData) => {
    const tr = document.createElement("tr");
    rowData.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
};

describe("Table Components", () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    // Mock URL API
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document methods
    document.body.appendChild = mockAppendChild;
    document.body.removeChild = mockRemoveChild;

    // Mock createElement for download link
    document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === "a") {
        return mockAnchorElement;
      }
      return document.createElement(tag);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("TableCopyButton", () => {
    it("should copy table data as markdown when clicked", async () => {
      const onCopy = vi.fn();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(
        <TableCopyButton format="markdown" onCopy={onCopy} />
      );

      // Simulate click
      fireEvent.click(getByTitle("Copy table as markdown"));

      await waitFor(() => {
        expect(mockClipboard.write).toHaveBeenCalled();
        expect(onCopy).toHaveBeenCalled();
      });

      document.body.removeChild(wrapper);
    });

    it("should copy table data as CSV when clicked", async () => {
      const onCopy = vi.fn();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(
        <TableCopyButton format="csv" onCopy={onCopy} />
      );

      // Simulate click
      fireEvent.click(getByTitle("Copy table as csv"));

      await waitFor(() => {
        expect(mockClipboard.write).toHaveBeenCalled();
        expect(onCopy).toHaveBeenCalled();
      });

      document.body.removeChild(wrapper);
    });

    it("should handle errors when table is not found", async () => {
      const onError = vi.fn();

      const { getByTitle } = render(<TableCopyButton onError={onError} />);

      // Simulate click
      fireEvent.click(getByTitle("Copy table as markdown"));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect(onError.mock.calls[0][0].message).toBe("Table not found");
      });
    });

    it("should handle clipboard API not available", async () => {
      const onError = vi.fn();

      // Mock clipboard API not available
      Object.defineProperty(navigator, "clipboard", {
        value: {
          write: undefined,
        },
        writable: true,
        configurable: true,
      });

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(<TableCopyButton onError={onError} />);

      // Simulate click
      fireEvent.click(getByTitle("Copy table as markdown"));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect(onError.mock.calls[0][0].message).toBe(
          "Clipboard API not available"
        );
      });

      document.body.removeChild(wrapper);
    });

    it("should handle clipboard write failure", async () => {
      const onError = vi.fn();
      const error = new Error("Clipboard write failed");

      // Mock clipboard write failure
      Object.defineProperty(navigator, "clipboard", {
        value: {
          write: vi.fn().mockRejectedValue(error),
        },
        writable: true,
        configurable: true,
      });

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(<TableCopyButton onError={onError} />);

      // Simulate click
      fireEvent.click(getByTitle("Copy table as markdown"));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });

      document.body.removeChild(wrapper);
    });

    it("should reset icon after timeout", async () => {
      vi.useFakeTimers();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(<TableCopyButton timeout={1000} />);

      // Simulate click
      fireEvent.click(getByTitle("Copy table as markdown"));

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(1000);

      document.body.removeChild(wrapper);
    });
  });

  describe("TableDownloadButton", () => {
    it("should download table data as CSV when clicked", async () => {
      const onDownload = vi.fn();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(
        <TableDownloadButton format="csv" onDownload={onDownload} />
      );

      // Simulate click
      fireEvent.click(getByTitle("Download table as CSV"));

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockAnchorElement.click).toHaveBeenCalled();
        expect(onDownload).toHaveBeenCalled();
      });

      document.body.removeChild(wrapper);
    });

    it("should download table data as Markdown when clicked", async () => {
      const onDownload = vi.fn();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(
        <TableDownloadButton format="markdown" onDownload={onDownload} />
      );

      // Simulate click
      fireEvent.click(getByTitle("Download table as MARKDOWN"));

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockAnchorElement.click).toHaveBeenCalled();
        expect(onDownload).toHaveBeenCalled();
      });

      document.body.removeChild(wrapper);
    });

    it("should use custom filename when provided", async () => {
      const onDownload = vi.fn();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle } = render(
        <TableDownloadButton
          filename="custom-table"
          format="csv"
          onDownload={onDownload}
        />
      );

      // Simulate click
      fireEvent.click(getByTitle("Download table as CSV"));

      await waitFor(() => {
        expect(mockAnchorElement.download).toBe("custom-table.csv");
      });

      document.body.removeChild(wrapper);
    });

    it("should handle errors when table is not found", async () => {
      const onError = vi.fn();

      const { getByTitle } = render(<TableDownloadButton onError={onError} />);

      // Simulate click
      fireEvent.click(getByTitle("Download table as CSV"));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect(onError.mock.calls[0][0].message).toBe("Table not found");
      });
    });

    it("should handle download errors", async () => {
      const onError = vi.fn();
      const error = new Error("Download failed");

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      // Mock URL.createObjectURL to throw an error
      global.URL.createObjectURL = vi.fn().mockImplementation(() => {
        throw error;
      });

      const { getByTitle } = render(<TableDownloadButton onError={onError} />);

      // Simulate click
      fireEvent.click(getByTitle("Download table as CSV"));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });

      document.body.removeChild(wrapper);
    });
  });

  describe("TableDownloadDropdown", () => {
    it("should show dropdown options when clicked", async () => {
      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle, getByText } = render(<TableDownloadDropdown />);

      // Simulate click to open dropdown
      fireEvent.click(getByTitle("Download table"));

      await waitFor(() => {
        expect(getByText("CSV")).toBeInTheDocument();
        expect(getByText("Markdown")).toBeInTheDocument();
      });

      document.body.removeChild(wrapper);
    });

    it("should download as CSV when CSV option is clicked", async () => {
      const onDownload = vi.fn();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle, getByText } = render(
        <TableDownloadDropdown onDownload={onDownload} />
      );

      // Simulate click to open dropdown
      fireEvent.click(getByTitle("Download table"));

      // Simulate click on CSV option
      fireEvent.click(getByText("CSV"));

      await waitFor(() => {
        expect(onDownload).toHaveBeenCalledWith("csv");
      });

      document.body.removeChild(wrapper);
    });

    it("should download as Markdown when Markdown option is clicked", async () => {
      const onDownload = vi.fn();

      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle, getByText } = render(
        <TableDownloadDropdown onDownload={onDownload} />
      );

      // Simulate click to open dropdown
      fireEvent.click(getByTitle("Download table"));

      // Simulate click on Markdown option
      fireEvent.click(getByText("Markdown"));

      await waitFor(() => {
        expect(onDownload).toHaveBeenCalledWith("markdown");
      });

      document.body.removeChild(wrapper);
    });

    it("should handle errors when table is not found", async () => {
      const onError = vi.fn();

      const { getByTitle, getByText } = render(
        <TableDownloadDropdown onError={onError} />
      );

      // Simulate click to open dropdown
      fireEvent.click(getByTitle("Download table"));

      // Simulate click on CSV option
      fireEvent.click(getByText("CSV"));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect(onError.mock.calls[0][0].message).toBe("Table not found");
      });
    });

    it("should close dropdown when clicking outside", async () => {
      // Create a simple wrapper structure with a table inside
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-streamdown", "table-wrapper");
      const table = createTableElement();
      wrapper.appendChild(table);

      document.body.appendChild(wrapper);

      const { getByTitle, getByText, queryByText } = render(
        <TableDownloadDropdown />
      );

      // Simulate click to open dropdown
      fireEvent.click(getByTitle("Download table"));

      await waitFor(() => {
        expect(getByText("CSV")).toBeInTheDocument();
      });

      // Simulate click outside
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(queryByText("CSV")).not.toBeInTheDocument();
      });

      document.body.removeChild(wrapper);
    });
  });
});
