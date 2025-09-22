"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Comment={id:string;author:string;text:string;createdAt:string};
export function InlineCommentThread({comments,onReply}:{comments:Comment[];onReply:(t:string)=>void;}){
  const [draft,setDraft]=useState("");
  return (
    <div className="border rounded-lg">
      <ScrollArea className="max-h-64 p-3">
        <ul className="space-y-3">
          {comments.map(c=>(
            <li key={c.id} className="flex gap-3">
              <Avatar className="size-8"><AvatarFallback>{c.author[0]}</AvatarFallback></Avatar>
              <div className="grow">
                <div className="opacity-60 text-xs">{new Date(c.createdAt).toLocaleString()}</div>
                <div className="text-sm">{c.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <form className="border-t flex gap-2 p-3" onSubmit={(e)=>{e.preventDefault();if(draft.trim()){onReply(draft.trim());setDraft("");}}}>
        <Textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Responder…"/>
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}