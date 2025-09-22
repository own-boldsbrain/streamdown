"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { memo } from "react";
import { cn } from "../utils";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  LifeBuoy, 
  Lightbulb, 
  XCircle,
} from "lucide-react";

// Tipos de callouts disponíveis
type CalloutType = 
  | "info" 
  | "warning" 
  | "error" 
  | "success" 
  | "tip" 
  | "note" 
  | "help" 
  | "important";

// Propriedades do componente
interface VizCalloutProps extends HTMLAttributes<HTMLDivElement> {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  icon?: boolean;
}

// Configurações para cada tipo de callout
const calloutConfig = {
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800/60 dark:text-blue-300",
    titleClassName: "text-blue-800 dark:text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/60 dark:text-amber-300",
    titleClassName: "text-amber-800 dark:text-amber-300",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800/60 dark:text-red-300",
    titleClassName: "text-red-800 dark:text-red-300",
  },
  success: {
    icon: CheckCircle2,
    className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800/60 dark:text-green-300",
    titleClassName: "text-green-800 dark:text-green-300",
  },
  tip: {
    icon: Lightbulb,
    className: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/20 dark:border-purple-800/60 dark:text-purple-300",
    titleClassName: "text-purple-800 dark:text-purple-300",
  },
  note: {
    icon: AlertCircle,
    className: "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-300",
    titleClassName: "text-gray-800 dark:text-gray-300",
  },
  help: {
    icon: HelpCircle,
    className: "bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-800/60 dark:text-indigo-300",
    titleClassName: "text-indigo-800 dark:text-indigo-300",
  },
  important: {
    icon: LifeBuoy,
    className: "bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-950/20 dark:border-pink-800/60 dark:text-pink-300",
    titleClassName: "text-pink-800 dark:text-pink-300",
  },
};

// Componente VizCallout
const VizCallout = memo(
  ({
    type = "note",
    title,
    children,
    icon = true,
    className,
    ...props
  }: VizCalloutProps) => {
    const config = calloutConfig[type];
    const IconComponent = config.icon;

    return (
      <div
        className={cn(
          "my-4 rounded-md border p-4",
          config.className,
          className
        )}
        data-callout-type={type}
        data-testid="viz-callout"
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 pt-1">
              <IconComponent className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            {title && (
              <h3 className={cn("font-medium", config.titleClassName)}>
                {title}
              </h3>
            )}
            <div className="prose-p:leading-normal prose-p:my-1 prose-sm prose-ul:my-1 prose-ul:pl-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VizCallout.displayName = "VizCallout";

export default VizCallout;