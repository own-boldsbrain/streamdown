"use client";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type Comment = { id: string; author: string; text: string; createdAt: string };
export function InlineCommentThread({
  comments,
  onReply,
}: {
  comments: Comment[];
  onReply: (t: string) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="rounded-lg border">
      <ScrollArea className="max-h-64 p-3">
        <ul className="space-y-3">
          {comments.map((c) => (
            <li className="flex gap-3" key={c.id}>
              <Avatar className="size-8">
                <AvatarFallback>{c.author[0]}</AvatarFallback>
              </Avatar>
              <div className="grow">
                <div className="text-xs opacity-60">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div className="text-sm">{c.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) {
            onReply(draft.trim());
            setDraft("");
          }
        }}
      >
        <Textarea
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Responder…"
          value={draft}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
