import { FullPageChat } from "@/components/sections/chat-bot/FullPageChat";

export const dynamic = "force-static";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <FullPageChat />
    </div>
  );
}
