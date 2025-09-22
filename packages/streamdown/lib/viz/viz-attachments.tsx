"use client";

import {
  Download,
  Eye,
  File,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  Music,
  X,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import type { Attachment, AttachmentsProps } from "../types";
import { cn } from "../utils";

// Mapeamento de tipos de arquivo para ícones
const fileTypeIcons = {
  pdf: FileText,
  image: FileImage,
  video: FileVideo,
  audio: Music,
  document: FileText,
  spreadsheet: File,
  presentation: File,
  archive: File,
  other: File,
} as const;

// Componente para preview de imagem
const ImagePreview = memo(
  ({
    src,
    alt,
    onClose,
  }: {
    src: string;
    alt: string;
    onClose: () => void;
  }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="relative max-h-[90vh] max-w-[90vw]">
          <button
            className="-right-2 -top-2 absolute rounded-full bg-white p-1 shadow-lg hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
          <img
            alt={alt}
            className="max-h-full max-w-full rounded-lg object-contain"
            src={src}
          />
        </div>
      </div>
    );
  }
);

ImagePreview.displayName = "ImagePreview";

// Componente para item de anexo
const AttachmentItem = memo(
  ({
    attachment,
    onDownload,
    onPreview,
    showThumbnails = true,
    showStatus = true,
  }: {
    attachment: Attachment;
    onDownload?: (attachment: Attachment) => void;
    onPreview?: (attachment: Attachment) => void;
    showThumbnails?: boolean;
    showStatus?: boolean;
  }) => {
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

    const IconComponent = fileTypeIcons[attachment.type] || File;

    const handlePreview = useCallback(() => {
      if (attachment.type === "image" && attachment.url) {
        setIsImagePreviewOpen(true);
      } else {
        onPreview?.(attachment);
      }
    }, [attachment, onPreview]);

    const handleDownload = useCallback(() => {
      onDownload?.(attachment);
    }, [attachment, onDownload]);

    const formatFileSize = useCallback((bytes?: number) => {
      if (!bytes) return "";
      const units = ["B", "KB", "MB", "GB"];
      let size = bytes;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${size.toFixed(1)} ${units[unitIndex]}`;
    }, []);

    const isImage = attachment.type === "image";
    const canPreview = isImage || onPreview;

    return (
      <>
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
          {/* Thumbnail ou ícone */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
            {showThumbnails && attachment.thumbnailUrl ? (
              <img
                alt={attachment.name}
                className="h-full w-full rounded-lg object-cover"
                src={attachment.thumbnailUrl}
              />
            ) : (
              <IconComponent className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {/* Informações do arquivo */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-medium text-sm">
                  {attachment.name}
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <span className="uppercase">{attachment.type}</span>
                  {attachment.size && (
                    <>
                      <span>•</span>
                      <span>{formatFileSize(attachment.size)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status */}
              {showStatus && (
                <div className="flex items-center gap-1">
                  {attachment.status === "loading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  {attachment.status === "error" && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  {attachment.status === "ready" && (
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                </div>
              )}
            </div>

            {/* Mensagem de erro */}
            {attachment.status === "error" && attachment.errorMessage && (
              <p className="mt-1 text-red-600 text-xs">
                {attachment.errorMessage}
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-1">
            {canPreview && attachment.status === "ready" && (
              <button
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={handlePreview}
                title="Visualizar"
                type="button"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}

            {attachment.status === "ready" && (
              <button
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={handleDownload}
                title="Download"
                type="button"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Preview de imagem */}
        {isImagePreviewOpen && attachment.url && (
          <ImagePreview
            alt={attachment.name}
            onClose={() => setIsImagePreviewOpen(false)}
            src={attachment.url}
          />
        )}
      </>
    );
  }
);

AttachmentItem.displayName = "AttachmentItem";

// Componente principal de anexos
const VizAttachments = memo(
  ({
    attachments,
    onDownload,
    onPreview,
    showThumbnails = true,
    showStatus = true,
    maxItems,
    className,
    ...props
  }: AttachmentsProps & React.HTMLAttributes<HTMLDivElement>) => {
    const displayedAttachments = maxItems
      ? attachments.slice(0, maxItems)
      : attachments;

    const hasMore = maxItems && attachments.length > maxItems;

    // Estatísticas dos anexos
    const stats = {
      total: attachments.length,
      ready: attachments.filter((a) => a.status === "ready").length,
      loading: attachments.filter((a) => a.status === "loading").length,
      error: attachments.filter((a) => a.status === "error").length,
    };

    return (
      <div
        className={cn("space-y-3", className)}
        data-testid="viz-attachments"
        {...props}
      >
        {/* Cabeçalho com estatísticas */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Anexos ({stats.total})</h3>

          {stats.total > 0 && (
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              {stats.ready > 0 && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  {stats.ready} prontos
                </span>
              )}
              {stats.loading > 0 && (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {stats.loading} carregando
                </span>
              )}
              {stats.error > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <X className="h-3 w-3" />
                  {stats.error} com erro
                </span>
              )}
            </div>
          )}
        </div>

        {/* Lista de anexos */}
        {displayedAttachments.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <File className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground text-sm">
              Nenhum anexo disponível
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedAttachments.map((attachment) => (
              <AttachmentItem
                attachment={attachment}
                key={attachment.id}
                onDownload={onDownload}
                onPreview={onPreview}
                showStatus={showStatus}
                showThumbnails={showThumbnails}
              />
            ))}

            {/* Indicador de mais itens */}
            {hasMore && (
              <div className="text-center text-muted-foreground text-sm">
                +{attachments.length - maxItems} mais anexos
              </div>
            )}
          </div>
        )}

        {/* Ações em lote (se houver múltiplos anexos) */}
        {attachments.length > 1 && stats.ready > 0 && (
          <div className="flex justify-end gap-2 border-t pt-2">
            <button
              className="text-blue-600 text-sm hover:text-blue-800 hover:underline"
              onClick={() => attachments.forEach((att) => onDownload?.(att))}
              type="button"
            >
              Baixar todos ({stats.ready})
            </button>
          </div>
        )}
      </div>
    );
  }
);

VizAttachments.displayName = "VizAttachments";

export default VizAttachments;
