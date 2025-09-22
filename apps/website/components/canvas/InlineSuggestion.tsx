"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function InlineSuggestion({
  text,
  suggestion,
  onAccept,
  onReject,
}: {
  text: string;
  suggestion: string;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="ysh-gradient-border rounded-lg border bg-amber-50 p-3">
      <div className="mb-2 text-xs">
        <Badge variant="outline">Sugestão</Badge>
      </div>
      <p className="mb-2 line-through decoration-red-500/60">{text}</p>
      <p className="mb-3 font-medium">{suggestion}</p>
      <div className="flex gap-2">
        <Button onClick={onAccept} size="sm">
          Aceitar
        </Button>
        <Button onClick={onReject} size="sm" variant="secondary">
          Rejeitar
        </Button>
      </div>
    </div>
  );
}
