import * as React from 'react'
import { cn } from '@/lib/utils'

const Kbd = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn(
        'rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
})

Kbd.displayName = 'Kbd'

export { Kbd }
