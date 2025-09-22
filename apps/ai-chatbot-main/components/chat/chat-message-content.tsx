"use client";

import { useMemo } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

// Definição do tipo de mensagem de chat
type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

type ChatMessageContentProps = {
  message: ChatMessage;
  className?: string;
};

// Lista de chaves de agentes conhecidas
const KNOWN_AGENT_KEYS = [
  "anomaly_report",
  "risk_score",
  "consumption_patterns",
  "compliance_status",
  "consumption_validation",
  "financing_simulation",
  "site_assessment",
  "preliminary_sizing",
] as const;

// Tipo para as chaves de agentes
type AgentKey = (typeof KNOWN_AGENT_KEYS)[number];

// Verifica se uma string é uma chave de agente válida
const isValidAgentKey = (key: string): key is AgentKey => {
  return KNOWN_AGENT_KEYS.includes(key as AgentKey);
};

// Resultado da análise de conteúdo JSON
type ParseResult =
  | { isAgentJson: true; agentKey: AgentKey; data: Record<string, unknown> }
  | { isAgentJson: false };

// Detecta o possível formato JSON de resposta de agente
const tryParseAgentJson = (content: string): ParseResult => {
  try {
    // Verificamos apenas se o conteúdo parece um JSON
    if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
      const jsonData = JSON.parse(content) as Record<string, unknown>;
      const firstKey = Object.keys(jsonData)[0];

      // Verifica se é um formato de resposta de agente conhecido
      if (firstKey && isValidAgentKey(firstKey)) {
        return {
          isAgentJson: true,
          agentKey: firstKey,
          data: jsonData,
        };
      }
    }
    return { isAgentJson: false };
  } catch (_error) {
    return { isAgentJson: false };
  }
};

export function ChatMessageContent({
  message,
  className,
}: ChatMessageContentProps) {
  const content = message.text ?? "";

  // Análise otimizada e memoizada do conteúdo
  const { renderedContent, isAgent, agentData, agentKey } = useMemo(() => {
    const parseResult = tryParseAgentJson(content);

    if (parseResult.isAgentJson) {
      return {
        renderedContent: null,
        isAgent: true,
        agentData: parseResult.data,
        agentKey: parseResult.agentKey,
      };
    }

    return {
      renderedContent: content,
      isAgent: false,
      agentData: null,
      agentKey: null as unknown as AgentKey, // Cast seguro aqui pois só é usado quando isAgent é true
    };
  }, [content]);

  // Se for uma resposta de agente, renderiza o componente especializado de forma dinâmica
  if (isAgent && agentData && agentKey) {
    // Carregamos o componente AgentCard dinamicamente para evitar problemas de importação circular
    const AgentCardDynamic =
      require("@/components/agents/agent-card").AgentCard;
    
    // Obtemos os dados reais dentro da chave do agente
    const agentPayload = agentData[agentKey] || agentData;

    return (
      <div className={cn("chat-message-content", className)}>
        <AgentCardDynamic agentKey={agentKey} data={agentPayload} />
      </div>
    );
  }

  // Caso contrário, renderiza o conteúdo usando Streamdown para melhor performance
  return (
    <div className={cn("chat-message-content", className)}>
      <Streamdown
        className={cn(
          "prose prose-neutral dark:prose-invert max-w-none",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-pre:p-0 prose-p:leading-normal",
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "[&_code]:whitespace-pre-wrap [&_code]:break-words",
          "[&_pre]:max-w-full [&_pre]:overflow-x-auto"
        )}
        controls={{
          code: true,
          table: true,
          mermaid: true,
        }}
        shikiTheme={["github-light", "github-dark"]}
      >
        {renderedContent}
      </Streamdown>
    </div>
  );
}
