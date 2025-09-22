import * as React from "react"

import { cn } from "@/lib/utils"
import { yellowGradientStroke } from "./yello-styles/gradients"

function Card({ 
  className, 
  variant, 
  ...props 
}: React.ComponentProps<"div"> & { 
  variant?: "default" | "yello-stroke" | "yello-animated" 
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm",
        variant === "yello-stroke" && yellowGradientStroke,
        variant === "yello-animated" && "relative bg-clip-padding border border-transparent before:absolute before:inset-0 before:rounded-[inherit] before:[background-image:linear-gradient(to_right,#FF6B00,#FF2564,#D500D5,#9A00E9,#FF6B00)] before:animate-gradient-x before:bg-[length:500%_100%] before:-z-10",
        variant !== "yello-stroke" && variant !== "yello-animated" && "border",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
