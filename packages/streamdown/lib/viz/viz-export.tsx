"use client";

import {
  Download,
  Eye,
  FileImage,
  FileText,
  Loader2,
  Settings,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { ExportFormat, ExportProps, ExportResult } from "../types";
import { cn } from "../utils";

// Mapeamento de formatos para ícones e labels
const formatConfig = {
  pdf: { icon: FileText, label: "PDF", extension: "pdf" },
  markdown: { icon: FileText, label: "Markdown", extension: "md" },
  html: { icon: FileText, label: "HTML", extension: "html" },
  png: { icon: FileImage, label: "PNG", extension: "png" },
  jpg: { icon: FileImage, label: "JPG", extension: "jpg" },
  svg: { icon: FileImage, label: "SVG", extension: "svg" },
} as const;

// Componente para preview do resultado
const ExportPreview = memo(
  ({
    content,
    format,
    onClose,
  }: {
    content: string;
    format: ExportFormat;
    onClose: () => void;
  }) => {
    const renderPreview = useCallback(() => {
      switch (format) {
        case "markdown":
          return (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
              {content}
            </pre>
          );
        case "html":
          return (
            <div
              className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        case "png":
        case "jpg":
        case "svg":
          return (
            <div className="rounded-lg bg-muted p-8 text-center">
              <FileImage className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                Preview não disponível para imagens.
                <br />O arquivo será gerado com as configurações selecionadas.
              </p>
            </div>
          );
        default:
          return (
            <div className="rounded-lg bg-muted p-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                Preview do {format.toUpperCase()} será mostrado após a geração.
              </p>
            </div>
          );
      }
    }, [content, format]);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="max-h-[90vh] w-full max-w-4xl rounded-lg bg-background shadow-lg">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold">
              Preview - {formatConfig[format].label}
            </h3>
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          </div>
          <div className="p-4">{renderPreview()}</div>
        </div>
      </div>
    );
  }
);

ExportPreview.displayName = "ExportPreview";

// Componente para configurações de exportação
const ExportSettings = memo(
  ({
    options,
    onOptionsChange,
  }: {
    options: ExportProps["options"];
    onOptionsChange: (options: ExportProps["options"]) => void;
  }) => {
    const handleFormatChange = useCallback(
      (format: ExportFormat) => {
        onOptionsChange({ ...options, format });
      },
      [options, onOptionsChange]
    );

    const handleToggleOption = useCallback(
      (key: keyof typeof options) => {
        if (typeof options[key] === "boolean") {
          onOptionsChange({
            ...options,
            [key]: !options[key],
          });
        }
      },
      [options, onOptionsChange]
    );

    const handleInputChange = useCallback(
      (key: string, value: string | number) => {
        onOptionsChange({
          ...options,
          [key]: value,
        });
      },
      [options, onOptionsChange]
    );

    return (
      <div className="space-y-4">
        {/* Formato */}
        <div>
          <label className="mb-2 block font-medium text-sm">Formato</label>
          <div className="grid grid-cols-3 gap-2">
            {(
              Object.entries(formatConfig) as [
                ExportFormat,
                (typeof formatConfig)[keyof typeof formatConfig],
              ][]
            ).map(([format, config]) => {
              const IconComponent = config.icon;
              return (
                <button
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                    options.format === format
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  key={format}
                  onClick={() => handleFormatChange(format)}
                  type="button"
                >
                  <IconComponent className="h-4 w-4" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Opções de conteúdo */}
        <div>
          <label className="mb-2 block font-medium text-sm">
            Incluir no Export
          </label>
          <div className="space-y-2">
            {[
              { key: "includeSources" as const, label: "Fontes e citações" },
              { key: "includeAttachments" as const, label: "Anexos" },
              { key: "includeMetadata" as const, label: "Metadados" },
            ].map(({ key, label }) => (
              <label className="flex items-center gap-2" key={key}>
                <input
                  checked={options[key]}
                  className="rounded"
                  onChange={() => handleToggleOption(key)}
                  type="checkbox"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Configurações específicas por formato */}
        {(options.format === "pdf" ||
          options.format === "png" ||
          options.format === "jpg") && (
          <div>
            <label className="mb-2 block font-medium text-sm">
              Configurações de Página
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-muted-foreground text-xs">
                  Tamanho
                </label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  onChange={(e) =>
                    handleInputChange("pageSize", e.target.value)
                  }
                  value={options.pageSize}
                >
                  <option value="a4">A4</option>
                  <option value="letter">Carta</option>
                  <option value="legal">Ofício</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-muted-foreground text-xs">
                  Orientação
                </label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  onChange={(e) =>
                    handleInputChange("orientation", e.target.value)
                  }
                  value={options.orientation}
                >
                  <option value="portrait">Retrato</option>
                  <option value="landscape">Paisagem</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Configurações de imagem */}
        {(options.format === "png" || options.format === "jpg") && (
          <div>
            <label className="mb-2 block font-medium text-sm">
              Qualidade da Imagem
            </label>
            <div className="flex items-center gap-2">
              <input
                className="flex-1"
                max="1"
                min="0.1"
                onChange={(e) =>
                  handleInputChange(
                    "quality",
                    Number.parseFloat(e.target.value)
                  )
                }
                step="0.1"
                type="range"
                value={options.quality || 0.8}
              />
              <span className="w-12 text-muted-foreground text-sm">
                {Math.round((options.quality || 0.8) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Metadados customizados */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-medium text-sm">
              Título Customizado
            </label>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              onChange={(e) => handleInputChange("customTitle", e.target.value)}
              placeholder="Opcional"
              type="text"
              value={options.customTitle || ""}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-sm">
              Autor Customizado
            </label>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              onChange={(e) =>
                handleInputChange("customAuthor", e.target.value)
              }
              placeholder="Opcional"
              type="text"
              value={options.customAuthor || ""}
            />
          </div>
        </div>
      </div>
    );
  }
);

ExportSettings.displayName = "ExportSettings";

// Componente principal de exportação
const VizExport = memo(
  ({
    content,
    sources = [],
    attachments = [],
    options,
    onExport,
    onPreview,
    showPreview = true,
    className,
    ...props
  }: ExportProps & React.HTMLAttributes<HTMLDivElement>) => {
    const [isExporting, setIsExporting] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentOptions, setCurrentOptions] = useState(options);
    const [previewContent, setPreviewContent] = useState<string | null>(null);

    const handleExport = useCallback(async () => {
      setIsExporting(true);
      try {
        // Simulação de exportação - em produção, isso seria uma chamada real para API
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const result: ExportResult = {
          url: `exported-file.${formatConfig[currentOptions.format].extension}`,
          filename: `export.${formatConfig[currentOptions.format].extension}`,
          size: Math.floor(Math.random() * 1_000_000), // Simulação
          format: currentOptions.format,
        };

        onExport?.(result);
      } catch (error) {
        console.error("Erro na exportação:", error);
      } finally {
        setIsExporting(false);
      }
    }, [currentOptions, onExport]);

    const handlePreview = useCallback(async () => {
      // Simulação de geração de preview
      let preview = content;

      if (currentOptions.includeSources && sources.length > 0) {
        preview += "\n\n## Fontes\n" + sources.map((s) => `- ${s.title}`).join("\n");
      }

      if (currentOptions.includeAttachments && attachments.length > 0) {
        preview += "\n\n## Anexos\n" + attachments.map((a) => `- ${a.name}`).join("\n");
      }

      setPreviewContent(preview);
      onPreview?.(preview);
    }, [content, sources, attachments, currentOptions, onPreview]);

    const formatLabel = formatConfig[currentOptions.format].label;
    const hasSources = sources.length > 0;
    const hasAttachments = attachments.length > 0;

    return (
      <>
        <div
          className={cn("rounded-lg border bg-card p-4", className)}
          data-testid="viz-export"
          {...props}
        >
          <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Exportar Conteúdo</h3>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowSettings(!showSettings)}
                type="button"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Resumo do conteúdo */}
            <div className="text-muted-foreground text-sm">
              <p>Conteúdo: {content.length} caracteres</p>
              {hasSources && <p>Fontes: {sources.length}</p>}
              {hasAttachments && <p>Anexos: {attachments.length}</p>}
            </div>

            {/* Configurações (expansível) */}
            {showSettings && (
              <div className="border-t pt-4">
                <ExportSettings
                  onOptionsChange={setCurrentOptions}
                  options={currentOptions}
                />
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 border-t pt-4">
              {showPreview && (
                <button
                  className="flex items-center gap-2 rounded border px-4 py-2 text-sm hover:bg-accent"
                  onClick={handlePreview}
                  type="button"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
              )}

              <button
                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={isExporting}
                onClick={handleExport}
                type="button"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExporting ? "Exportando..." : `Exportar como ${formatLabel}`}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewContent && (
          <ExportPreview
            content={previewContent}
            format={currentOptions.format}
            onClose={() => setPreviewContent(null)}
          />
        )}
      </>
    );
  }
);

VizExport.displayName = "VizExport";

export default VizExport;
