"use client";

import { Calendar, Clock } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type TimestampFormat = "relative" | "absolute" | "both";
export type TimePrecision = "minute" | "hour" | "day" | "month";

type ChatTimestampProps = {
  timestamp: Date | string | number;
  format?: TimestampFormat;
  precision?: TimePrecision;
  showIcon?: boolean;
  showTooltip?: boolean;
  timezone?: string;
  className?: string;
  variant?: "default" | "compact" | "badge";
  locale?: string;
};

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;

const UPDATE_INTERVAL_MS = 60 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND; // 1 minute

const TIME_UNITS = {
  minute: SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND,
  hour: MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND,
  day:
    HOURS_PER_DAY *
    MINUTES_PER_HOUR *
    SECONDS_PER_MINUTE *
    MILLISECONDS_PER_SECOND,
  month:
    DAYS_PER_MONTH *
    HOURS_PER_DAY *
    MINUTES_PER_HOUR *
    SECONDS_PER_MINUTE *
    MILLISECONDS_PER_SECOND,
  year:
    DAYS_PER_YEAR *
    HOURS_PER_DAY *
    MINUTES_PER_HOUR *
    SECONDS_PER_MINUTE *
    MILLISECONDS_PER_SECOND,
};

export const ChatTimestamp = memo<ChatTimestampProps>(
  ({
    timestamp,
    format = "relative",
    showIcon = false,
    showTooltip = true,
    timezone,
    className,
    variant = "default",
    locale = "pt-BR",
  }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLive, setIsLive] = useState(false);

    // Update current time every minute for live updates
    useEffect(() => {
      if (format === "relative") {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, UPDATE_INTERVAL_MS);

        setIsLive(true);
        return () => clearInterval(interval);
      }
    }, [format]);

    const parseTimestamp = (ts: Date | string | number): Date => {
      if (ts instanceof Date) {
        return ts;
      }
      if (typeof ts === "string") {
        return new Date(ts);
      }
      return new Date(ts);
    };

    const getTimeDifferenceMs = (date: Date): number => {
      return currentTime.getTime() - date.getTime();
    };

    const formatRelativeTimeString = (date: Date): string => {
      const diff = getTimeDifferenceMs(date);
      const absDiff = Math.abs(diff);

      if (absDiff < TIME_UNITS.minute) {
        return "agora";
      }
      if (absDiff < TIME_UNITS.hour) {
        const minutes = Math.floor(absDiff / TIME_UNITS.minute);
        return `${minutes}min`;
      }
      if (absDiff < TIME_UNITS.day) {
        const hours = Math.floor(absDiff / TIME_UNITS.hour);
        return `${hours}h`;
      }
      if (absDiff < TIME_UNITS.month) {
        const days = Math.floor(absDiff / TIME_UNITS.day);
        return `${days}d`;
      }
      if (absDiff < TIME_UNITS.year) {
        const months = Math.floor(absDiff / TIME_UNITS.month);
        return `${months}M`;
      }
      const years = Math.floor(absDiff / TIME_UNITS.year);
      return `${years}a`;
    };

    const formatAbsoluteTimeString = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      // If it's today, just show time
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString(locale, options);
      }

      // If it's this week, show day and time
      const weekAgo = new Date(
        today.getTime() - DAYS_PER_WEEK * TIME_UNITS.day
      );
      if (date > weekAgo) {
        const dayName = date.toLocaleDateString(locale, { weekday: "short" });
        const time = date.toLocaleTimeString(locale, options);
        return `${dayName} ${time}`;
      }

      // Otherwise show date and time
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      return date.toLocaleDateString(locale, dateOptions);
    };

    const formatWithTimezoneString = (date: Date): string => {
      if (!timezone) {
        return formatAbsoluteTimeString(date);
      }

      try {
        return date.toLocaleString(locale, {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          day: "numeric",
          month: "short",
        });
      } catch {
        // Fallback if timezone is invalid
        return formatAbsoluteTimeString(date);
      }
    };

    const getDisplayText = (date: Date): string => {
      switch (format) {
        case "relative": {
          return formatRelativeTimeString(date);
        }
        case "absolute": {
          return timezone
            ? formatWithTimezoneString(date)
            : formatAbsoluteTimeString(date);
        }
        case "both": {
          const relative = formatRelativeTimeString(date);
          const absolute = timezone
            ? formatWithTimezoneString(date)
            : formatAbsoluteTimeString(date);
          return `${relative} • ${absolute}`;
        }
        default: {
          return formatRelativeTimeString(date);
        }
      }
    };

    const getTooltipText = (date: Date): string => {
      const fullDate = date.toLocaleString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });

      if (timezone) {
        const tzDate = date.toLocaleString(locale, {
          timeZone: timezone,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
        return `${fullDate}\n${timezone}: ${tzDate}`;
      }

      return fullDate;
    };

    const date = parseTimestamp(timestamp);
    const displayText = getDisplayText(date);
    const tooltipText = getTooltipText(date);

    const renderContent = () => {
      const content = (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-muted-foreground text-xs",
            variant === "compact" && "text-[10px]",
            variant === "badge" && "font-medium text-[11px]",
            className
          )}
        >
          {showIcon && <Clock className="h-3 w-3 flex-shrink-0" />}
          {variant === "badge" ? (
            <Badge className="px-1.5 py-0.5 text-xs" variant="secondary">
              {displayText}
            </Badge>
          ) : (
            <span
              className={cn(
                "truncate",
                isLive && format === "relative" && "animate-pulse"
              )}
            >
              {displayText}
            </span>
          )}
        </span>
      );

      if (!showTooltip) {
        return content;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-line">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{tooltipText}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    };

    return renderContent();
  }
);

ChatTimestamp.displayName = "ChatTimestamp";
