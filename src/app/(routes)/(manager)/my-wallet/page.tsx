import Wallet from "@/app/(routes)/(manager)/my-wallet/Wallet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ví của tôi",
  description: "Thông tin ví của bạn",
};

export default function WalletPage() {
  return <Wallet />;
}
