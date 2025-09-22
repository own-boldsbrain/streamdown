"use client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Step={tool:string; from:string};
type Flow={flow:string; call_sequence:Step[]};

export function FlowViewer({ flows }:{flows:Flow[];}){
  return (
    <div className="space-y-4">
      {flows.map((f)=>(
        <section key={f.flow} className="border p-3 rounded-xl ysh-gradient-border">
          <h4 className="font-semibold mb-2 text-sm">{f.flow}</h4>
          <div className="flex flex-wrap gap-2 items-center">
            {f.call_sequence.map((s,idx)=>(
              <div key={idx} className="flex gap-2 items-center">
                <Badge variant="secondary">{s.from}</Badge>
                <span className="text-xs">→</span>
                <Badge>{s.tool}</Badge>
                {idx < f.call_sequence.length-1 && <Separator orientation="vertical" className="h-4 mx-1" />}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}