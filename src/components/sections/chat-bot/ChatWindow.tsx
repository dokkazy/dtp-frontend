"use client";

import type React from "react";

import ChatInterface from "./ChatInterface";
import { Message } from "@/stores/chatStore";

interface ChatWindowProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
  isFullPage: boolean;
  onExpand: () => void;
  onClose: () => void;
  isMobile: boolean;
  resetChat: () => void;
}

export function ChatWindow({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  isFullPage,
  onExpand,
  onClose,
  isMobile,
  resetChat,
}: ChatWindowProps) {
  return (
    <div
      className={`fixed z-[9999991] overflow-hidden rounded-lg border bg-background shadow-lg ${isFullPage ? "inset-4 sm:inset-8 md:inset-16 lg:inset-32" : "bottom-24 right-6 h-[500px] w-[90vw] sm:w-[400px]"} transition-all duration-300 ease-in-out`}
    >
      <ChatInterface
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        isFullPage={isFullPage}
        onExpand={onExpand}
        onClose={onClose}
        expandLabel={
          isMobile ? "Open Full Chat" : isFullPage ? "Minimize" : "Expand"
        }
        resetChat={resetChat}
      />
    </div>
  );
}
