"use client";

import {
  Download,
  Eye,
  FileImage,
  FileText,
  Loader2,
  Settings,
} from "lucide-react";
import {
  memo,
  useCallback,
  useState,
} from "react";
import type { ExportProps, ExportFormat, ExportResult } from "../types";
import { cn } from "../utils";

// Mapeamento de formatos para ícones e labels
const formatConfig = {
  pdf: { icon: FileText, label: 'PDF', extension: 'pdf' },
  markdown: { icon: FileText, label: 'Markdown', extension: 'md' },
  html: { icon: FileText, label: 'HTML', extension: 'html' },
  png: { icon: FileImage, label: 'PNG', extension: 'png' },
  jpg: { icon: FileImage, label: 'JPG', extension: 'jpg' },
  svg: { icon: FileImage, label: 'SVG', extension: 'svg' },
} as const;

// Componente para preview do resultado
const ExportPreview = memo(({
  content,
  format,
  onClose
}: {
  content: string;
  format: ExportFormat;
  onClose: () => void;
}) => {
  const renderPreview = useCallback(() => {
    switch (format) {
      case 'markdown':
        return (
          <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
            {content}
          </pre>
        );
      case 'html':
        return (
          <div
            className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      case 'png':
      case 'jpg':
      case 'svg':
        return (
          <div className="text-center p-8 bg-muted rounded-lg">
            <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Preview não disponível para imagens.
              <br />
              O arquivo será gerado com as configurações selecionadas.
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center p-8 bg-muted rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Preview do {format.toUpperCase()} será mostrado após a geração.
            </p>
          </div>
        );
    }
  }, [content, format]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">
            Preview - {formatConfig[format].label}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
});

ExportPreview.displayName = "ExportPreview";

// Componente para configurações de exportação
const ExportSettings = memo(({
  options,
  onOptionsChange
}: {
  options: ExportProps['options'];
  onOptionsChange: (options: ExportProps['options']) => void;
}) => {
  const handleFormatChange = useCallback((format: ExportFormat) => {
    onOptionsChange({ ...options, format });
  }, [options, onOptionsChange]);

  const handleToggleOption = useCallback((key: keyof typeof options) => {
    if (typeof options[key] === 'boolean') {
      onOptionsChange({
        ...options,
        [key]: !options[key]
      });
    }
  }, [options, onOptionsChange]);

  const handleInputChange = useCallback((key: string, value: string | number) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  }, [options, onOptionsChange]);

  return (
    <div className="space-y-4">
      {/* Formato */}
      <div>
        <label className="block text-sm font-medium mb-2">Formato</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(formatConfig) as [ExportFormat, typeof formatConfig[keyof typeof formatConfig]][]).map(([format, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={format}
                onClick={() => handleFormatChange(format)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors",
                  options.format === format
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                )}
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
        <label className="block text-sm font-medium mb-2">Incluir no Export</label>
        <div className="space-y-2">
          {[
            { key: 'includeSources' as const, label: 'Fontes e citações' },
            { key: 'includeAttachments' as const, label: 'Anexos' },
            { key: 'includeMetadata' as const, label: 'Metadados' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => handleToggleOption(key)}
                className="rounded"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Configurações específicas por formato */}
      {(options.format === 'pdf' || options.format === 'png' || options.format === 'jpg') && (
        <div>
          <label className="block text-sm font-medium mb-2">Configurações de Página</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Tamanho</label>
              <select
                value={options.pageSize}
                onChange={(e) => handleInputChange('pageSize', e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm"
              >
                <option value="a4">A4</option>
                <option value="letter">Carta</option>
                <option value="legal">Ofício</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Orientação</label>
              <select
                value={options.orientation}
                onChange={(e) => handleInputChange('orientation', e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm"
              >
                <option value="portrait">Retrato</option>
                <option value="landscape">Paisagem</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Configurações de imagem */}
      {(options.format === 'png' || options.format === 'jpg') && (
        <div>
          <label className="block text-sm font-medium mb-2">Qualidade da Imagem</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={options.quality || 0.8}
              onChange={(e) => handleInputChange('quality', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12">
              {Math.round((options.quality || 0.8) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Metadados customizados */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título Customizado</label>
          <input
            type="text"
            value={options.customTitle || ''}
            onChange={(e) => handleInputChange('customTitle', e.target.value)}
            placeholder="Opcional"
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Autor Customizado</label>
          <input
            type="text"
            value={options.customAuthor || ''}
            onChange={(e) => handleInputChange('customAuthor', e.target.value)}
            placeholder="Opcional"
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
});

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
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result: ExportResult = {
          url: `exported-file.${formatConfig[currentOptions.format].extension}`,
          filename: `export.${formatConfig[currentOptions.format].extension}`,
          size: Math.floor(Math.random() * 1000000), // Simulação
          format: currentOptions.format,
        };

        onExport?.(result);
      } catch (error) {
        console.error('Erro na exportação:', error);
      } finally {
        setIsExporting(false);
      }
    }, [currentOptions, onExport]);

    const handlePreview = useCallback(async () => {
      // Simulação de geração de preview
      let preview = content;

      if (currentOptions.includeSources && sources.length > 0) {
        preview += '\n\n## Fontes\n' + sources.map(s => `- ${s.title}`).join('\n');
      }

      if (currentOptions.includeAttachments && attachments.length > 0) {
        preview += '\n\n## Anexos\n' + attachments.map(a => `- ${a.name}`).join('\n');
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
                onClick={() => setShowSettings(!showSettings)}
                className="text-muted-foreground hover:text-foreground"
                type="button"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>

            {/* Resumo do conteúdo */}
            <div className="text-sm text-muted-foreground">
              <p>Conteúdo: {content.length} caracteres</p>
              {hasSources && <p>Fontes: {sources.length}</p>}
              {hasAttachments && <p>Anexos: {attachments.length}</p>}
            </div>

            {/* Configurações (expansível) */}
            {showSettings && (
              <div className="border-t pt-4">
                <ExportSettings
                  options={currentOptions}
                  onOptionsChange={setCurrentOptions}
                />
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 pt-4 border-t">
              {showPreview && (
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-accent"
                  type="button"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
              )}

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                type="button"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isExporting ? 'Exportando...' : `Exportar como ${formatLabel}`}
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