"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Flag,
  Heart,
  MessageSquare,
  MoreHorizontal,
  RotateCcw,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React, { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type MessageAction =
  | "copy"
  | "share"
  | "regenerate"
  | "like"
  | "dislike"
  | "flag"
  | "react"
  | "reply";

export type ActionVariant = "default" | "compact" | "minimal" | "floating";

export type ActionPosition = "inline" | "hover" | "bottom" | "top";

type ChatMessageActionsProps = {
  actions?: MessageAction[];
  variant?: ActionVariant;
  position?: ActionPosition;
  showLabels?: boolean;
  animate?: boolean;
  disabled?: boolean;
  className?: string;
  onAction?: (action: MessageAction) => void;
  onCopy?: () => void;
  onShare?: (url?: string) => void;
  onRegenerate?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onFlag?: () => void;
  onReact?: (reaction: string) => void;
  onReply?: () => void;
};

type ActionConfig = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  shortcut?: string;
};

const COPY_SUCCESS_DURATION = 2000;
const MAX_VISIBLE_ACTIONS = 3;

const actionConfigs: Record<MessageAction, ActionConfig> = {
  copy: {
    icon: Copy,
    label: "Copiar",
    color: "hover:bg-blue-50 hover:text-blue-600",
    shortcut: "Ctrl+C",
  },
  share: {
    icon: Share2,
    label: "Compartilhar",
    color: "hover:bg-green-50 hover:text-green-600",
    shortcut: "Ctrl+S",
  },
  regenerate: {
    icon: RotateCcw,
    label: "Regenerar",
    color: "hover:bg-purple-50 hover:text-purple-600",
    shortcut: "Ctrl+R",
  },
  like: {
    icon: ThumbsUp,
    label: "Curtir",
    color: "hover:bg-green-50 hover:text-green-600",
  },
  dislike: {
    icon: ThumbsDown,
    label: "Não curtir",
    color: "hover:bg-red-50 hover:text-red-600",
  },
  flag: {
    icon: Flag,
    label: "Denunciar",
    color: "hover:bg-orange-50 hover:text-orange-600",
  },
  react: {
    icon: Heart,
    label: "Reagir",
    color: "hover:bg-pink-50 hover:text-pink-600",
  },
  reply: {
    icon: MessageSquare,
    label: "Responder",
    color: "hover:bg-indigo-50 hover:text-indigo-600",
  },
};

const reactions = ["❤️", "👍", "👎", "😂", "😮", "😢", "😡", "🎉"];

export const ChatMessageActions = memo<ChatMessageActionsProps>(
  ({
    actions = ["copy", "share", "regenerate", "like", "dislike"],
    variant = "default",
    position = "inline",
    showLabels = false,
    animate = true,
    disabled = false,
    className,
    onAction,
    onCopy,
    onShare,
    onRegenerate,
    onLike,
    onDislike,
    onFlag,
    onReact,
    onReply,
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<string | null>(
      null
    );

    const handleAction = (action: MessageAction) => {
      if (disabled) {
        return;
      }

      onAction?.(action);

      switch (action) {
        case "copy":
          onCopy?.();
          setCopied(true);
          setTimeout(() => setCopied(false), COPY_SUCCESS_DURATION);
          break;
        case "share":
          onShare?.();
          break;
        case "regenerate":
          onRegenerate?.();
          break;
        case "like":
          onLike?.();
          break;
        case "dislike":
          onDislike?.();
          break;
        case "flag":
          onFlag?.();
          break;
        case "react":
          setShowReactions(!showReactions);
          break;
        case "reply":
          onReply?.();
          break;
        default:
          break;
      }
    };

    const handleReaction = (reaction: string) => {
      setSelectedReaction(reaction);
      onReact?.(reaction);
      setShowReactions(false);
    };

    const getButtonSize = () => {
      return variant === "compact" || variant === "minimal" ? "sm" : "default";
    };

    const getIconSize = () => {
      if (variant === "compact" || variant === "minimal") {
        return "h-3 w-3";
      }
      return "h-4 w-4";
    };

    const renderActionButton = (action: MessageAction) => {
      const config = actionConfigs[action];
      const Icon = config.icon;
      const buttonSize = getButtonSize();
      const iconSize = getIconSize();

      const buttonContent = (
        <motion.div
          className="relative"
          whileHover={animate ? { scale: 1.05 } : {}}
          whileTap={animate ? { scale: 0.95 } : {}}
        >
          <Button
            className={cn(
              "h-auto p-2 transition-all duration-200",
              config.color,
              disabled && "cursor-not-allowed opacity-50",
              variant === "floating" &&
                "border bg-background/95 shadow-lg backdrop-blur-sm",
              className
            )}
            disabled={disabled}
            onClick={() => handleAction(action)}
            size={buttonSize}
            variant="ghost"
          >
            {action === "copy" && copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Icon className={cn(iconSize)} />
            )}
            {showLabels && <span className="ml-1 text-xs">{config.label}</span>}
          </Button>

          {/* Success indicator for copy */}
          <AnimatePresence>
            {action === "copy" && copied && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="-top-8 -translate-x-1/2 absolute left-1/2 transform"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
              >
                <div className="whitespace-nowrap rounded bg-green-600 px-2 py-1 text-white text-xs shadow-lg">
                  Copiado!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );

      return (
        <TooltipProvider key={action}>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <div>{config.label}</div>
                {config.shortcut && (
                  <div className="mt-1 text-muted-foreground text-xs">
                    {config.shortcut}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    };

    const renderReactions = () => (
      <AnimatePresence>
        {showReactions && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-full left-0 z-10 mb-2 flex gap-1 rounded-lg border bg-background p-2 shadow-lg"
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            {reactions.map((reaction) => (
              <motion.button
                className={cn(
                  "rounded p-1 text-lg transition-colors hover:bg-muted",
                  selectedReaction === reaction && "bg-primary/10"
                )}
                key={reaction}
                onClick={() => handleReaction(reaction)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {reaction}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    );

    const containerClasses = {
      inline: "flex items-center gap-1",
      hover:
        "absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
      bottom: "flex items-center justify-center gap-2 mt-2 pt-2 border-t",
      top: "flex items-center justify-center gap-2 mb-2 pb-2 border-b",
    };

    const visibleActions =
      variant === "compact" && actions.length > MAX_VISIBLE_ACTIONS
        ? actions.slice(0, 2)
        : actions;

    const hiddenActions =
      variant === "compact" && actions.length > MAX_VISIBLE_ACTIONS
        ? actions.slice(2)
        : [];

    return (
      <div className={cn("relative", position === "hover" && "group")}>
        <motion.div
          animate={animate ? { opacity: 1 } : {}}
          className={cn(containerClasses[position])}
          initial={animate ? { opacity: 0 } : {}}
          transition={{ duration: 0.2 }}
        >
          {/* Visible actions */}
          {visibleActions.map(renderActionButton)}

          {/* More button for compact variant */}
          {hiddenActions.length > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="h-auto p-2 hover:bg-muted"
                onClick={() => setIsExpanded(!isExpanded)}
                size="sm"
                variant="ghost"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </motion.div>
          )}

          {/* Expanded actions */}
          <AnimatePresence>
            {isExpanded && hiddenActions.length > 0 && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full right-0 z-10 mt-1 flex min-w-[120px] flex-col gap-1 rounded-lg border bg-background p-2 shadow-lg"
                exit={{ opacity: 0, scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.9 }}
              >
                {hiddenActions.map((action) => (
                  <Button
                    className={cn(
                      "h-auto justify-start px-3 py-2",
                      actionConfigs[action].color
                    )}
                    key={action}
                    onClick={() => {
                      handleAction(action);
                      setIsExpanded(false);
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    {React.createElement(actionConfigs[action].icon, {
                      className: "h-4 w-4 mr-2",
                    })}
                    {actionConfigs[action].label}
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Reactions popup */}
        {renderReactions()}
      </div>
    );
  }
);

ChatMessageActions.displayName = "ChatMessageActions";

// Convenience components for specific action sets
export const BasicMessageActions = memo(
  (props: Omit<ChatMessageActionsProps, "actions">) => (
    <ChatMessageActions {...props} actions={["copy", "share"]} />
  )
);

export const FullMessageActions = memo(
  (props: Omit<ChatMessageActionsProps, "actions">) => (
    <ChatMessageActions
      {...props}
      actions={["copy", "share", "regenerate", "like", "dislike", "flag"]}
    />
  )
);

export const SocialMessageActions = memo(
  (props: Omit<ChatMessageActionsProps, "actions">) => (
    <ChatMessageActions
      {...props}
      actions={["like", "dislike", "react", "reply"]}
    />
  )
);

BasicMessageActions.displayName = "BasicMessageActions";
FullMessageActions.displayName = "FullMessageActions";
SocialMessageActions.displayName = "SocialMessageActions";
