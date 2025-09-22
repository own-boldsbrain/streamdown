"use client";

import { memo, useMemo } from "react";
import type { AppUsage } from "@/lib/usage";
import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

export type ChatStreamingProgressProps = {
  usage?: AppUsage;
  isStreaming: boolean;
  className?: string;
};

const HUNDRED = 100;

function PureChatStreamingProgress({
  usage,
  isStreaming,
  className,
}: ChatStreamingProgressProps) {
  const value = useMemo(() => {
    if (!isStreaming) {
      return 0;
    }
    if (!usage) {
      return 0;
    }
    const total = (usage.inputTokens || 0) + (usage.outputTokens || 0);
    const max = Math.max(total, usage.outputTokens ?? 0);
    const pct = Math.min(
      HUNDRED,
      Math.round(((usage.outputTokens || 0) / (max || 1)) * HUNDRED)
    );
    return pct;
  }, [usage, isStreaming]);

  if (!isStreaming) {
    return null;
  }

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <Progress className="h-1" value={value} />
      <span className="text-2xs text-muted-foreground tabular-nums">
        {value}%
      </span>
    </div>
  );
}

export const ChatStreamingProgress = memo(PureChatStreamingProgress);
