"use client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { links } from "@/configs/routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { getTicketKind } from "@/lib/utils";

interface CartSheetProps {
  openCart: boolean;
  setOpenCart: (open: boolean) => void;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export default function CartSheet({
  openCart,
  setOpenCart,
  children,
  side = "right",
}: CartSheetProps) {
  const { cart } = useCartStore((state) => state);
  return (
    <Sheet open={openCart} onOpenChange={setOpenCart}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={side} className="z-[9999992] w-full md:w-10/12">
        <div className="relative h-full w-full space-y-3">
          <div className="border-b p-2">
            <h1 className="text-lg font-semibold text-primary">
              Giỏ hàng của bạn
            </h1>
          </div>
          {cart.length === 0 ? (
            <div className="animate-fadeIn min-h-screen py-16 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="text-cart-secondary h-8 w-8" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-cart-secondary mb-6">
                Hãy chọn tour vào giỏ hàng để đặt tour nhé!
              </p>
              <Button
                onClick={() => setOpenCart(!openCart)}
                variant="core"
                className="w-full"
              >
                <Link href={links.tour.href}>Tiếp tục đặt tour</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[80%] px-4 py-2">
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div
                      key={item.tourScheduleId}
                      className="group flex items-center gap-4"
                    >
                      <div className="h-20 min-w-20 overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                        <Image
                          src={
                            item.tour.tour.imageUrls[0] ||
                            "/images/quynhonbanner.jpg"
                          }
                          alt={item.tour.tour.title || "Tour image"}
                          width={500}
                          height={500}
                          className="h-full w-full cursor-pointer object-center"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="line-clamp-2 text-base font-semibold">
                          {item.tour?.tour?.title}
                        </h3>

                        <p className="text-sm text-gray-600">{item.day}</p>
                        {item.tickets.map((ticket) => (
                          <p
                            key={ticket.ticketTypeId}
                            className="text-sm text-gray-600"
                          >
                            {getTicketKind(ticket.ticketKind)} x{" "}
                            {ticket.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="w-full">
                <Link href={links.shoppingCart.href}>
                  <Button
                    onClick={() => {
                      setOpenCart(!openCart);
                    }}
                    variant="core"
                    className="mb-2 w-full rounded-none p-8 text-lg"
                  >
                    Xem giỏ hàng
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
