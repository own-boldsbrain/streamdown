"use client";

import { useEffect, useRef } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";

type AnalyticsTracker = {
  trackConversion: (event: string, properties?: Record<string, unknown>) => void;
  trackRetention: (event: string, properties?: Record<string, unknown>) => void;
  trackMessageSent: () => void;
  trackFeatureUsed: (featureName: string) => void;
};

export type AnalyticsMessageMetricsProps = {
  chatId: string;
  messages: ChatMessage[];
  status: UseChatHelpers<ChatMessage>["status"];
};

export function AnalyticsMessageMetrics({ chatId, messages, status }: AnalyticsMessageMetricsProps) {
  const lastCountRef = useRef<number>(messages.length);
  const lastSentRef = useRef<number | null>(null);

  const tracker = (typeof window !== "undefined" ? (window as unknown as { analyticsTracker?: AnalyticsTracker }).analyticsTracker : undefined);

  // Detect message sent
  useEffect(() => {
    if (messages.length > lastCountRef.current) {
      const last = messages.at(-1);
      if (last?.role === "user") {
        lastSentRef.current = Date.now();
        tracker?.trackMessageSent?.();
      }
      lastCountRef.current = messages.length;
    }
  }, [messages, tracker]);

  // Detect first assistant response after a user message
  useEffect(() => {
    if (status === "streaming" && lastSentRef.current) {
      const firstAssist = messages.find((m) => m.role === "assistant");
      if (firstAssist) {
        const latency = Date.now() - lastSentRef.current;
        tracker?.trackConversion?.("first_response_received", {
          chatId,
          latency,
        });
        lastSentRef.current = null;
      }
    }
  }, [status, messages, chatId, tracker]);

  return null;
}
