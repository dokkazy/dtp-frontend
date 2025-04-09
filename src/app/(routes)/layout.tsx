import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ChatBotSection from "@/components/sections/chat-bot";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ChatBotSection />
      {children}
      <Footer />
    </>
  );
}
