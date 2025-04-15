import { Metadata } from "next";
import ShoppingCart from "./ShoppingCart";

export const metadata:Metadata = {
  title: "Giỏ hàng"
}

export default function CartPage() {
  return (
    <ShoppingCart />
  )
}
