"use client";
import { Root, Trigger, Content, Provider } from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Wand2, AlignLeft, BookOpenCheck, Sparkles, MessageSquare, FileCode2, Bug, Languages, Text } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToolId =
  | "suggest-edits" | "adjust-length-shorter" | "adjust-length-longer"
  | "reading-level" | "final-polish" | "add-emojis"
  | "review-code" | "add-logs" | "add-comments" | "fix-bugs" | "port-language";

const ICON: Record<ToolId, LucideIcon> = {
  "suggest-edits": Wand2, "adjust-length-shorter": AlignLeft, "adjust-length-longer": AlignLeft,
  "reading-level": BookOpenCheck, "final-polish": Sparkles, "add-emojis": MessageSquare,
  "review-code": FileCode2, "add-logs": Text, "add-comments": MessageSquare, "fix-bugs": Bug, "port-language": Languages
};

export function VerticalToolbar({ tools, active }: { tools: {id:ToolId;label:string;onClick:()=>void; }[]; active?:ToolId; }){
  return (
    <Provider delayDuration={100}>
      <ul className="flex flex-col gap-1">
        {tools.map((t)=>{ const I=ICON[t.id]; return (
          <li key={t.id}>
            <Root>
              <Trigger asChild>
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:.98}}
                  onClick={t.onClick}
                  className={cn("grid h-10 place-items-center rounded-lg w-10",
                    active===t.id?"bg-neutral-900 text-white":"hover:bg-neutral-100")}
                  aria-label={t.label} title={t.label}>
                  <I className="size-5"/>
                </motion.button>
              </Trigger>
              <Content side="right" sideOffset={8}
                className="bg-black px-2 py-1 rounded-md text-white text-xs">{t.label}</Content>
            </Root>
          </li>
        )})}
      </ul>
    </Provider>
  );
}