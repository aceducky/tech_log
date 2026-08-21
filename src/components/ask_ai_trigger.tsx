"use client";

import { SparklesIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

function useAskAiSidebar() {
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();
  return { isOpen: isMobile ? openMobile : open, toggleSidebar };
}

export function AskAiFloatingTrigger() {
  const { isOpen, toggleSidebar } = useAskAiSidebar();

  if (isOpen) return null;

  return (
    <Button
      className="fixed right-5 bottom-5 z-40 shadow-lg sm:right-6 sm:bottom-6"
      onClick={toggleSidebar}
    >
      <SparklesIcon />
      Ask AI
    </Button>
  );
}

export function AskAiCloseButton() {
  const { toggleSidebar } = useAskAiSidebar();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
      aria-label="Close Ask AI"
    >
      <XIcon />
    </Button>
  );
}
