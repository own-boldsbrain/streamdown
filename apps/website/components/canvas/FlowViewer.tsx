"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Step = { tool: string; from: string };
type Flow = { flow: string; call_sequence: Step[] };

export function FlowViewer({ flows }: { flows: Flow[] }) {
  return (
    <div className="space-y-4">
      {flows.map((f) => (
        <section
          className="ysh-gradient-border rounded-xl border p-3"
          key={f.flow}
        >
          <h4 className="mb-2 font-semibold text-sm">{f.flow}</h4>
          <div className="flex flex-wrap items-center gap-2">
            {f.call_sequence.map((s, idx) => (
              <div className="flex items-center gap-2" key={idx}>
                <Badge variant="secondary">{s.from}</Badge>
                <span className="text-xs">→</span>
                <Badge>{s.tool}</Badge>
                {idx < f.call_sequence.length - 1 && (
                  <Separator className="mx-1 h-4" orientation="vertical" />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
