import AbortLayout from "@/app/(routes)/(manager)/AbortLayout";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AbortLayout>{children}</AbortLayout>;
}
