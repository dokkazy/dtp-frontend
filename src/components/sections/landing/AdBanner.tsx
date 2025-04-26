// components/ads/AdBanner.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdBanner() {
  return (
    <section className="mx-auto mb-32 max-w-6xl px-4 sm:px-6 lg:px-8">
      <Card className="flex flex-col items-center justify-between gap-6 overflow-hidden bg-gradient-to-r from-blue-100 via-white to-blue-100 p-6 shadow-xl md:flex-row md:p-12">
        <Image
          src="/images/quynhonbanner.jpg" // bạn có thể thay bằng hình banner đối tác
          alt="ad banner"
          width={300}
          height={200}
          className="rounded-xl object-cover shadow-md"
        />
        <CardContent className="flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-2xl font-bold text-core md:text-3xl">
            Ưu đãi đặc biệt – Giảm đến 30%
          </h2>
          <p className="text-sm text-muted-foreground">
            Đặt tour hè này cùng đối tác TravelNow – nhận ưu đãi cực sốc!
          </p>
          <Button variant="core" asChild className="w-fit">
            <Link href="/deal-hot">Xem chi tiết</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
