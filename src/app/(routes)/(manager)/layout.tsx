import AbortLayout from "./AbortLayout";

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
