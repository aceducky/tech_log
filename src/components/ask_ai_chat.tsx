'use client';

import { useChat } from '@ai-sdk/react';

export function AskAiChat() {
  const { messages, sendMessage, status } = useChat();

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.parts.map((part, i) =>
            part.type === 'text' ? <span key={i}>{part.text}</span> : null,
          )}
        </div>
      ))}
      <form
        onSubmit={e => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            'message',
          ) as HTMLInputElement;
          sendMessage({ text: input.value });
          input.value = '';
        }}
      >
        <input name="message" placeholder="Say something..." />
        <button type="submit" disabled={status === 'streaming'}>
          Send
        </button>
      </form>
    </div>
  );
}


//below code didnt work properly
// "use client";

// import { useChat } from "@ai-sdk/react";
// import { SparklesIcon } from "lucide-react";
// import { usePathname } from "next/navigation";
// import {
//   Conversation,
//   ConversationContent,
//   ConversationEmptyState,
//   ConversationScrollButton,
// } from "@/components/ai-elements/conversation";
// import {
//   Message,
//   MessageContent,
//   MessageResponse,
// } from "@/components/ai-elements/message";
// import {
//   PromptInput,
//   PromptInputBody,
//   PromptInputFooter,
//   type PromptInputMessage,
//   PromptInputSubmit,
//   PromptInputTextarea,
// } from "@/components/ai-elements/prompt-input";

// function getSlugFromPathname(pathname: string) {
//   const segments = pathname.split("/").filter(Boolean);

//   if (segments.length === 2 && segments[0] === "logs") {
//     return segments[1];
//   }

//   return null;
// }

// export function AskAiChat() {
//   const pathname = usePathname();
//   const { messages, sendMessage, status } = useChat();

//   const handleSubmit = (message: PromptInputMessage) => {
//     const text = message.text?.trim();

//     if (!text) return;

//     sendMessage({ text }, { body: { slug: getSlugFromPathname(pathname) } });
//   };

//   return (
//     <div className="flex min-h-0 flex-1 flex-col p-3">
//       <Conversation className="min-h-0 flex-1">
//         <ConversationContent>
//           {messages.length === 0 ? (
//             <ConversationEmptyState
//               icon={<SparklesIcon className="size-10" />}
//               title="Ask AI"
//               description="Ask anything about this log or TechLog in general."
//             />
//           ) : (
//             messages.map((message) => (
//               <Message from={message.role} key={message.id}>
//                 <MessageContent>
//                   {message.parts.map((part) =>
//                     part.type === "text" ? (
//                       <MessageResponse key={`${message.id}`}>
//                         {part.text}
//                       </MessageResponse>
//                     ) : null,
//                   )}
//                 </MessageContent>
//               </Message>
//             ))
//           )}
//         </ConversationContent>
//         <ConversationScrollButton />
//       </Conversation>

//       <PromptInput onSubmit={handleSubmit} className="mt-2">
//         <PromptInputBody>
//           <PromptInputTextarea placeholder="Ask AI..." />
//         </PromptInputBody>
//         <PromptInputFooter>
//           <PromptInputSubmit className="ml-auto" status={status} />
//         </PromptInputFooter>
//       </PromptInput>
//     </div>
//   );
// }
