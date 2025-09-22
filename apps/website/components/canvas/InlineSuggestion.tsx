"use client";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";

export function InlineSuggestion({text,suggestion,onAccept,onReject}:{text:string;suggestion:string;onAccept:()=>void;onReject:()=>void;}){
  return (
    <div className="bg-amber-50 border p-3 rounded-lg ysh-gradient-border">
      <div className="mb-2 text-xs"><Badge variant="outline">Sugestão</Badge></div>
      <p className="decoration-red-500/60 line-through mb-2">{text}</p>
      <p className="font-medium mb-3">{suggestion}</p>
      <div className="flex gap-2"><Button size="sm" onClick={onAccept}>Aceitar</Button><Button size="sm" variant="secondary" onClick={onReject}>Rejeitar</Button></div>
    </div>
  );
}