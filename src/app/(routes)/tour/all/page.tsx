import AllTour from "@/app/(routes)/tour/all/AllTour";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả tour du lịch",
  description: "Khám phá tất cả các tour du lịch tại Quy Nhơn, Bình Định",
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

export default function AllTourPage() {
  return <AllTour />;
}
