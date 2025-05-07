import RatingFormModal from "@/components/modals/RatingFormModal";
import React from "react";

export default function RatingPage({ params }: { params: { id: string } }) {
  return <RatingFormModal id={params.id} isOpen={true} />;
}
