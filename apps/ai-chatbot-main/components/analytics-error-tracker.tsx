"use client";

import { memo, useEffect } from "react";

// Define a type for the tracker to avoid using 'any'
type AnalyticsTracker = {
  track: (eventName: string, properties: Record<string, unknown>) => void;
};

// Extend the Window interface to include the optional analyticsTracker
interface CustomWindow extends Window {
  analyticsTracker?: AnalyticsTracker;
}

const AnalyticsErrorTracker = memo(() => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorData = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error ? event.error.stack : "No stack available",
      };

      // Use the custom window type for type-safe access
      const customWindow = window as CustomWindow;
      if (customWindow.analyticsTracker) {
        customWindow.analyticsTracker.track("frontend_error", errorData);
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null; // This component does not render anything
});

AnalyticsErrorTracker.displayName = "AnalyticsErrorTracker";

export { AnalyticsErrorTracker };
