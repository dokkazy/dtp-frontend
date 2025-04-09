import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Message } from "@/stores/chatStore";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  // Function to format message content with line breaks
  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 text-sm",
        message.role === "user" ? "flex-row-reverse" : "",
      )}
    >
      <Avatar
        className={cn(
          "flex h-8 w-8 items-center justify-center",
          message.role === "user" ? "bg-core" : "bg-muted",
        )}
      >
        {message.role === "user" ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </Avatar>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2",
          message.role === "user"
            ? "bg-core text-primary-foreground"
            : "bg-muted",
        )}
      >
        {formatContent(message.content)}
      </div>
    </div>
  );
}
