'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

type CoreConnectionStatusProps = {
  status: ConnectionStatus
  className?: string
}

const statusConfig = {
  connected: {
    color: 'bg-green-500',
    label: 'Connected'
  },
  connecting: {
    color: 'bg-yellow-500 animate-pulse',
    label: 'Connecting...'
  },
  disconnected: {
    color: 'bg-gray-400',
    label: 'Disconnected'
  },
  error: {
    color: 'bg-red-500',
    label: 'Connection Error'
  }
}

const CoreConnectionStatus = memo(
  ({ status, className }: CoreConnectionStatusProps) => {
    const { color, label } = statusConfig[status]

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn('flex items-center space-x-2', className)}
              aria-live="polite"
              aria-atomic="true"
            >
              <span className={cn('h-3 w-3 rounded-full', color)} />
              <span className="text-muted-foreground text-sm">{label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Real-time connection status to our services.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)

CoreConnectionStatus.displayName = 'CoreConnectionStatus'

export { CoreConnectionStatus }
export type { ConnectionStatus as CoreConnectionStatusType }
