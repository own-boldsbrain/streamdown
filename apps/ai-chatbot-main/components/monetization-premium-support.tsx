"use client";

import { memo, useState } from "react";
import { LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
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
          <Button
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            <LifeBuoy className="mr-2 h-4 w-4" />
            Premium Support
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                variant="default"
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
