"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { ArrowDownIcon } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import { useMessages } from "@/hooks/use-messages";
import type { Vote } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";
import { Conversation, ConversationContent } from "./elements/conversation";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";
import "./chat-message-list.css";

// Constantes para configuração
const SCROLL_DELAY = 100;
const BOTTOM_THRESHOLD = 100;
const OVERSCAN_ROW_COUNT = 5;

type ChatMessageListProps = {
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  votes: Vote[] | undefined;
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  selectedModelId: string;
};

type RowRendererParams = {
  index: number;
  key: string;
  parent: React.Component;
  style: React.CSSProperties;
};

type ScrollParams = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
};

type AutoSizerParams = {
  height: number;
  width: number;
};

// Cache para medir células dinamicamente
const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100,
});

function PureChatMessageList({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
  selectedModelId,
}: ChatMessageListProps) {
  const listRef = useRef<List>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    endRef: messagesEndRef,
    isAtBottom,
    scrollToBottom,
    hasSentMessage,
  } = useMessages({
    status,
  });

  useDataStream();

  // Estado para controlar se devemos rolar automaticamente
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // Função para rolar para o final
  const scrollToEnd = useCallback(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToRow(messages.length - 1);
    }
  }, [messages.length]);

  // Efeito para rolar automaticamente quando novas mensagens chegam
  useEffect(() => {
    if (status === "submitted" && autoScrollEnabled) {
      // Pequeno delay para garantir que a mensagem foi renderizada
      setTimeout(() => {
        scrollToEnd();
      }, SCROLL_DELAY);
    }
  }, [status, autoScrollEnabled, scrollToEnd]);

  // Função para renderizar cada linha da lista virtualizada
  const rowRenderer = useCallback(
    ({ index, key, parent, style }: RowRendererParams) => {
      const message = messages[index];

      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          <div className="px-2 py-2 md:px-4" style={style}>
            <PreviewMessage
              chatId={chatId}
              isLoading={
                status === "streaming" && messages.length - 1 === index
              }
              isReadonly={isReadonly}
              key={message.id}
              message={message}
              regenerate={regenerate}
              requiresScrollPadding={
                hasSentMessage && index === messages.length - 1
              }
              setMessages={setMessages}
              vote={
                votes
                  ? votes.find((vote) => vote.messageId === message.id)
                  : undefined
              }
            />
          </div>
        </CellMeasurer>
      );
    },
    [
      chatId,
      status,
      messages,
      isReadonly,
      regenerate,
      hasSentMessage,
      setMessages,
      votes,
    ]
  );

  // Função chamada quando o usuário rola manualmente
  const onScroll = useCallback(
    ({ scrollTop, scrollHeight, clientHeight }: ScrollParams) => {
      const isNearBottom =
        scrollTop + clientHeight >= scrollHeight - BOTTOM_THRESHOLD;
      setAutoScrollEnabled(isNearBottom);
    },
    []
  );

  // Recalcular tamanhos quando mensagens mudam
  useEffect(() => {
    cache.clearAll();
    if (listRef.current) {
      listRef.current.recomputeRowHeights();
    }
  }, []);

  // Se não há mensagens, mostrar greeting
  if (messages.length === 0) {
    return (
      <div className="overscroll-behavior-contain -webkit-overflow-scrolling-touch flex-1 touch-pan-y overflow-y-scroll">
        <Conversation className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 md:gap-6">
          <ConversationContent className="flex flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
            <Greeting />
            <div
              className="min-h-[24px] min-w-[24px] shrink-0"
              ref={messagesEndRef}
            />
          </ConversationContent>
        </Conversation>
      </div>
    );
  }

  return (
    <div
      className="overscroll-behavior-contain -webkit-overflow-scrolling-touch flex-1 touch-pan-y overflow-y-scroll"
      ref={containerRef}
      style={{ overflowAnchor: "none" }}
    >
      <Conversation className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 md:gap-6">
        <ConversationContent className="flex flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
          <AutoSizer>
            {({ height, width }: AutoSizerParams) => (
              <List
                className="virtualized-message-list"
                deferredMeasurementCache={cache}
                height={height}
                onScroll={onScroll}
                overscanRowCount={OVERSCAN_ROW_COUNT}
                ref={listRef}
                rowCount={messages.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                scrollToAlignment="end"
                width={width}
              />
            )}
          </AutoSizer>

          {status === "submitted" &&
            messages.length > 0 &&
            messages.at(-1)?.role === "user" &&
            selectedModelId !== "chat-model-reasoning" && <ThinkingMessage />}

          <div
            className="min-h-[24px] min-w-[24px] shrink-0"
            ref={messagesEndRef}
          />
        </ConversationContent>
      </Conversation>

      {!isAtBottom && (
        <button
          aria-label="Scroll to bottom"
          className="-translate-x-1/2 absolute bottom-40 left-1/2 z-10 rounded-full border bg-background p-2 shadow-lg transition-colors hover:bg-muted"
          onClick={() => {
            setAutoScrollEnabled(true);
            scrollToBottom("smooth");
            scrollToEnd();
          }}
          type="button"
        >
          <ArrowDownIcon className="size-4" />
        </button>
      )}
    </div>
  );
}

export const ChatMessageList = memo(PureChatMessageList);
