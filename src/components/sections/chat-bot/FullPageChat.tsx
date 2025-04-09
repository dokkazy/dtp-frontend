"use client";
import React from "react";

import ChatInterface from "./ChatInterface";
import { useRouter } from "next/navigation";
import { links } from "@/configs/routes";
import { useChatStore } from "@/stores/chatStore";

export function FullPageChat() {
  const router = useRouter();
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };
  const handleClose = () => {
    router.push(links.tour.href);
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[url(/images/quynhonbanner.jpg)] bg-cover bg-center p-4">
      <div className="h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl border bg-background/95 shadow-2xl backdrop-blur-sm">
        <ChatInterface
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          isFullPage={true}
          onExpand={() => {}}
          onClose={handleClose}
          expandLabel="Close"
          resetChat={resetChat}
        />
      </div>
    </div>
  );
}
