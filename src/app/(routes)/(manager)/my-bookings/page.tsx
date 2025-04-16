import React from "react";

import OrderList from "./OrderList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn hàng",
  description: "Thông tin đơn hàng của bạn",
};

export default function OrdersPage() {
  return (
   <OrderList/>
  );
}
