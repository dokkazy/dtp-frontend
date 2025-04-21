import { Metadata } from "next";
import dynamic from "next/dynamic";

import HeroSection from "@/components/sections/landing/HeroSection";
import BookNextTourSection from "@/components/sections/landing/BookNextTourSection";
import { ActivityCardSkeleton } from "@/components/cards/activity-card-skeleton";
const ChoosingSection = dynamic(
  () => import("@/components/sections/landing/ChoosingSection"),
  { ssr: false },
);
const GallerySection = dynamic(
  () => import("@/components/sections/landing/GallerySection"),
  { ssr: false },
);
const SubscribeSection = dynamic(
  () => import("@/components/sections/landing/SubscribeSection"),
  { ssr: false },
);
const ActivitySection = dynamic(
  () => import("@/components/sections/landing/ActivitySection"),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto mb-16 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
        {/* Title skeleton */}
        <div className="flex gap-2 lg:gap-4">
          <div className="h-10 w-40 animate-pulse rounded bg-gray-200 md:h-12 md:w-48 lg:h-16 lg:w-60"></div>
          <div className="h-10 w-28 animate-pulse rounded bg-gray-200 md:h-12 md:w-32 lg:h-16 lg:w-40"></div>
        </div>

        {/* Cards skeleton grid */}
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-24">
          <ActivityCardSkeleton />
          <ActivityCardSkeleton />
          <ActivityCardSkeleton />
        </div>
      </section>
    ),
  },
);

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default function Home() {
  return (
    <div className="pb-6 sm:pb-8 lg:pb-12">
      <HeroSection />
      <ChoosingSection />
      <ActivitySection />
      <BookNextTourSection />
      <GallerySection />
      <SubscribeSection />
    </div>
  );
}
