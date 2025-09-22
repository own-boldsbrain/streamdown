"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Trace = {
  id: string;
  timestamp: string;
  service: string;
  event: string;
  duration: string;
  status: "success" | "error" | "in-progress";
  details: Record<string, unknown>;
};

type CoreTracePanelProps = {
  traces: Trace[];
  className?: string;
};

const statusColors = {
  success: "bg-green-500",
  error: "bg-red-500",
  "in-progress": "bg-yellow-500",
};

const CoreTracePanel = memo(({ traces, className }: CoreTracePanelProps) => {
  return (
    <Card className={cn("h-full w-full", className)}>
      <CardHeader>
        <CardTitle>Trace Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {traces.map((trace) => (
            <div className="flex items-center space-x-2" key={trace.id}>
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  statusColors[trace.status]
                )}
              />
              <span className="font-mono text-xs">{trace.timestamp}</span>
              <span className="font-semibold">{trace.service}</span>
              <span>{trace.event}</span>
              <span className="text-gray-500">{trace.duration}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

CoreTracePanel.displayName = "CoreTracePanel";

export { CoreTracePanel };
