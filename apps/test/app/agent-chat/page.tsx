'use client';

import { useChat } from 'ai/react';
import { Streamdown } from 'streamdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

export default function AgentChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/agent',
  });

  return (
    <div className="flex flex-col h-screen bg-background">
      <Card className="flex flex-col flex-grow w-full max-w-2xl mx-auto my-4 shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">Experimental Agent Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-0">
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map((m, index) => (
                <div key={index} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role !== 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/yello-avatar.png" alt="Yello" />
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <Streamdown>{m.content}</Streamdown>
                  </div>
                   {m.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/user-avatar.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Pergunte ao agente... (ex: quanto é 12 * 5?)"
                className="flex-grow"
              />
              <Button type="submit" size="icon" variant="yello-gradient">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
