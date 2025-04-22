import React from "react";
import { Metadata } from "next";

import OrderList from "./OrderList";

export const metadata: Metadata = {
  title: "Lịch trình của tôi",
  description: "Thông tin lịch trình của bạn",
};

export default function OrdersPage() {
  return (
   <OrderList/>
  );
}
