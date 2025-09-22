import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

/**
 * YelloButton - Um botão com efeito de vidro e borda em degradê fino
 * seguindo o estilo Yello Solar Hub
 */
export const YelloButton = ({ 
  className, 
  variant = 'yello-glass',
  ...props 
}: ButtonProps) => {
  return (
    <Button
      className={cn('relative z-0', className)}
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
      className={cn(
        'p-4 relative rounded-lg yello-card z-0',
        className
      )}
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
      className={cn(
        'p-4 relative rounded-md yello-border z-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};