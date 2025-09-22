"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  title?: string; 
  onBack?: () => void; 
  onOpenVersions?: () => void;
  left?: ReactNode; 
  right?: ReactNode;
  children: ReactNode;
};

export function CanvasShell({ title="Canvas", onBack, onOpenVersions, left, right, children }: Props){
  return (
    <div className="bg-[var(--geist-bg)] grid h-dvh grid-cols-[56px_1fr_360px] grid-rows-[56px_1fr] text-[var(--geist-fg)]">
      <header className="border-b col-span-3 flex items-center gap-2 px-3">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar"><ArrowLeft className="size-5"/></Button>
        <h1 className="font-medium grow truncate text-sm">{title}</h1>
        <Button variant="ghost" size="sm" onClick={onOpenVersions}><History className="mr-2 size-4"/>Versões</Button>
      </header>
      <aside className="border-r"><motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="h-full p-2">{left}</motion.div></aside>
      <main className="overflow-auto p-4">{children}</main>
      <aside className="border-l hidden md:block p-3">{right}</aside>
    </div>
  );
}