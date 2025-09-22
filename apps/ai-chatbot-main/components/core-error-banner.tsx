'use client'

import { memo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CoreErrorBannerProps = {
  error: Error | null
  onDismiss: () => void
  onRetry?: () => void
  className?: string
}

const CoreErrorBanner = memo(
  ({ error, onDismiss, onRetry, className }: CoreErrorBannerProps) => {
    if (!error) {
      return null
    }

    return (
      <Alert
        variant="destructive"
        className={cn('flex items-center justify-between', className)}
      >
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </div>
        <div className="flex items-center space-x-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              Retry
            </Button>
          )}
          <Button onClick={onDismiss} variant="outline" size="sm">
            Dismiss
          </Button>
        </div>
      </Alert>
    )
  }
)

CoreErrorBanner.displayName = 'CoreErrorBanner'

export { CoreErrorBanner }
