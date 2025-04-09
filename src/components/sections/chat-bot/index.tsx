"use client";
import { FormEvent, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { DockIcon } from "@/components/sections/chat-bot/DockIcon";
import { ChatWindow } from "@/components/sections/chat-bot/ChatWindow";
import { useChatStore } from "@/stores/chatStore";

export default function ChatBotSection() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);
  const isMobile = useIsMobile();
  const {
    messages,
    input,
    isLoading,
    error,
    setInput,
    sendMessage,
    resetChat,
  } = useChatStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsFullPage(false);
    }
  };

  const handleExpand = () => {
    if (isMobile) {
      // On mobile, navigate to the chat page
      window.open("/chat", "_blank");
    } else {
      // On desktop, expand in the same view
      setIsFullPage(!isFullPage);
    }
  };

  return (
    <div>
      {isChatOpen && (
        <ChatWindow
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          isFullPage={isFullPage}
          onExpand={handleExpand}
          onClose={toggleChat}
          isMobile={isMobile}
          resetChat={resetChat}
        />
      )}
      <DockIcon onClick={toggleChat} isOpen={isChatOpen} />
    </div>
  );
}
