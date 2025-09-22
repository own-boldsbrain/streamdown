"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { memo } from "react";
import type { ChatMessage } from "@/lib/types";
import { UndoIcon } from "./icons";
import { Button } from "./ui/button";

export type ChatRetryButtonProps = {
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  messageId?: string;
  className?: string;
};

function PureChatRetryButton({ regenerate, messageId, className }: ChatRetryButtonProps) {
  return (
    <Button
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (messageId) {
          regenerate({ messageId });
        } else {
          regenerate();
        }
      }}
      size="icon"
      type="button"
      variant="secondary"
    >
      <UndoIcon size={14} />
    </Button>
  );
}

export const ChatRetryButton = memo(PureChatRetryButton);
