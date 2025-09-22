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
};

function PureChatStopButton({
  stop,
  setMessages,
  className,
}: ChatStopButtonProps) {
  return (
    <Button
      className={cn(
        "size-7 rounded-full bg-foreground p-1 text-background transition-colors duration-200 hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground",
        className
      )}
      data-testid="stop-button"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
      type="button"
    >
      <StopIcon size={14} />
    </Button>
  );
}

export const ChatStopButton = memo(PureChatStopButton);
