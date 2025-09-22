"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export type MessageLimitBannerProps = {
  used: number;
  limit: number;
  className?: string;
  onUpgrade?: () => void;
};

const HUNDRED = 100;
const EIGHTY_PERCENT = 0.8;

function PureMessageLimitBanner({
  used,
  limit,
  className,
  onUpgrade,
}: MessageLimitBannerProps) {
  const pct = Math.min(
    HUNDRED,
    Math.round((used / Math.max(limit, 1)) * HUNDRED)
  );
  const isNearLimit = used >= Math.max(1, Math.floor(limit * EIGHTY_PERCENT));

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border p-3",
        isNearLimit &&
          "border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-100",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="truncate font-medium text-sm">
          {isNearLimit
            ? "Você está perto do limite mensal de mensagens"
            : "Uso de mensagens"}
        </div>
        <div className="flex items-center gap-2">
          <Progress className="h-1.5" value={pct} />
          <span className="text-muted-foreground text-xs tabular-nums">
            {used} / {limit}
          </span>
        </div>
      </div>
      <Button
        onClick={onUpgrade}
        size="sm"
        variant={isNearLimit ? "default" : "secondary"}
      >
        Upgrade
      </Button>
    </div>
  );
}

export const MonetizationMessageLimitBanner = memo(PureMessageLimitBanner);
