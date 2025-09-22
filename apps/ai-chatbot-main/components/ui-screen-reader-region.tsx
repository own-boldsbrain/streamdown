"use client";

import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ScreenReaderRegionProps = {
  className?: string;
  announcement: string;
  "aria-live"?: "polite" | "assertive" | "off";
};

const ANNOUNCEMENT_DELAY_MS = 1000;

const ScreenReaderRegion = memo(
  ({
    className,
    announcement,
    "aria-live": ariaLive = "polite",
  }: ScreenReaderRegionProps) => {
    const [currentAnnouncement, setCurrentAnnouncement] = useState("");

    // This effect ensures that the announcement is only present for a short time,
    // preventing it from being re-read on subsequent renders if the parent component updates.
    // It also handles rapid-fire announcements by clearing previous timeouts.
    useEffect(() => {
      if (announcement) {
        // Set the new announcement
        setCurrentAnnouncement(announcement);

        // Clear the announcement after a delay to ensure it's read by screen readers.
        const timer = setTimeout(() => {
          setCurrentAnnouncement("");
        }, ANNOUNCEMENT_DELAY_MS); // 1 second should be enough for most screen readers to pick it up.

        return () => clearTimeout(timer);
      }
    }, [announcement]);

    return (
      <div
        aria-atomic="true"
        aria-live={ariaLive}
        className={cn("sr-only", className)}
        data-testid="screen-reader-region"
      >
        {currentAnnouncement}
      </div>
    );
  }
);

ScreenReaderRegion.displayName = "ScreenReaderRegion";

export { ScreenReaderRegion };
