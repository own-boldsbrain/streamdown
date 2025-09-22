"use client";
import { Button } from "@/components/ui/button";
export type Version = { id: string; label: string; createdAt: string };

export function VersionHistoryTimeline({
  versions,
  onRestore,
}: {
  versions: Version[];
  onRestore: (id: string) => void;
}) {
  return (
    <ol className="space-y-2">
      {versions.map((v) => (
        <li
          className="ysh-gradient-border flex items-center justify-between rounded-md border p-2"
          key={v.id}
        >
          <div>
            <div className="font-medium text-sm">{v.label}</div>
            <div className="text-xs opacity-60">
              {new Date(v.createdAt).toLocaleString()}
            </div>
          </div>
          <Button onClick={() => onRestore(v.id)} size="sm">
            Restaurar
          </Button>
        </li>
      ))}
    </ol>
  );
}
