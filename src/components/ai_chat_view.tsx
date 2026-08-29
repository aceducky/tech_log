import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  isDynamicToolUIPart,
  isStaticToolUIPart,
  type UIMessage,
} from "ai";
import { AlertCircleIcon, SparklesIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSlugFromPathname } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "./ai-elements/prompt-input";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "./ai-elements/tool";

export const ASK_AI_MESSAGES_STORAGE_KEY = "techlog-ask-ai-messages";

function loadStoredMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(ASK_AI_MESSAGES_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function ChatView() {
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const slug = getSlugFromPathname(pathname);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { currentSlug: slug },
      }),
    [slug],
  );

  const { messages, sendMessage, setMessages, status, error } =
    useChat<UIMessage>({
      id: "techlog-ask-ai",
      transport,
      onFinish: ({ messages }) => {
        localStorage.setItem(
          ASK_AI_MESSAGES_STORAGE_KEY,
          JSON.stringify(messages),
        );
      },
    });

  useEffect(() => {
    const stored = loadStoredMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, [setMessages]);

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text) return;

    sendMessage({ parts: [{ type: "text", text }] });
    setInput("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<SparklesIcon className="size-10" />}
              title="Ask AI"
              description="Ask anything about this log or TechLog in general."
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <MessageResponse key={`${message.id}-${part.text}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      default: {
                        if (
                          !(
                            isStaticToolUIPart(part) ||
                            isDynamicToolUIPart(part)
                          )
                        ) {
                          return null;
                        }

                        return (
                          <Tool
                            key={part.toolCallId}
                            defaultOpen={part.state === "output-available"}
                          >
                            {isStaticToolUIPart(part) ? (
                              <ToolHeader type={part.type} state={part.state} />
                            ) : (
                              <ToolHeader
                                type="dynamic-tool"
                                state={part.state}
                                toolName={part.toolName}
                              />
                            )}
                            <ToolContent>
                              {part.input != null && (
                                <ToolInput input={part.input} />
                              )}
                              {(part.output != null ||
                                part.errorText != null) && (
                                <ToolOutput
                                  output={part.output}
                                  errorText={part.errorText}
                                />
                              )}
                            </ToolContent>
                          </Tool>
                        );
                      }
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {error && (
            <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircleIcon className="size-4 shrink-0" />
              <p>Something went wrong. Please try again.</p>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput onSubmit={handleSubmit} className="mt-2">
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask AI..."
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit className="ml-auto" status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
