import AbortLayout from "@/app/(routes)/(manager)/AbortLayout";

export default function ManagerLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <AbortLayout>
      {children}
      {modal}
    </AbortLayout>
  );
}
