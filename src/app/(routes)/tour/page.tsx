import { Metadata } from "next";

import ExperienceSection from "@/components/sections/tour/ExperienceSection";
import NoteSection from "@/components/sections/tour/NoteSection";
import PopulationSection from "@/components/sections/tour/PopulationSection";
import ToursSection from "@/components/sections/tour/ToursSection";
import Banner from "@/components/common/Banner";

export const metadata: Metadata = {
  title: "Tour du lịch",
  description: "Khám phá các tour du lịch tại Quy Nhơn, Bình Định",
  keywords: [
    "tour du lịch",
    "tour du lịch Quy Nhơn",
    "tour du lịch Bình Định",
    "tour Quy Nhơn",
    "tour Bình Định",
    "du lịch Quy Nhơn",
    "du lịch Bình Định",
  ],
};

export default async function Tour() {
  return (
    <>
      <Banner title1="Tour du lịch" title2="Quy Nhơn" />
      {/* <CategorySection /> */}
      <PopulationSection />
      <ToursSection />
      <ExperienceSection />
      <NoteSection />
    </>
  );
}
