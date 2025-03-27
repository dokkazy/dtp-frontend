"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CircleX, ShoppingCart } from "lucide-react";

import { links } from "@/configs/routes";
import MobileHeader from "@/components/common/Header/MobileHeader";
import { cn, getTicketKind } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sessionToken } from "@/lib/http";
import AuthMenu from "@/components/common/Header/AuthMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/providers/CartProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSyncCartAcrossTabs } from "@/hooks/useSyncCartAcrossTabs";

export default function Header() {
  const pathname = usePathname();
  const navLinks = [links.home, links.tour, links.blog, links.about];
  const specialLinks = [links.tour.href, links.blog.href, links.about.href];
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCartStore((state) => state);
  const [openCart, setOpenCart] = useState(false);
  useSyncCartAcrossTabs();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "header",
          `fixed left-0 right-0 top-0 z-[999999] block transition-all duration-300 max-lg:hidden`,
          `${scrolled ? "bg-background/80 shadow-sm backdrop-blur-md" : "bg-transparent"}`,
        )}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between p-4 sm:px-6 md:max-w-4xl lg:max-w-6xl">
          <Link className="min-w-fit" href={links.home.href}>
            <Image
              width={400}
              height={400}
              src="/images/binhdinhtour3.png"
              alt="logo"
              priority
              className="h-10 w-auto object-cover"
            />
          </Link>
          <nav className="flex items-center justify-start gap-2 lg:gap-14">
            {navLinks.map((link, index) => (
              <div key={index}>
                {pathname === link.href ? (
                  <Link
                    href={link.href}
                    className={cn(
                      "relative font-bold transition-colors md:text-sm lg:text-base",
                      `${
                        specialLinks.includes(pathname)
                          ? !scrolled
                            ? "text-white"
                            : "text-black"
                          : "text-black hover:opacity-70"
                      }`,
                    )}
                  >
                    {link.label}
                    <motion.span
                      layoutId="underline"
                      className={cn(
                        "absolute bottom-0 left-0 h-0.5 w-full",
                        `bg-${specialLinks.includes(pathname) ? (scrolled ? "black" : "white") : "black"}`,
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  </Link>
                ) : (
                  <Link
                    prefetch
                    href={link.href}
                    className={cn(
                      `font-bold transition-colors md:text-sm lg:text-base`,
                      `${specialLinks.includes(pathname) ? (!scrolled ? "text-gray-200" : "text-gray-800") : "text-gray-800"}`,
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          {sessionToken.value ? (
            <div className="flex items-center gap-4">
              <AuthMenu>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </AuthMenu>
              <Sheet open={openCart} onOpenChange={setOpenCart}>
                <SheetTrigger asChild>
                  <Button
                    onClick={() => setOpenCart(!openCart)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      `${specialLinks?.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white") : ""}`,
                      "md:text-sm lg:text-base",
                      `${specialLinks?.includes(pathname) ? "bg-transparent" : ""}`,
                      "sm:text-base",
                    )}
                  >
                    <ShoppingCart />
                  </Button>
                </SheetTrigger>
                <SheetContent className="z-[9999992] w-full md:w-10/12">
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
                                    src={"/images/eo-gio.jpg"}
                                    alt="Empty search"
                                    width={500}
                                    height={500}
                                    className="h-full w-full cursor-pointer object-center"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <h3 className="line-clamp-2 text-base font-semibold">
                                    {item.tour.tour.title}
                                  </h3>

                                  <p className="text-sm text-gray-600">
                                    {item.day}
                                  </p>
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
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant={specialLinks.includes(pathname) ? "outline" : "core"}
                className={cn(
                  "md:text-sm lg:text-base",
                  `${specialLinks.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white") : ""}`,
                  `${specialLinks.includes(pathname) ? "bg-transparent" : ""}`,
                )}
              >
                <Link href={links.login.href}>{links.login.label}</Link>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  `${specialLinks.includes(pathname) ? (scrolled ? "border-black text-black" : "text-white") : "border-2 border-black text-black"}`,
                  "bg-transparent text-base md:text-sm",
                )}
              >
                <Link href={links.register.href}>{links.register.label}</Link>
              </Button>
            </div>
          )}
        </div>
      </header>
      <MobileHeader scrolled={scrolled} specialLinks={specialLinks} />
    </>
  );
}
