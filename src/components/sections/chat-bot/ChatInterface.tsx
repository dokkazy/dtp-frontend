"use client";

import type React from "react";

import { type FormEvent, useRef, useEffect, useState } from "react";
import {
  Send,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { Message } from "@/stores/chatStore";
import { chatApiRequest } from "@/apiRequests/chat";

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
  isFullPage: boolean;
  onExpand: () => void;
  onClose: () => void;
  expandLabel: string;
  resetChat?: () => void;
}

export default function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  isFullPage,
  onExpand,
  onClose,
  expandLabel,
  resetChat,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleResetChat = () => {
    if (!resetChat) return;
    setShowResetConfirmation(true);
  };

  const confirmReset = async () => {
    if (resetChat) {
      resetChat();
    }
    setShowResetConfirmation(false);
    try {
      await chatApiRequest.reset();
    } catch (error) {
      console.error("Error resetting chat:", error);
    }
  };

  const cancelReset = () => {
    setShowResetConfirmation(false);
  };

  return (
    <Card className="flex h-full flex-col rounded-none border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-3">
        <div className="font-semibold">Trợ lý AI</div>
        <div className="flex items-center gap-2">
          {resetChat && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              title="Reset Chat"
              onClick={handleResetChat}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onExpand}
          >
            {expandLabel === "Minimize" ? (
              <Minimize2 className="h-4 w-4" />
            ) : expandLabel === "Expand" ? (
              <Maximize2 className="h-4 w-4" />
            ) : expandLabel === "Open Full Chat" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
          {!isFullPage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onClose()}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-8">
              <div className="text-center text-muted-foreground">
                <p className="mb-2">Tôi có thể giúp gì cho bạn?</p>
                <p className="text-sm">Hãy hỏi tôi bất cứ thứ gì!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {showResetConfirmation && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                <div className="flex-1">
                  <h4 className="mb-2 font-medium text-yellow-800 dark:text-yellow-300">
                    Làm mới cuộc trò chuyện
                  </h4>
                  <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-400">
                    Làm mới sẽ xóa tất cả tin nhắn trong cuộc trò chuyện hiện
                    tại. Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={confirmReset}
                    >
                      Đồng ý
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelReset}>
                      Hủy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <div className="h-2 w-2 animate-ping rounded-full bg-primary" />
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="h-4 w-24 animate-pulse rounded bg-muted-foreground/20" />
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <CardFooter className="border-t p-3">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="core"
            size="icon"
            disabled={isLoading || input.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
