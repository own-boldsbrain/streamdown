import * as React from "react"

import { cn } from "@/lib/utils"
import { yellowGradientStroke } from "./yello-styles/gradients"

function Input({ 
  className, 
  type, 
  variant,
  ...props 
}: React.ComponentProps<"input"> & {
  variant?: "default" | "yello-stroke" | "yello-animated"
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        variant === "yello-stroke" && yellowGradientStroke,
        variant === "yello-animated" && "relative bg-clip-padding border border-transparent before:absolute before:inset-0 before:rounded-[inherit] before:[background-image:linear-gradient(to_right,#FF6B00,#FF2564,#D500D5,#9A00E9,#FF6B00)] before:animate-gradient-x before:bg-[length:500%_100%] before:-z-10",
        variant !== "yello-stroke" && variant !== "yello-animated" && "border border-input",
        className
      )}
      {...props}
    />
  )
}

export { Input }
