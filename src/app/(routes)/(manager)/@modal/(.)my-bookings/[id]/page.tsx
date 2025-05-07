import OrderDetailModal from "@/components/modals/OrderDetailModal";
import React from "react";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <OrderDetailModal id={params.id} isOpen={true}/>;
}
