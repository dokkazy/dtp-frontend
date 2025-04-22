import { Metadata } from "next";
import ReviewList from "./ReviewList";

export const metadata: Metadata = {
  title: "Đánh giá của tôi",
  description: "Thông tin ví của bạn",
};

export default function ReviewPage() {
  return <ReviewList />;
}
