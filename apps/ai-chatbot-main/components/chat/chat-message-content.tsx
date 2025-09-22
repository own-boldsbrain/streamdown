"use client";

import { useMemo } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { AgentCard } from "@/components/agents/agent-card";

// Definição do tipo de mensagem de chat
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
}

type ChatMessageContentProps = {
  message: ChatMessage;
  className?: string;
};

// Detecta o possível formato JSON de resposta de agente
const tryParseAgentJson = (content: string) => {
  try {
    // Verificamos apenas se o conteúdo parece um JSON
    if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
      const jsonData = JSON.parse(content);
      const agentKey = Object.keys(jsonData)[0];
      
      // Verifica se é um formato de resposta de agente conhecido
      const knownAgentKeys = [
        "anomaly_report",
        "risk_score",
        "consumption_patterns",
        "compliance_status",
        "consumption_validation",
        "financing_simulation",
        "site_assessment",
        "preliminary_sizing",
      ];
      
      if (knownAgentKeys.includes(agentKey)) {
        return { isAgentJson: true, agentKey, data: jsonData };
      }
    }
    return { isAgentJson: false };
  } catch (_error) {
    return { isAgentJson: false };
  }
};

export function ChatMessageContent({ message, className }: ChatMessageContentProps) {
  const content = message.text ?? "";
  
  // Análise otimizada e memoizada do conteúdo
  const { renderedContent, isAgent, agentData, agentKey } = useMemo(() => {
    const { isAgentJson, agentKey, data } = tryParseAgentJson(content);
    
    if (isAgentJson && agentKey && data) {
      return {
        renderedContent: null,
        isAgent: true,
        agentData: data,
        agentKey
      };
    }
    
    return {
      renderedContent: content,
      isAgent: false,
      agentData: null,
      agentKey: null
    };
  }, [content]);
  
  // Se for uma resposta de agente, renderiza o componente especializado
  if (isAgent && agentData && agentKey) {
    return (
      <div className={cn("chat-message-content", className)}>
        <AgentCard agentKey={agentKey} data={agentData} />
      </div>
    );
  }
  
  // Caso contrário, renderiza o conteúdo usando Streamdown para melhor performance
  return (
    <div className={cn("chat-message-content", className)}>
      <Streamdown
        className={cn(
          "max-w-none prose prose-neutral dark:prose-invert",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-p:leading-normal prose-pre:p-0",
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "[&_code]:break-words [&_code]:whitespace-pre-wrap",
          "[&_pre]:max-w-full [&_pre]:overflow-x-auto"
        )}
        shikiTheme={["github-light", "github-dark"]}
        controls={{
          code: true,
          table: true,
          mermaid: true
        }}
      >
        {renderedContent}
      </Streamdown>
    </div>
  );
}