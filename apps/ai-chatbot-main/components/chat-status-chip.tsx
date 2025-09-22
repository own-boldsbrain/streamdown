"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  Clock,
  Crown,
  Loader2,
  MessageSquare,
  Pause,
  Play,
  Shield,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ChatStatus =
  | "idle"
  | "typing"
  | "thinking"
  | "generating"
  | "error"
  | "completed"
  | "paused"
  | "waiting"
  | "connected"
  | "disconnected"
  | "premium"
  | "admin";

export type StatusVariant = "default" | "compact" | "minimal" | "animated";

type ChatStatusChipProps = {
  status: ChatStatus;
  variant?: StatusVariant;
  showIcon?: boolean;
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
  onClick?: () => void;
};

const statusConfigs = {
  idle: {
    label: "Ocioso",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: MessageSquare,
    description: "Chat pronto para uso",
  },
  typing: {
    label: "Digitando",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Loader2,
    description: "Usuário está digitando",
    animate: true,
  },
  thinking: {
    label: "Pensando",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Loader2,
    description: "IA está processando",
    animate: true,
  },
  generating: {
    label: "Gerando",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: Zap,
    description: "Gerando resposta",
    animate: true,
  },
  error: {
    label: "Erro",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    description: "Ocorreu um erro",
  },
  completed: {
    label: "Concluído",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    description: "Resposta completa",
  },
  paused: {
    label: "Pausado",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Pause,
    description: "Chat pausado",
  },
  waiting: {
    label: "Aguardando",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: Clock,
    description: "Aguardando resposta",
  },
  connected: {
    label: "Conectado",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    description: "Conectado com sucesso",
  },
  disconnected: {
    label: "Desconectado",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    description: "Conexão perdida",
  },
  premium: {
    label: "Premium",
    color:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300",
    icon: Crown,
    description: "Recurso premium",
  },
  admin: {
    label: "Admin",
    color:
      "bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-300",
    icon: Shield,
    description: "Acesso administrativo",
  },
};

const variantStyles = {
  default: "px-3 py-1 text-sm",
  compact: "px-2 py-0.5 text-xs",
  minimal: "px-1 py-0.5 text-xs",
  animated: "px-3 py-1 text-sm",
};

export const ChatStatusChip = memo<ChatStatusChipProps>(
  ({
    status,
    variant = "default",
    showIcon = true,
    showLabel = true,
    animate = true,
    className,
    onClick,
  }) => {
    const config = statusConfigs[status];
    const Icon = config.icon;

    const renderIcon = () => {
      if (!(showIcon && Icon)) return null;

      const iconElement = <Icon className="h-3 w-3 flex-shrink-0" />;

      if (config.animate && animate) {
        return (
          <motion.div
            animate={
              status === "typing" ||
              status === "thinking" ||
              status === "generating"
                ? { rotate: 360 }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {iconElement}
          </motion.div>
        );
      }

      return iconElement;
    };

    const renderContent = () => {
      const content = (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200",
            config.color,
            variantStyles[variant],
            onClick && "cursor-pointer hover:shadow-md",
            animate && variant === "animated" && "animate-pulse",
            className
          )}
          exit={{ opacity: 0, scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.9 }}
          onClick={onClick}
          whileHover={onClick ? { scale: 1.05 } : {}}
          whileTap={onClick ? { scale: 0.95 } : {}}
        >
          {renderIcon()}
          {showLabel && <span className="truncate">{config.label}</span>}

          {/* Animated dots for loading states */}
          <AnimatePresence>
            {(status === "typing" ||
              status === "thinking" ||
              status === "generating") &&
              animate && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex gap-0.5"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                >
                  <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
                  <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
                  <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
                </motion.div>
              )}
          </AnimatePresence>
        </motion.div>
      );

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent>
              <p>{config.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    };

    return renderContent();
  }
);

ChatStatusChip.displayName = "ChatStatusChip";

// Convenience components for specific statuses
export const TypingIndicator = memo(
  (props: Omit<ChatStatusChipProps, "status">) => (
    <ChatStatusChip {...props} status="typing" />
  )
);

export const ThinkingIndicator = memo(
  (props: Omit<ChatStatusChipProps, "status">) => (
    <ChatStatusChip {...props} status="thinking" />
  )
);

export const GeneratingIndicator = memo(
  (props: Omit<ChatStatusChipProps, "status">) => (
    <ChatStatusChip {...props} status="generating" />
  )
);

export const ErrorIndicator = memo(
  (props: Omit<ChatStatusChipProps, "status">) => (
    <ChatStatusChip {...props} status="error" />
  )
);

export const CompletedIndicator = memo(
  (props: Omit<ChatStatusChipProps, "status">) => (
    <ChatStatusChip {...props} status="completed" />
  )
);

TypingIndicator.displayName = "TypingIndicator";
ThinkingIndicator.displayName = "ThinkingIndicator";
GeneratingIndicator.displayName = "GeneratingIndicator";
ErrorIndicator.displayName = "ErrorIndicator";
CompletedIndicator.displayName = "CompletedIndicator";
