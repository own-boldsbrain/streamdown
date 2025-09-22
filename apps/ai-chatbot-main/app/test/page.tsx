"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentCard } from "@/components/agents/agent-card";
import { ChatMessageContent } from "@/components/chat/chat-message-content";
import { Streamdown } from "streamdown";
import { mockAgentData, mockChatMessages, mockMarkdownContent } from "@/lib/mocks/agent-data";

// Constantes
const CHAR_STREAM_INTERVAL_MS = 30;

// Tipos
type AgentKey = keyof typeof mockAgentData;
type MarkdownKey = keyof typeof mockMarkdownContent;

export default function TestPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentKey>("anomaly_report");
  const [selectedMarkdown, setSelectedMarkdown] = useState<MarkdownKey>("simple");
  const [currentMessages, setCurrentMessages] = useState(mockChatMessages.slice(0, 2));
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("agents");

  // Simula o streaming de texto, adicionando um caractere de cada vez
  const startStreaming = () => {
    setIsStreaming(true);
    setStreamingText("");
    
    const fullText = mockMarkdownContent.streaming;
    let index = 0;
    
    const streamInterval = setInterval(() => {
      if (index < fullText.length) {
        setStreamingText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
      }
    }, CHAR_STREAM_INTERVAL_MS);
  };

  // Adiciona mais mensagens à conversa
  const addMoreMessages = () => {
    const nextLength = Math.min(currentMessages.length + 2, mockChatMessages.length);
    setCurrentMessages(mockChatMessages.slice(0, nextLength));
  };

  // Reset das mensagens
  const resetMessages = () => {
    setCurrentMessages(mockChatMessages.slice(0, 2));
  };

  // Renderização condicional de tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case "agents":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Teste de Componentes de Agentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select
                  value={selectedAgent}
                  onValueChange={(value) => setSelectedAgent(value as AgentKey)}
                >
                  <SelectTrigger className="w-72">
                    <SelectValue placeholder="Selecione um tipo de agente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anomaly_report">Relatório de Anomalias</SelectItem>
                    <SelectItem value="risk_score">Pontuação de Risco</SelectItem>
                    <SelectItem value="consumption_patterns">Padrões de Consumo</SelectItem>
                    <SelectItem value="compliance_status">Status de Conformidade</SelectItem>
                    <SelectItem value="financing_simulation">Simulação de Financiamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-6">
                <AgentCard 
                  agentKey={selectedAgent} 
                  data={mockAgentData[selectedAgent]}
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case "markdown":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Teste de Renderização Markdown com Streamdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select
                  value={selectedMarkdown}
                  onValueChange={(value) => setSelectedMarkdown(value as MarkdownKey)}
                >
                  <SelectTrigger className="w-72">
                    <SelectValue placeholder="Selecione um exemplo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Markdown Simples</SelectItem>
                    <SelectItem value="complex">Markdown Complexo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-6 rounded-lg border p-6">
                <Streamdown
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  controls={{
                    code: true,
                    table: true,
                    mermaid: true,
                  }}
                  shikiTheme={["github-light", "github-dark"]}
                >
                  {mockMarkdownContent[selectedMarkdown]}
                </Streamdown>
              </div>
            </CardContent>
          </Card>
        );
      
      case "chat":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Simulação de Conversa de Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Button onClick={addMoreMessages}>Adicionar Mais Mensagens</Button>
                <Button variant="outline" onClick={resetMessages}>Reiniciar</Button>
              </div>
              
              <div className="mt-6 space-y-6">
                {currentMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-3xl rounded-lg p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {message.role === "user" ? (
                        <p>{message.text}</p>
                      ) : (
                        <ChatMessageContent 
                          message={{
                            id: message.id,
                            role: message.role as "user" | "assistant" | "system",
                            text: message.text
                          }} 
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      
      case "streaming":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Teste de Streaming de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={startStreaming} disabled={isStreaming}>
                  {isStreaming ? "Streaming em andamento..." : "Iniciar Streaming"}
                </Button>
              </div>
              
              <div className="mt-6 rounded-lg border p-6">
                <Streamdown
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  controls={{
                    code: true,
                    table: true,
                    mermaid: true,
                  }}
                  shikiTheme={["github-light", "github-dark"]}
                >
                  {streamingText}
                </Streamdown>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="font-bold mb-8 text-3xl">Página de Teste Visual</h1>
      
      <div className="mb-6">
        <div className="border-b flex">
          <button
            type="button"
            className={`border-b-2 px-4 py-2 ${activeTab === "agents" ? "border-primary" : "border-transparent"}`}
            onClick={() => setActiveTab("agents")}
          >
            Componentes de Agentes
          </button>
          <button
            type="button"
            className={`border-b-2 px-4 py-2 ${activeTab === "markdown" ? "border-primary" : "border-transparent"}`}
            onClick={() => setActiveTab("markdown")}
          >
            Visualização Markdown
          </button>
          <button
            type="button"
            className={`border-b-2 px-4 py-2 ${activeTab === "chat" ? "border-primary" : "border-transparent"}`}
            onClick={() => setActiveTab("chat")}
          >
            Simulação de Chat
          </button>
          <button
            type="button"
            className={`border-b-2 px-4 py-2 ${activeTab === "streaming" ? "border-primary" : "border-transparent"}`}
            onClick={() => setActiveTab("streaming")}
          >
            Streaming
          </button>
        </div>
      </div>
      
      {renderTabContent()}
    </div>
  );
}