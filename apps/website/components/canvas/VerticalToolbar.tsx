"use client";
import { Content, Provider, Root, Trigger } from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  BookOpenCheck,
  Bug,
  FileCode2,
  Languages,
  MessageSquare,
  Sparkles,
  Text,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolId =
  | "suggest-edits"
  | "adjust-length-shorter"
  | "adjust-length-longer"
  | "reading-level"
  | "final-polish"
  | "add-emojis"
  | "review-code"
  | "add-logs"
  | "add-comments"
  | "fix-bugs"
  | "port-language";

const ICON: Record<ToolId, LucideIcon> = {
  "suggest-edits": Wand2,
  "adjust-length-shorter": AlignLeft,
  "adjust-length-longer": AlignLeft,
  "reading-level": BookOpenCheck,
  "final-polish": Sparkles,
  "add-emojis": MessageSquare,
  "review-code": FileCode2,
  "add-logs": Text,
  "add-comments": MessageSquare,
  "fix-bugs": Bug,
  "port-language": Languages,
};

export function VerticalToolbar({
  tools,
  active,
}: {
  tools: { id: ToolId; label: string; onClick: () => void }[];
  active?: ToolId;
}) {
  return (
    <Provider delayDuration={100}>
      <ul className="flex flex-col gap-1">
        {tools.map((t) => {
          const I = ICON[t.id];
          return (
            <li key={t.id}>
              <Root>
                <Trigger asChild>
                  <motion.button
                    aria-label={t.label}
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-lg",
                      active === t.id
                        ? "bg-neutral-900 text-white"
                        : "hover:bg-neutral-100"
                    )}
                    onClick={t.onClick}
                    title={t.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <I className="size-5" />
                  </motion.button>
                </Trigger>
                <Content
                  className="rounded-md bg-black px-2 py-1 text-white text-xs"
                  side="right"
                  sideOffset={8}
                >
                  {t.label}
                </Content>
              </Root>
            </li>
          );
        })}
      </ul>
    </Provider>
  );
}
