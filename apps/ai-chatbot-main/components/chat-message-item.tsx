"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Share2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

type ChatMessageItemProps = {
  message: ChatMessage;
  isLoading?: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onReaction?: (messageId: string, reaction: "like" | "dislike") => void;
  onCopy?: (content: string) => void;
  onShare?: (messageId: string) => void;
  className?: string;
};

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const hoverVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

export const ChatMessageItem = memo<ChatMessageItemProps>(
  ({
    message,
    isLoading = false,
    showAvatar = true,
    showTimestamp = true,
    onReaction,
    onCopy,
    onShare,
    className,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);

    const handleReaction = useCallback(
      (type: "like" | "dislike") => {
        setReaction((prev) => (prev === type ? null : type));
        onReaction?.(message.id, type);
      },
      [message.id, onReaction]
    );

    const handleCopy = useCallback(() => {
      const content = message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(" ");
      onCopy?.(content);
    }, [message.parts, onCopy]);

    const handleShare = useCallback(() => {
      onShare?.(message.id);
    }, [message.id, onShare]);

    const isUser = message.role === "user";
    const isAssistant = message.role === "assistant";

    const messageContent = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");

    const createdAt = message.metadata?.createdAt;
    const displayTimestamp = createdAt
      ? new Date(createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <TooltipProvider>
        <motion.div
          animate="visible"
          className={cn(
            "group relative flex w-full gap-3 px-4 py-3 transition-colors hover:bg-muted/30",
            isUser ? "justify-end" : "justify-start",
            className
          )}
          data-message-id={message.id}
          data-message-role={message.role}
          exit="exit"
          initial="hidden"
          layout
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variants={messageVariants}
        >
          {/* Avatar */}
          {showAvatar && isAssistant && (
            <motion.div
              animate={isHovered ? "hover" : "idle"}
              className="flex-shrink-0"
              variants={hoverVariants}
            >
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage alt="Assistant" src="/avatars/assistant.png" />
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </motion.div>
          )}

          {/* Message Bubble */}
          <motion.div
            animate={isHovered ? "hover" : "idle"}
            className={cn(
              "relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
              isUser
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "border border-border bg-background",
              isLoading && "animate-pulse"
            )}
            variants={hoverVariants}
          >
            {/* Message Content */}
            <div className="text-sm leading-relaxed">
              {messageContent || (isLoading ? "..." : "")}
            </div>

            {/* Timestamp */}
            {showTimestamp && displayTimestamp && (
              <div
                className={cn(
                  "mt-2 text-xs opacity-70",
                  isUser ? "text-right" : "text-left"
                )}
              >
                {displayTimestamp}
              </div>
            )}

            {/* Hover Actions */}
            <AnimatePresence>
              {isHovered && !isLoading && (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "absolute top-2 flex gap-1",
                    isUser ? "left-2" : "right-2"
                  )}
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={() => handleReaction("like")}
                        size="sm"
                        variant="ghost"
                      >
                        <ThumbsUp
                          className={cn(
                            "h-3 w-3",
                            reaction === "like"
                              ? "fill-current text-yellow-400"
                              : ""
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Like</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={() => handleReaction("dislike")}
                        size="sm"
                        variant="ghost"
                      >
                        <ThumbsDown
                          className={cn(
                            "h-3 w-3",
                            reaction === "dislike"
                              ? "fill-current text-yellow-400"
                              : ""
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Dislike</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={handleCopy}
                        size="sm"
                        variant="ghost"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={handleShare}
                        size="sm"
                        variant="ghost"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute right-2 bottom-2 flex gap-1"
                initial={{ opacity: 0 }}
              >
                <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
                <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
                <div className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
              </motion.div>
            )}
          </motion.div>

          {/* User Avatar (right side) */}
          {showAvatar && isUser && (
            <motion.div
              animate={isHovered ? "hover" : "idle"}
              className="flex-shrink-0"
              variants={hoverVariants}
            >
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage alt="You" src="/avatars/user.png" />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                  Y
                </AvatarFallback>
              </Avatar>
            </motion.div>
          )}
        </motion.div>
      </TooltipProvider>
    );
  }
);

ChatMessageItem.displayName = "ChatMessageItem";
