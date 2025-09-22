"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChatStatusChip } from "./chat-status-chip";

export type TypingIndicatorVariant =
  | "dots"
  | "pulse"
  | "wave"
  | "bounce"
  | "minimal";

export type TypingMessage = {
  text: string;
  duration?: number;
};

type ChatTypingIndicatorProps = {
  variant?: TypingIndicatorVariant;
  messages?: TypingMessage[];
  cycleMessages?: boolean;
  showAvatar?: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
  className?: string;
  dotColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  position?: "left" | "right" | "center";
};

const DEFAULT_MESSAGES: TypingMessage[] = [
  { text: "Digitando...", duration: 2000 },
  { text: "Pensando em uma resposta...", duration: 2500 },
  { text: "Quase lá...", duration: 1500 },
];

// Animation constants
const DOTS_SCALE_MULTIPLIER = 1.2;
const DOTS_OPACITY_LOW = 0.4;
const DOTS_OPACITY_HIGH = 1;
const DOTS_DELAY_MULTIPLIER = 0.2;
const DOTS_DURATION = 1.5;

const PULSE_SCALE_MULTIPLIER = 1.3;
const PULSE_OPACITY_LOW = 0.6;
const PULSE_OPACITY_HIGH = 1;
const PULSE_DURATION = 1.5;

const WAVE_Y_OFFSET = -8;
const WAVE_OPACITY_LOW = 0.3;
const WAVE_OPACITY_HIGH = 1;
const WAVE_DELAY_MULTIPLIER = 0.1;
const WAVE_DURATION = 1.2;

const BOUNCE_Y_OFFSET = -12;
const BOUNCE_SCALE_MULTIPLIER = 1.1;
const BOUNCE_DELAY_MULTIPLIER = 0.15;
const BOUNCE_DURATION = 0.8;

const MINIMAL_SCALE_LOW = 0.3;
const MINIMAL_SCALE_HIGH = 1;
const MINIMAL_OPACITY_LOW = 0.5;
const MINIMAL_OPACITY_HIGH = 1;
const MINIMAL_DURATION = 1.5;

const DEFAULT_MESSAGE_DURATION = 2000;
const _ANIMATION_DURATION = 0.3;
const _SLIDE_OFFSET = 10;

const variantComponents = {
  dots: ({ dotColor, size }: { dotColor?: string; size: string }) => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          animate={{
            scale: [1, DOTS_SCALE_MULTIPLIER, 1],
            opacity: [DOTS_OPACITY_LOW, DOTS_OPACITY_HIGH, DOTS_OPACITY_LOW],
          }}
          className={cn(
            "rounded-full bg-current",
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-2 w-2",
            size === "lg" && "h-3 w-3"
          )}
          key={i}
          style={{ color: dotColor }}
          transition={{
            duration: DOTS_DURATION,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * DOTS_DELAY_MULTIPLIER,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  ),

  pulse: ({ dotColor, size }: { dotColor?: string; size: string }) => (
    <motion.div
      animate={{
        scale: [1, PULSE_SCALE_MULTIPLIER, 1],
        opacity: [PULSE_OPACITY_LOW, PULSE_OPACITY_HIGH, PULSE_OPACITY_LOW],
      }}
      className={cn(
        "rounded-full bg-current",
        size === "sm" && "h-3 w-3",
        size === "md" && "h-4 w-4",
        size === "lg" && "h-5 w-5"
      )}
      style={{ color: dotColor }}
      transition={{
        duration: PULSE_DURATION,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  ),

  wave: ({ dotColor, size }: { dotColor?: string; size: string }) => (
    <div className="flex items-center gap-0.5">
      {["wave-1", "wave-2", "wave-3", "wave-4", "wave-5"].map((waveId, i) => (
        <motion.div
          animate={{
            y: [0, WAVE_Y_OFFSET, 0],
            opacity: [WAVE_OPACITY_LOW, WAVE_OPACITY_HIGH, WAVE_OPACITY_LOW],
          }}
          className={cn(
            "rounded-full bg-current",
            size === "sm" && "h-1 w-1",
            size === "md" && "h-1.5 w-1.5",
            size === "lg" && "h-2 w-2"
          )}
          key={waveId}
          style={{ color: dotColor }}
          transition={{
            duration: WAVE_DURATION,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * WAVE_DELAY_MULTIPLIER,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  ),

  bounce: ({ dotColor, size }: { dotColor?: string; size: string }) => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          animate={{
            y: [0, BOUNCE_Y_OFFSET, 0],
            scale: [1, BOUNCE_SCALE_MULTIPLIER, 1],
          }}
          className={cn(
            "rounded-full bg-current",
            size === "sm" && "h-2 w-2",
            size === "md" && "h-2.5 w-2.5",
            size === "lg" && "h-3 w-3"
          )}
          key={i}
          style={{ color: dotColor }}
          transition={{
            duration: BOUNCE_DURATION,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * BOUNCE_DELAY_MULTIPLIER,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  ),

  minimal: ({ dotColor, size }: { dotColor?: string; size: string }) => (
    <motion.div
      animate={{
        scaleX: [MINIMAL_SCALE_LOW, MINIMAL_SCALE_HIGH, MINIMAL_SCALE_LOW],
        opacity: [
          MINIMAL_OPACITY_LOW,
          MINIMAL_OPACITY_HIGH,
          MINIMAL_OPACITY_LOW,
        ],
      }}
      className={cn(
        "h-0.5 rounded-full bg-current",
        size === "sm" && "w-6",
        size === "md" && "w-8",
        size === "lg" && "w-10"
      )}
      style={{ color: dotColor, originX: 0.5 }}
      transition={{
        duration: MINIMAL_DURATION,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  ),
};

export const ChatTypingIndicator = memo<ChatTypingIndicatorProps>(
  ({
    variant = "dots",
    messages = DEFAULT_MESSAGES,
    cycleMessages = true,
    showAvatar = false,
    avatarSrc,
    avatarFallback = "AI",
    className,
    dotColor = "rgb(59 130 246)", // blue-500
    textColor = "rgb(107 114 128)", // gray-500
    size = "md",
    position = "left",
  }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isVisible, _setIsVisible] = useState(true);

    const currentMessage = messages[currentMessageIndex];

    useEffect(() => {
      if (!cycleMessages || messages.length <= 1) {
        return;
      }

      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, currentMessage?.duration || DEFAULT_MESSAGE_DURATION);

      return () => clearInterval(interval);
    }, [messages, cycleMessages, currentMessage?.duration]);

    const VariantComponent = variantComponents[variant];

    const positionClasses = {
      left: "justify-start",
      right: "justify-end",
      center: "justify-center",
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-3 px-4 py-2",
              positionClasses[position],
              className
            )}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {showAvatar && position === "left" && (
              <div className="flex-shrink-0">
                <ChatStatusChip
                  className="p-0"
                  showIcon={false}
                  showLabel={false}
                  status="typing"
                  variant="minimal"
                />
              </div>
            )}

            <motion.div
              animate={{ scale: 1 }}
              className={cn(
                "flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 shadow-sm",
                position === "right" && "flex-row-reverse"
              )}
              initial={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <VariantComponent dotColor={dotColor} size={size} />

              <AnimatePresence mode="wait">
                <motion.span
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "font-medium text-sm",
                    size === "sm" && "text-xs",
                    size === "lg" && "text-base"
                  )}
                  exit={{ opacity: 0, x: -10 }}
                  initial={{ opacity: 0, x: 10 }}
                  key={currentMessageIndex}
                  style={{ color: textColor }}
                  transition={{ duration: 0.3 }}
                >
                  {currentMessage?.text || "Digitando..."}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {showAvatar && position === "right" && (
              <div className="flex-shrink-0">
                <ChatStatusChip
                  className="p-0"
                  showIcon={false}
                  showLabel={false}
                  status="typing"
                  variant="minimal"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

ChatTypingIndicator.displayName = "ChatTypingIndicator";

// Convenience components for specific variants
export const DotsTypingIndicator = memo(
  (props: Omit<ChatTypingIndicatorProps, "variant">) => (
    <ChatTypingIndicator {...props} variant="dots" />
  )
);

export const PulseTypingIndicator = memo(
  (props: Omit<ChatTypingIndicatorProps, "variant">) => (
    <ChatTypingIndicator {...props} variant="pulse" />
  )
);

export const WaveTypingIndicator = memo(
  (props: Omit<ChatTypingIndicatorProps, "variant">) => (
    <ChatTypingIndicator {...props} variant="wave" />
  )
);

export const BounceTypingIndicator = memo(
  (props: Omit<ChatTypingIndicatorProps, "variant">) => (
    <ChatTypingIndicator {...props} variant="bounce" />
  )
);

export const MinimalTypingIndicator = memo(
  (props: Omit<ChatTypingIndicatorProps, "variant">) => (
    <ChatTypingIndicator {...props} variant="minimal" />
  )
);

DotsTypingIndicator.displayName = "DotsTypingIndicator";
PulseTypingIndicator.displayName = "PulseTypingIndicator";
WaveTypingIndicator.displayName = "WaveTypingIndicator";
BounceTypingIndicator.displayName = "BounceTypingIndicator";
MinimalTypingIndicator.displayName = "MinimalTypingIndicator";
