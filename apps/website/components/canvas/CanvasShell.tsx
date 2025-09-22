"use client";
import { motion } from "framer-motion";
import { ArrowLeft, History } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  onBack?: () => void;
  onOpenVersions?: () => void;
  left?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
};

export function CanvasShell({
  title = "Canvas",
  onBack,
  onOpenVersions,
  left,
  right,
  children,
}: Props) {
  return (
    <div className="grid h-dvh grid-cols-[56px_1fr_360px] grid-rows-[56px_1fr] bg-[var(--geist-bg)] text-[var(--geist-fg)]">
      <header className="col-span-3 flex items-center gap-2 border-b px-3">
        <Button
          aria-label="Voltar"
          onClick={onBack}
          size="icon"
          variant="ghost"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="grow truncate font-medium text-sm">{title}</h1>
        <Button onClick={onOpenVersions} size="sm" variant="ghost">
          <History className="mr-2 size-4" />
          Versões
        </Button>
      </header>
      <aside className="border-r">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="h-full p-2"
          initial={{ opacity: 0, y: 8 }}
        >
          {left}
        </motion.div>
      </aside>
      <main className="overflow-auto p-4">{children}</main>
      <aside className="hidden border-l p-3 md:block">{right}</aside>
    </div>
  );
}
