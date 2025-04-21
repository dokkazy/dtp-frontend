import { OrderStatus } from "@/types/order";
import { TicketKind } from "@/types/tours";
import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const isDateInPast = (dateString: string): boolean => {
  // Parse the DD-MM-YYYY format
  const [day, month, year] = dateString.split("-").map(Number);
  const itemDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of today for proper comparison

  return itemDate <= today;
};

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

export const formatDateToDDMMYYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatTime = (time: string | undefined) => {
  if (!time) return "";
  return time.substring(0, 5);
};

export const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = parseISO(dateString);
  return format(date, "HH:mm 'ngày' dd/MM/yyyy", { locale: vi });
};
