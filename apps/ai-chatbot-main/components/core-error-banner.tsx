"use client";

import { AlertCircle } from "lucide-react";
import { memo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CoreErrorBannerProps = {
  error: Error | null;
  onDismiss: () => void;
  onRetry?: () => void;
  className?: string;
};

const CoreErrorBanner = memo(
  ({ error, onDismiss, onRetry, className }: CoreErrorBannerProps) => {
    if (!error) {
      return null;
    }

    return (
      <Alert
        className={cn("flex items-center justify-between", className)}
        variant="destructive"
      >
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </div>
        <div className="flex items-center space-x-2">
          {onRetry && (
            <Button onClick={onRetry} size="sm" variant="outline">
              Retry
            </Button>
          )}
          <Button onClick={onDismiss} size="sm" variant="outline">
            Dismiss
          </Button>
        </div>
      </Alert>
    );
  }
);

CoreErrorBanner.displayName = "CoreErrorBanner";

export { CoreErrorBanner };
