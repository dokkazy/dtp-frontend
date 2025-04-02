"use client";
import React from "react";
import Link from "next/link";
import {
  MessageSquareText,
  Package,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { links } from "@/configs/routes";
import { useAuthContext } from "@/providers/AuthProvider";

export default function Sidebar() {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const sidebarLinks = [
    {
      label: "Thông tin cá nhân",
      icon: User,
      href: links.profile.href,
    },
    {
      label: links.orders.label,
      icon: Package,
      href: links.orders.href,
    },
    {
      label: links.review.label,
      icon: MessageSquareText,
      href: links.review.href,
    },
    {
      label: "Cài đặt tài khoản",
      icon: Settings,
      href: `/account`,
    },
    {
      label: "Chính sách bảo mật",
      icon: Shield,
      href: `/privacy`,
    },
  ];

  return (
    <Card className="sticky top-20">
      <CardHeader className="items-center text-center">
        {!user ? (
          <>
            <Skeleton className="mb-4 h-24 w-24 rounded-full" />
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </>
        ) : (
          <>
            <Avatar className="mb-4 h-24 w-24">
              {/* Placeholder for profile picture */}
              <AvatarImage src={undefined} alt={user?.name} />
              <AvatarFallback className="text-3xl">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user?.userName}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1">
          {sidebarLinks.map((link, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start ${pathname === link.href ? "bg-muted" : ""}`}
              asChild
            >
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
