/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { TicketKind } from "@/types/tours";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { OrderStatus } from "@/types/order";

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

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
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

export const getOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.SUBMITTED:
      return "Đã tạo";
    case OrderStatus.AWAITING_PAYMENT:
      return "Chờ thanh toán";
    case OrderStatus.COMPLETED:
      return "Đã hoàn thành";
    case OrderStatus.CANCELLED:
      return "Đã hủy";
    case OrderStatus.PAID:
      return "Đã thanh toán";
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

export const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = parseISO(dateString);
  return format(date, "HH:mm 'ngày' dd/MM/yyyy", { locale: vi });
};

export const formatTime = (time: string | undefined) => {
  if (!time) return "";
  return time.substring(0, 5);
};

export const formatDateToDDMMYYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const isDateInPast = (dateString: string): boolean => {
  // Parse the DD-MM-YYYY format
  const [day, month, year] = dateString.split("-").map(Number);
  const itemDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of today for proper comparison

  return itemDate <= today;
};

export function decodeJwtTokenOnBrowser(token: string) {
  try {
    if (!token) return null;

    // Split the token
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Get payload
    const payload = parts[1];

    // Convert base64url to base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding
    const pad = base64.length % 4;
    const paddedBase64 = pad === 0 ? base64 : base64 + "=".repeat(4 - pad);

    // Decode base64
    const decoded = atob(paddedBase64);

    // Parse JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function decodeJwtToken(token: string) {
  try {
    // JWT cấu trúc: header.payload.signature
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    // Decode base64url
    const payloadBuffer = Buffer.from(base64Payload, "base64url");
    const decodedPayload = JSON.parse(payloadBuffer.toString("utf8"));
    return decodedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function getExpirationDateFromToken(token: string): string | null {
  const decodedToken = decodeJwtToken(token);
  if (!decodedToken || !decodedToken.exp) return null;

  // JWT exp là timestamp tính bằng giây
  const expirationDate = new Date(decodedToken.exp * 1000);
  return expirationDate.toUTCString();
}

export function getMaxAgeFromToken(token: string): number {
  const decodedToken = decodeJwtToken(token);
  if (!decodedToken || !decodedToken.exp) return 7200; // Default fallback

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return Math.max(0, decodedToken.exp - nowInSeconds);
}

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
