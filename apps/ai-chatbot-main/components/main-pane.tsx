"use client";

import type { ReactNode } from "react";

interface MainPaneProps {
  children: ReactNode;
}

export function MainPane({ children }: MainPaneProps) {
  return <div className="flex h-full flex-col bg-background">{children}</div>;
}
