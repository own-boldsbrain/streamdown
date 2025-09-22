"use client";

import { memo } from "react";
import { PaperclipIcon } from "./icons";
import { Button } from "./ui/button";

export type ChatAttachmentButtonProps = {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  disabled?: boolean;
  isReasoningModel?: boolean;
  className?: string;
};

function PureChatAttachmentButton({
  fileInputRef,
  disabled,
  isReasoningModel,
  className,
}: ChatAttachmentButtonProps) {
  const isDisabled = Boolean(disabled) || Boolean(isReasoningModel);

  return (
    <Button
      className={
        className ??
        "aspect-square h-8 rounded-lg p-1 transition-colors hover:bg-accent"
      }
      data-testid="attachments-button"
      disabled={isDisabled}
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      type="button"
      variant="ghost"
    >
      <PaperclipIcon size={14} style={{ width: 14, height: 14 }} />
    </Button>
  );
}

export const ChatAttachmentButton = memo(PureChatAttachmentButton);
