"use client";

import Image from "next/image";
import { memo } from "react";
import type { Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CrossSmallIcon, FileIcon, ImageIcon } from "./icons";
import { Button } from "./ui/button";

export type ChatAttachmentPillProps = {
  attachment: Attachment;
  isUploading?: boolean;
  onRemove?: () => void;
  className?: string;
};

function PureChatAttachmentPill({
  attachment,
  isUploading = false,
  onRemove,
  className,
}: ChatAttachmentPillProps) {
  const { name, url, contentType } = attachment;
  const isImage = Boolean(contentType?.startsWith("image"));

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-full border bg-muted px-2 py-1",
        className
      )}
    >
      <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-background">
        {isImage && url ? (
          <Image alt={name ?? "attachment"} height={24} src={url} width={24} />
        ) : contentType?.startsWith("image") ? (
          <ImageIcon size={12} />
        ) : (
          <FileIcon size={12} />
        )}
      </div>
      <span className="max-w-[140px] truncate text-xs">{name}</span>
      {onRemove && !isUploading && (
        <Button
          className="size-5 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
          size="sm"
          type="button"
          variant="destructive"
        >
          <CrossSmallIcon size={8} />
        </Button>
      )}
    </div>
  );
}

export const ChatAttachmentPill = memo(PureChatAttachmentPill);
