"use client";

import { LifeBuoy } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type MonetizationPremiumSupportProps = {
  isPremium: boolean;
  className?: string;
};

const MonetizationPremiumSupport = memo(
  ({ isPremium, className }: MonetizationPremiumSupportProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isPremium) {
      return null;
    }

    return (
      <>
        <div className={cn("flex items-center justify-center", className)}>
          <Button onClick={() => setIsOpen(true)} variant="yello-stroke">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Premium Support
          </Button>
        </div>

        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Premium Support</DialogTitle>
              <DialogDescription>
                As a premium user, you have access to our priority support
                channel. Click the button below to get help now.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  // TODO: Add analytics event for tracking premium support requests
                  window.open(
                    "mailto:support@example.com?subject=Premium Support Request",
                    "_blank"
                  );
                  setIsOpen(false);
                }}
                variant="yello-gradient"
              >
                Contact Support
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

MonetizationPremiumSupport.displayName = "MonetizationPremiumSupport";

export { MonetizationPremiumSupport };
