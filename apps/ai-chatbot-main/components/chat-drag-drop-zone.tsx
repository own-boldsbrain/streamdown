"use client";

import { memo, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export type ChatDragDropZoneProps = {
  onFilesDropped: (files: File[]) => void;
  className?: string;
  children?: React.ReactNode;
};

function PureChatDragDropZone({ onFilesDropped, className, children }: ChatDragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files || []);
      if (files.length > 0) {
        onFilesDropped(files);
      }
    },
    [onFilesDropped]
  );

  return (
    <button
      aria-dropeffect="copy"
      aria-label="Área para arrastar e soltar arquivos"
      className={cn(
        "w-full rounded-lg border border-dashed p-3 text-center text-muted-foreground text-sm",
        isDragging && "border-primary/60 bg-primary/5",
        className
      )}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      type="button"
    >
      {children ?? "Arraste arquivos aqui para anexar"}
    </button>
  );
}

export const ChatDragDropZone = memo(PureChatDragDropZone);
