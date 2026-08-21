"use client";

import { SparklesIcon, XIcon } from "lucide-react";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { AskAiChat } from "@/components/ask_ai_chat";
import { Button } from "@/components/ui/button";

type AskAiShellProps = {
  navbar: ReactNode;
  children: ReactNode;
};

function AskAiPanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-4 text-muted-foreground" />
        <h2 className="font-semibold">Ask AI</h2>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        aria-label="Close Ask AI"
      >
        <XIcon />
      </Button>
    </div>
  );
}

export function AskAiShell({ navbar, children }: AskAiShellProps) {
  const [open, setOpen] = useState(false);

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
        className={`fixed inset-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-linear md:inset-y-auto md:left-auto md:right-0 md:bottom-0 md:top-16 md:z-40 md:w-96 md:border-l ${
          open ? "translate-x-0" : "translate-x-full invisible"
        }`}
      >
        <AskAiPanelHeader onClose={() => setOpen(false)} />
        <Suspense fallback={<p>Loading...</p>}>
          <AskAiChat />
        </Suspense>
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
