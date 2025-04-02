import { cookies } from "next/headers";
import React from "react";

import OrderList from "./OrderList";


export default async function OrdersPage() {
  return (
   <OrderList/>
  );
}
