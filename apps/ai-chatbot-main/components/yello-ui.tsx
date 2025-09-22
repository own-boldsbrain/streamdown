import type { HTMLAttributes } from "react";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * YelloButton - Um botão com efeito de vidro e borda em degradê fino
 * seguindo o estilo Yello Solar Hub
 */
export const YelloButton = ({
  className,
  variant = "yello-glass",
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={cn("relative z-0", className)}
      variant={variant}
      {...props}
    />
  );
};

/**
 * YelloCard - Um componente de card com efeito de vidro e borda em degradê fino
 * seguindo o estilo Yello Solar Hub
 */
export const YelloCard = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("yello-card relative z-0 rounded-lg p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * YelloBorder - Um container com borda em degradê fino
 * seguindo o estilo Yello Solar Hub
 */
export const YelloBorder = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("yello-border relative z-0 rounded-md p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};
