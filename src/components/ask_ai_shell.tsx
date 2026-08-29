"use client";

import { SparklesIcon } from "lucide-react";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ASK_AI_MESSAGES_STORAGE_KEY, ChatView } from "./ai_chat_view";
import AskAiPanelHeader from "./ask_ai_panel_header";

type AskAiShellProps = {
  navbar: ReactNode;
  children: ReactNode;
};

export function AskAiShell({ navbar, children }: AskAiShellProps) {
  const [open, setOpen] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Changing the key remounts ChatView, which reloads its (now cleared)
  // history from localStorage.
  const resetChat = () => {
    localStorage.removeItem(ASK_AI_MESSAGES_STORAGE_KEY);
    setResetCount((count) => count + 1);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {navbar}
      {children}

      <aside
        aria-label="Ask AI"
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-linear md:inset-y-auto md:left-auto md:right-0 md:bottom-0 md:top-16 md:z-40 md:w-3/7 md:min-w-80 md:border-l ${
          open ? "translate-x-0" : "translate-x-full invisible"
        }`}
      >
        <Suspense>
          <AskAiPanelHeader
            onResetChat={resetChat}
            onClose={() => setOpen(false)}
          />
        </Suspense>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <Suspense>
            <ChatView key={resetCount} />
          </Suspense>
        </div>
      </aside>

      {!open && (
        <Button
          variant="secondary"
          className="fixed right-5 bottom-5 z-40 shadow-lg sm:right-6 sm:bottom-6"
          onClick={() => setOpen(true)}
        >
          <SparklesIcon />
          Ask AI
        </Button>
      )}
    </>
  );
}
