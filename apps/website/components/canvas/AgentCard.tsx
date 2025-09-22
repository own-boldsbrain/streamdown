"use client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Agent = {
  id: string;
  title: string;
  type: string;
  mission: string;
  capabilities: string[];
  tools: string[];
  events: { publishes: string[]; consumes: string[] };
  dependencies: string[];
};
type ManifestTool = { name: string; summary: string };
type MCPManifest = {
  id: string;
  name: string;
  description: string;
  version: string;
  tools: ManifestTool[];
  runtime: { type: string; entrypoint: string };
};

export function AgentCard({
  agent,
  manifest,
  className,
}: {
  agent: Agent;
  manifest?: MCPManifest;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "ysh-gradient-border rounded-2xl bg-[var(--geist-elev)]",
        className
      )}
    >
      <div className="p-4">
        <h3 className="font-semibold text-base">
          <span className="ysh-text-gradient">{agent.title}</span>{" "}
          <span className="opacity-60">({agent.type})</span>
        </h3>
        <p className="mt-1 text-[var(--geist-fg-muted)] text-sm">
          {agent.mission}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {agent.capabilities.slice(0, 6).map((c) => (
            <Badge key={c} variant="outline">
              {c}
            </Badge>
          ))}
        </div>

        <ScrollArea className="mt-3 max-h-40 rounded-md border">
          <div className="p-3 text-sm">
            <div className="mb-1 font-medium">Tools</div>
            <ul className="list-disc space-y-1 pl-5">
              {manifest?.tools?.length
                ? manifest.tools.map((t) => (
                    <li key={t.name}>
                      <b>{t.name}</b> — {t.summary}
                    </li>
                  ))
                : agent.tools.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="font-medium">Publica</div>
                <ul className="list-disc pl-5">
                  {agent.events.publishes.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium">Consome</div>
                <ul className="list-disc pl-5">
                  {agent.events.consumes.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
            {manifest && (
              <div className="mt-3 text-xs opacity-70">
                Runtime: <code>{manifest.runtime.type}</code> · Entrypoint:{" "}
                <code>{manifest.runtime.entrypoint}</code>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
