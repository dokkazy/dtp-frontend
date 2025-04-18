import { Metadata } from "next";
import TourMap from "./TourMap";
import React from "react";

export const metadata: Metadata = {
  title: "Bản đồ vị trí tour",
}

export default function MapPage() {
  return <TourMap />;
}
