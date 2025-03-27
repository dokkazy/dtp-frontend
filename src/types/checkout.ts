export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  CANCELED = "CANCELED",
}

export interface PaymentResponse {
  accountNumber: string;
  amount: number;
  bin: string;
  checkoutUrl: string;
  currency: string;
  description: string;
  expiredAt: Date | null;
  orderCode: number;
  paymentLinkId: string;
  qrCode: string;
  status: PaymentStatus;
}

export interface PaymentRequest {
  bookingId: string;
  responseUrl: {
    returnUrl: string;
    cancelUrl: string;
  }
}


