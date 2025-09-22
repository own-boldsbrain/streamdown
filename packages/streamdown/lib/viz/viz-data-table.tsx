"use client";

import type { HTMLAttributes } from "react";
import { memo, useMemo } from "react";
import { cn } from "../utils";

// Interface para as propriedades do componente de tabela
interface VizDataTableProps extends HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[] | string;
  caption?: string;
  maxHeight?: number;
  zebra?: boolean;
  highlightFirstRow?: boolean;
  highlightFirstColumn?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

// Classes CSS para estilização
const tableClasses = {
  container: "overflow-x-auto rounded-md border bg-background p-4",
  tableWrapper: "relative overflow-auto rounded-md",
  table: "w-full border-collapse text-sm",
  tableHeader: "sticky top-0 bg-muted/50 font-medium text-muted-foreground",
  tableHeaderCell: "border-b p-4 text-left align-middle",
  tableBody: "divide-y",
  tableRow: "hover:bg-muted/50",
  tableRowZebra: "even:bg-muted/20",
  tableCell: "p-4 align-middle",
  caption: "mt-2 text-center text-muted-foreground text-sm",
  firstRowHighlight: "bg-muted/50 font-medium",
  firstColumnHighlight: "bg-muted/30 font-medium",
  bordered: "border-collapse border border-border",
  borderedCell: "border border-border",
  compact: "text-xs [&_td]:p-2 [&_th]:p-2",
  errorMessage: "p-4 text-red-500 text-sm border border-red-200 rounded-md bg-red-50 dark:bg-red-950/10",
};

const VizDataTable = memo(
  ({
    data,
    caption,
    maxHeight,
    zebra = false,
    highlightFirstRow = true,
    highlightFirstColumn = false,
    bordered = false,
    compact = false,
    className,
    ...props
  }: VizDataTableProps) => {
    // Processa os dados da tabela
    const { headers, rows, error } = useMemo(() => {
      // Se os dados forem passados como string, tentamos fazer o parse como JSON
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          // Verifica se é um array de objetos
          if (Array.isArray(parsed) && parsed.length > 0) {
            return processTableData(parsed);
          }
          // Se for um objeto simples, transformamos em um array com um elemento
          if (typeof parsed === "object" && parsed !== null) {
            return processTableData([parsed]);
          }
          // Caso contrário, retornamos um erro
          return {
            headers: [],
            rows: [],
            error: "Os dados não são um array de objetos ou um objeto simples",
          };
        } catch (e) {
          return {
            headers: [],
            rows: [],
            error: `Erro ao processar os dados JSON: ${
              e instanceof Error ? e.message : "Formato inválido"
            }`,
          };
        }
      }

      // Se for um array de objetos, processamos diretamente
      if (Array.isArray(data) && data.length > 0) {
        return processTableData(data);
      }

      // Caso não tenhamos dados válidos
      return {
        headers: [],
        rows: [],
        error: "Nenhum dado válido fornecido",
      };
    }, [data]);

    // Função para processar os dados da tabela e extrair cabeçalhos e linhas
    function processTableData(tableData: Record<string, unknown>[]) {
      if (tableData.length === 0) {
        return { headers: [], rows: [], error: "Array de dados vazio" };
      }

      try {
        // Extrai todas as chaves únicas para usar como cabeçalhos
        const headers = Array.from(
          new Set(tableData.flatMap((row) => Object.keys(row)))
        );

        // Mapeia os dados para linhas da tabela
        const rows = tableData.map((row) => {
          return headers.map((header) => {
            const value = row[header];
            // Converte valores complexos para representação em string
            if (typeof value === "object" && value !== null) {
              return JSON.stringify(value);
            }
            return value === undefined ? "" : String(value);
          });
        });

        return { headers, rows, error: null };
      } catch (e) {
        return {
          headers: [],
          rows: [],
          error: `Erro ao processar os dados: ${
            e instanceof Error ? e.message : "Erro desconhecido"
          }`,
        };
      }
    }

    // Estilos condicionais para a tabela
    const tableStyles = {
      maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    };

    // Se houver um erro, exibimos a mensagem
    if (error) {
      return (
        <div className={cn(tableClasses.container, className)} {...props}>
          <div className={tableClasses.errorMessage}>
            <p>Erro ao renderizar a tabela:</p>
            <p className="mt-2">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={cn(tableClasses.container, className)} {...props}>
        <div 
          className={tableClasses.tableWrapper}
          style={tableStyles}
          data-testid="viz-data-table"
        >
          <table
            className={cn(
              tableClasses.table,
              bordered && tableClasses.bordered,
              compact && tableClasses.compact
            )}
          >
            <thead className={tableClasses.tableHeader}>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={`header-${index}`}
                    className={cn(
                      tableClasses.tableHeaderCell,
                      bordered && tableClasses.borderedCell,
                      highlightFirstColumn && index === 0 && tableClasses.firstColumnHighlight
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={tableClasses.tableBody}>
              {rows.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className={cn(
                    tableClasses.tableRow,
                    zebra && tableClasses.tableRowZebra,
                    highlightFirstRow && rowIndex === 0 && tableClasses.firstRowHighlight
                  )}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className={cn(
                        tableClasses.tableCell,
                        bordered && tableClasses.borderedCell,
                        highlightFirstColumn && cellIndex === 0 && tableClasses.firstColumnHighlight
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {caption && (
          <div className={tableClasses.caption}>
            {caption}
          </div>
        )}
      </div>
    );
  }
);

VizDataTable.displayName = "VizDataTable";

export default VizDataTable;