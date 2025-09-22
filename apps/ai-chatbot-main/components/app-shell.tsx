"use client";

import type { ReactNode } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CanvasPane } from "./canvas-pane";
import { ChatHeader } from "./chat-header";
import { MainPane } from "./main-pane";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: ReactNode;
  chatId: string;
  selectedVisibilityType: string;
  isReadonly: boolean;
}

export function AppShell({
  children,
  chatId,
  selectedVisibilityType,
  isReadonly,
}: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <ChatHeader
        chatId={chatId}
        isReadonly={isReadonly}
        selectedVisibilityType={selectedVisibilityType as any}
      />
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={70} minSize={50}>
            <MainPane>{children}</MainPane>
          </Panel>
          <PanelResizeHandle className="w-2 bg-border hover:bg-accent" />
          <Panel defaultSize={30} minSize={20}>
            <CanvasPane />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
