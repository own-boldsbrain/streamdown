"use client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Agent={
  id:string; title:string; type:string; mission:string;
  capabilities:string[]; tools:string[];
  events:{publishes:string[]; consumes:string[]}; dependencies:string[];
};
type ManifestTool={name:string; summary:string};
type MCPManifest={ id:string; name:string; description:string; version:string;
  tools: ManifestTool[]; runtime:{type:string;entrypoint:string} };

export function AgentCard({ agent, manifest, className }:{agent:Agent; manifest?:MCPManifest; className?:string;}){
  return (
    <section className={cn("bg-[var(--geist-elev)] rounded-2xl ysh-gradient-border", className)}>
      <div className="p-4">
        <h3 className="font-semibold text-base"><span className="ysh-text-gradient">{agent.title}</span> <span className="opacity-60">({agent.type})</span></h3>
        <p className="mt-1 text-[var(--geist-fg-muted)] text-sm">{agent.mission}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {agent.capabilities.slice(0,6).map((c)=> <Badge key={c} variant="outline">{c}</Badge>)}
        </div>

        <ScrollArea className="border max-h-40 mt-3 rounded-md">
          <div className="p-3 text-sm">
            <div className="font-medium mb-1">Tools</div>
            <ul className="list-disc pl-5 space-y-1">
              {manifest?.tools?.length ? manifest.tools.map(t=><li key={t.name}><b>{t.name}</b> — {t.summary}</li>) :
                agent.tools.map(t=><li key={t}>{t}</li>)}
            </ul>
            <div className="gap-3 grid grid-cols-2 mt-3">
              <div>
                <div className="font-medium">Publica</div>
                <ul className="list-disc pl-5">{agent.events.publishes.map(e=><li key={e}>{e}</li>)}</ul>
              </div>
              <div>
                <div className="font-medium">Consome</div>
                <ul className="list-disc pl-5">{agent.events.consumes.map(e=><li key={e}>{e}</li>)}</ul>
              </div>
            </div>
            {manifest && (
              <div className="mt-3 opacity-70 text-xs">
                Runtime: <code>{manifest.runtime.type}</code> · Entrypoint: <code>{manifest.runtime.entrypoint}</code>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}