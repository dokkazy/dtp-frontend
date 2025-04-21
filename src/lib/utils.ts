/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { TicketKind } from "@/types/tours";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProduction = () => process.env.NODE_ENV === "production";

//Remove first character of string if it is "/"
// For example: "/abc" => "abc", "abc" => "abc"
export function nomalizePath(path: string) {
  return path.startsWith("/") ? path.slice(1) : path;
}

export function handleErrorApi(
  error: any,
  setError?: UseFormSetError<any>,
  duration?: number,
) {
  if (error instanceof EntityError) {
    error.payload.error.forEach((err) => toast.error(err));
  }
}

export const formatPrice = (price: number | undefined) => {
  if (price == undefined || typeof price == "string") return "0";
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const getTicketKind = (ticketKind: TicketKind) => {
  switch (ticketKind) {
    case TicketKind.Adult:
      return "Người lớn";
    case TicketKind.Child:
      return "Trẻ em";
    case TicketKind.PerGroupOfThree:
      return "Nhóm 3 người";
    case TicketKind.PerGroupOfFive:
      return "Nhóm 5 người";
    case TicketKind.PerGroupOfSeven:
      return "Nhóm 7 người";
    case TicketKind.PerGroupOfTen:
      return "Nhóm 10 người";
    default:
      return "Loại vé không hợp lệ";
  }
};



export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function isSupportLocalStorage() {
  if (typeof localStorage === "undefined") return false;
  return true;
}

export function isExceedSizeStorage(error: any) {
  if (error.name === "QuotaExceededError") {
    const errorMessage =
      "Lỗi: Dung lượng bộ nhớ đã vượt quá giới hạn cho phép. Vui lòng xóa bớt dữ liệu trong bộ nhớ.";
    console.error(errorMessage);
  }
}
