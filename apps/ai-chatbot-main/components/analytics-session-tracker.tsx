"use client";

import { track } from "@vercel/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";

// Constantes para geração de ID de sessão
const SESSION_ID_LENGTH = 9;

// Tipos de eventos de conversão
type ConversionEvent =
  | "chat_started"
  | "message_sent"
  | "first_response_received"
  | "artifact_created"
  | "upgrade_initiated"
  | "payment_completed"
  | "feature_used";

// Tipos de eventos de retenção
type RetentionEvent =
  | "session_started"
  | "session_ended"
  | "daily_active"
  | "weekly_active"
  | "monthly_active"
  | "feature_discovery"
  | "onboarding_completed";

type AnalyticsEvent = ConversionEvent | RetentionEvent;

type EventProperties = Record<string, string | number | boolean>;

type SessionData = {
  sessionId: string;
  startTime: number;
  pageViews: number;
  messagesSent: number;
  featuresUsed: string[];
  lastActivity: number;
};

type AnalyticsTrackerMethods = {
  trackConversion: (
    event: ConversionEvent,
    properties?: EventProperties
  ) => void;
  trackRetention: (event: RetentionEvent, properties?: EventProperties) => void;
  trackMessageSent: () => void;
  trackFeatureUsed: (featureName: string) => void;
};

export function AnalyticsSessionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Gerar ID único da sessão
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, SESSION_ID_LENGTH)}`;
  }, []);

  // Obter ID da sessão atual
  const getCurrentSessionId = useCallback(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const sessionData = localStorage.getItem("analytics_session");
    if (!sessionData) {
      const newSession: SessionData = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        pageViews: 0,
        messagesSent: 0,
        featuresUsed: [],
        lastActivity: Date.now(),
      };
      localStorage.setItem("analytics_session", JSON.stringify(newSession));
      return newSession.sessionId;
    }

    const parsed: SessionData = JSON.parse(sessionData);
    return parsed.sessionId;
  }, [generateSessionId]);

  // Rastrear evento personalizado
  const trackEvent = useCallback(
    (event: AnalyticsEvent, properties: EventProperties = {}) => {
      const eventData = {
        event,
        timestamp: Date.now(),
        userId: session?.user?.id || "anonymous",
        sessionId: getCurrentSessionId(),
        pathname,
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "",
        ...properties,
      };

      track(event, eventData);
    },
    [pathname, session?.user?.id, getCurrentSessionId]
  );

  // Atualizar dados da sessão
  const updateSessionData = useCallback((updates: Partial<SessionData>) => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionData = localStorage.getItem("analytics_session");
    if (sessionData) {
      const parsed: SessionData = JSON.parse(sessionData);
      const updated = { ...parsed, ...updates, lastActivity: Date.now() };
      localStorage.setItem("analytics_session", JSON.stringify(updated));
    }
  }, []);

  // Rastrear início da sessão
  useEffect(() => {
    const sessionId = getCurrentSessionId();
    trackEvent("session_started", {
      sessionId,
      referrer: typeof window !== "undefined" ? document.referrer : "",
      utmSource: searchParams.get("utm_source") || "",
      utmMedium: searchParams.get("utm_medium") || "",
      utmCampaign: searchParams.get("utm_campaign") || "",
    });

    updateSessionData({ pageViews: 1 });
  }, [getCurrentSessionId, trackEvent, updateSessionData, searchParams]);

  // Rastrear mudança de página
  useEffect(() => {
    updateSessionData({ pageViews: 1 });
  }, [updateSessionData]);

  // Rastrear atividade diária/semanal/mensal
  useEffect(() => {
    const checkActivity = () => {
      const now = new Date();
      const today = now.toDateString();
      const weekStart = new Date(
        now.setDate(now.getDate() - now.getDay())
      ).toDateString();
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toDateString();

      const lastDailyCheck = localStorage.getItem("last_daily_check");
      const lastWeeklyCheck = localStorage.getItem("last_weekly_check");
      const lastMonthlyCheck = localStorage.getItem("last_monthly_check");

      if (lastDailyCheck !== today) {
        trackEvent("daily_active");
        localStorage.setItem("last_daily_check", today);
      }

      if (lastWeeklyCheck !== weekStart) {
        trackEvent("weekly_active");
        localStorage.setItem("last_weekly_check", weekStart);
      }

      if (lastMonthlyCheck !== monthStart) {
        trackEvent("monthly_active");
        localStorage.setItem("last_monthly_check", monthStart);
      }
    };

    checkActivity();
  }, [trackEvent]);

  // Rastrear fim da sessão (antes de fechar a página)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionData = localStorage.getItem("analytics_session");
      if (sessionData) {
        const parsed: SessionData = JSON.parse(sessionData);
        const sessionDuration = Date.now() - parsed.startTime;

        trackEvent("session_ended", {
          sessionId: parsed.sessionId,
          duration: sessionDuration,
          pageViews: parsed.pageViews,
          messagesSent: parsed.messagesSent,
          featuresUsed: parsed.featuresUsed.join(","),
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateSessionData({ lastActivity: Date.now() });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [trackEvent, updateSessionData]);

  // Métodos públicos para rastreamento manual
  useEffect(() => {
    // Expor métodos globais para uso em outros componentes
    if (typeof window !== "undefined") {
      (
        window as Window &
          typeof globalThis & { analyticsTracker: AnalyticsTrackerMethods }
      ).analyticsTracker = {
        trackConversion: (
          event: ConversionEvent,
          properties?: EventProperties
        ) => {
          trackEvent(event, properties);
        },
        trackRetention: (
          event: RetentionEvent,
          properties?: EventProperties
        ) => {
          trackEvent(event, properties);
        },
        trackMessageSent: () => {
          updateSessionData({ messagesSent: 1 });
          trackEvent("message_sent");
        },
        trackFeatureUsed: (featureName: string) => {
          const sessionData = localStorage.getItem("analytics_session");
          if (sessionData) {
            const parsed: SessionData = JSON.parse(sessionData);
            if (!parsed.featuresUsed.includes(featureName)) {
              updateSessionData({
                featuresUsed: [...parsed.featuresUsed, featureName],
              });
              trackEvent("feature_used", { feature: featureName });
            }
          }
        },
      };
    }
  }, [trackEvent, updateSessionData]);

  return null; // Componente invisível
}
