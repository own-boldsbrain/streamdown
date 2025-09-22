"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Crown,
  Shield,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AvatarType = "user" | "assistant" | "system" | "premium" | "admin";
export type StatusType = "online" | "away" | "busy" | "offline" | "typing";

type ChatAvatarProps = {
  type: AvatarType;
  status?: StatusType;
  name?: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
};

const avatarConfigs = {
  user: {
    fallback: User,
    colors: "bg-gradient-to-br from-green-400 to-blue-500",
    icon: User,
  },
  assistant: {
    fallback: Sparkles,
    colors: "bg-gradient-to-br from-yellow-400 to-orange-500",
    icon: Sparkles,
  },
  system: {
    fallback: Shield,
    colors: "bg-gradient-to-br from-gray-400 to-gray-600",
    icon: Shield,
  },
  premium: {
    fallback: Crown,
    colors: "bg-gradient-to-br from-purple-400 to-pink-500",
    icon: Crown,
  },
  admin: {
    fallback: Zap,
    colors: "bg-gradient-to-br from-red-400 to-red-600",
    icon: Zap,
  },
};

const statusConfigs = {
  online: {
    color: "bg-green-500",
    icon: CheckCircle,
    label: "Online",
  },
  away: {
    color: "bg-yellow-500",
    icon: Clock,
    label: "Away",
  },
  busy: {
    color: "bg-red-500",
    icon: AlertCircle,
    label: "Busy",
  },
  offline: {
    color: "bg-gray-400",
    icon: CheckCircle,
    label: "Offline",
  },
  typing: {
    color: "bg-blue-500",
    icon: null,
    label: "Typing...",
  },
};

const sizeConfigs = {
  sm: { avatar: "h-6 w-6", status: "h-2 w-2", badge: "h-3 w-3" },
  md: { avatar: "h-8 w-8", status: "h-3 w-3", badge: "h-4 w-4" },
  lg: { avatar: "h-10 w-10", status: "h-3 w-3", badge: "h-5 w-5" },
  xl: { avatar: "h-12 w-12", status: "h-4 w-4", badge: "h-6 w-6" },
};

export const ChatAvatar = memo<ChatAvatarProps>(
  ({
    type,
    status = "offline",
    name,
    imageUrl,
    size = "md",
    showStatus = true,
    showBadge = false,
    className,
    onClick,
  }) => {
    const [imageError, setImageError] = useState(false);
    const config = avatarConfigs[type];
    const statusConfig = statusConfigs[status];
    const sizeConfig = sizeConfigs[size];

    const handleImageError = () => {
      setImageError(true);
    };

    const getDisplayInitials = (displayName?: string) => {
      if (!displayName) {
        return type === "user" ? "Y" : "A";
      }
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const renderTypingIndicator = () => (
      <AnimatePresence>
        {status === "typing" && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="-bottom-1 -right-1 absolute flex gap-0.5"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
          >
            <div className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:0ms]" />
            <div className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]" />
            <div className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]" />
          </motion.div>
        )}
      </AnimatePresence>
    );

    return (
      <TooltipProvider>
        <div className={cn("relative inline-block", className)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-full ring-2 ring-background transition-shadow hover:ring-4 hover:ring-muted",
                  onClick && "cursor-pointer"
                )}
                onClick={onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar className={cn(sizeConfig.avatar, "ring-0")}>
                  {!imageError && imageUrl ? (
                    <AvatarImage
                      alt={name || `${type} avatar`}
                      onError={handleImageError}
                      src={imageUrl}
                    />
                  ) : null}
                  <AvatarFallback className={cn(config.colors, "text-white")}>
                    {config.icon && <config.icon className="h-4 w-4" />}
                    {!config.icon && getDisplayInitials(name)}
                  </AvatarFallback>
                </Avatar>

                {/* Status Indicator */}
                {showStatus && status !== "typing" && (
                  <motion.div
                    animate={{ scale: 1 }}
                    className={cn(
                      "-bottom-0.5 -right-0.5 absolute rounded-full border-2 border-background",
                      sizeConfig.status,
                      statusConfig.color
                    )}
                    initial={{ scale: 0 }}
                  />
                )}

                {/* Typing Indicator */}
                {renderTypingIndicator()}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <span>
                  {name || type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                {showStatus && (
                  <Badge className="text-xs" variant="secondary">
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Premium/Admin Badge */}
          {showBadge && (type === "premium" || type === "admin") && (
            <motion.div
              animate={{ scale: 1, rotate: 0 }}
              className="-right-1 -top-1 absolute"
              initial={{ scale: 0, rotate: -180 }}
            >
              <Badge
                className={cn(
                  "flex items-center justify-center rounded-full border-2 border-background p-0",
                  sizeConfig.badge,
                  type === "premium"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                )}
              >
                {type === "premium" ? (
                  <Crown className="h-2 w-2" />
                ) : (
                  <Zap className="h-2 w-2" />
                )}
              </Badge>
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    );
  }
);

ChatAvatar.displayName = "ChatAvatar";
