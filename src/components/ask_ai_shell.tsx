"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  AskAiCloseButton,
  AskAiFloatingTrigger,
} from "@/components/ask_ai_trigger";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

type AskAiShellProps = {
  navbar: ReactNode;
  children: ReactNode;
};

export function AskAiShell({ navbar, children }: AskAiShellProps) {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={{ "--sidebar-width": "24rem" } as CSSProperties}
    >
      <SidebarInset>
        {navbar}
        {children}
      </SidebarInset>
      <Sidebar side="right" aria-label="Ask AI">
        <SidebarHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Ask AI</h2>
              <p className="text-xs text-muted-foreground">
                Chat interface coming soon.
              </p>
            </div>
            <AskAiCloseButton />
          </div>
        </SidebarHeader>
        <SidebarContent />
      </Sidebar>
      <AskAiFloatingTrigger />
    </SidebarProvider>
  );
}
