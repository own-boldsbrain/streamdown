"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { memo } from "react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StopIcon } from "./icons";
import { Button } from "./ui/button";

export type ChatStopButtonProps = {
  stop: () => void;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  className?: string;
  onStop?: () => void;
};

function PureChatStopButton({
  stop,
  setMessages,
  className,
  onStop,
}: ChatStopButtonProps) {
  return (
    <Button
      className={cn("size-7 rounded-full p-1", className)}
      data-testid="stop-button"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
        onStop?.();
      }}
      size="icon"
      type="button"
      variant="default"
    >
      <StopIcon size={14} />
    </Button>
  );
}

export const ChatStopButton = memo(PureChatStopButton);
