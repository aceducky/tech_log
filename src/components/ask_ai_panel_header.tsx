"use client";

import { EraserIcon, SparklesIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { getSlugFromPathname } from "@/lib/utils";
import { Button } from "./ui/button";

export default function AskAiPanelHeader({
  onResetChat,
  onClose,
}: {
  onResetChat: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const slug = getSlugFromPathname(pathname);

  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <SparklesIcon className="size-4 shrink-0 text-muted-foreground" />
        <h2 className="font-semibold">Ask AI</h2>
        {slug && (
          <span className="truncate rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            {slug}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onResetChat}
          aria-label="Clear chat"
        >
          <EraserIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close Ask AI"
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
}
