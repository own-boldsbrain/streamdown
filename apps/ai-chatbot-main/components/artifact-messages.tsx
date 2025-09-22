import type { UseChatHelpers } from "@ai-sdk/react";
import equal from "fast-deep-equal";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import { useMessages } from "@/hooks/use-messages";
import type { Vote } from "@/lib/db/schema";
import {
  mockAnomalyReportProps,
  mockComplianceBadgeProps,
  mockRiskGaugeProps,
  mockToolInspectorProps,
} from "@/lib/mocks";
import type { ChatMessage } from "@/lib/types";
import type { UIArtifact } from "./artifact";
import { type ActionType, ArtifactActionModal } from "./artifact-actions-modal";
import { ArtifactAnomalyReport } from "./artifact-anomaly-report";
import { ArtifactComplianceBadge } from "./artifact-compliance-badge";
import { ArtifactRiskGauge } from "./artifact-risk-gauge";
import { ArtifactToolInspector } from "./artifact-tool-inspector";
import { PreviewMessage, ThinkingMessage } from "./message";

type ArtifactMessagesProps = {
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  votes: Vote[] | undefined;
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  artifactStatus: UIArtifact["status"];
};

function PureArtifactMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
}: ArtifactMessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    status,
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    artifactType: "risk" | "anomaly" | "compliance" | "tool";
    data?: Record<string, unknown>;
  }>({
    isOpen: false,
    actionType: "view",
    artifactType: "risk",
  });

  const handleArtifactAction = (
    actionType: ActionType,
    artifactType: "risk" | "anomaly" | "compliance" | "tool",
    data?: Record<string, unknown>
  ) => {
    setModalState({
      isOpen: true,
      actionType,
      artifactType,
      data,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div
      className="flex h-full flex-col items-center gap-4 overflow-y-scroll px-4 pt-20"
      ref={messagesContainerRef}
    >
      {messages.map((message, index) => (
        <PreviewMessage
          chatId={chatId}
          isLoading={status === "streaming" && index === messages.length - 1}
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
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages.at(-1)?.role === "user" && <ThinkingMessage />}

      {/* Renderiza os artefatos aqui para demonstração */}
      <div className="w-full max-w-4xl space-y-8">
        <ArtifactRiskGauge
          {...mockRiskGaugeProps}
          onExport={() => handleArtifactAction("export", "risk")}
          onShare={() => handleArtifactAction("share", "risk")}
          onView={() => handleArtifactAction("view", "risk")}
        />
        <ArtifactAnomalyReport
          {...mockAnomalyReportProps}
          onExport={() => handleArtifactAction("export", "anomaly")}
          onShare={() => handleArtifactAction("share", "anomaly")}
          onView={() => handleArtifactAction("view", "anomaly")}
        />
        <ArtifactComplianceBadge
          {...mockComplianceBadgeProps}
          onExport={() => handleArtifactAction("export", "compliance")}
          onView={() => handleArtifactAction("view", "compliance")}
        />
        <ArtifactToolInspector
          {...mockToolInspectorProps}
          onExport={() => handleArtifactAction("export", "tool")}
          onShare={() => handleArtifactAction("share", "tool")}
          onView={() => handleArtifactAction("view", "tool")}
        />
      </div>

      <ArtifactActionModal
        actionType={modalState.actionType}
        artifactType={modalState.artifactType}
        data={modalState.data}
        isOpen={modalState.isOpen}
        onClose={closeModal}
      />

      <motion.div
        className="min-h-[24px] min-w-[24px] shrink-0"
        onViewportEnter={onViewportEnter}
        onViewportLeave={onViewportLeave}
        ref={messagesEndRef}
      />
    </div>
  );
}

function areEqual(
  prevProps: ArtifactMessagesProps,
  nextProps: ArtifactMessagesProps
) {
  if (
    prevProps.artifactStatus === "streaming" &&
    nextProps.artifactStatus === "streaming"
  ) {
    return true;
  }

  if (prevProps.status !== nextProps.status) {
    return false;
  }
  if (prevProps.status && nextProps.status) {
    return false;
  }
  if (prevProps.messages.length !== nextProps.messages.length) {
    return false;
  }
  if (!equal(prevProps.votes, nextProps.votes)) {
    return false;
  }

  return true;
}

export const ArtifactMessages = memo(PureArtifactMessages, areEqual);
