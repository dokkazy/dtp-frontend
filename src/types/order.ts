export enum OrderStatus {
  SUBMITTED = 0,
  AWAITING_PAYMENT = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  PAID = 4,
}
export interface OrderResponse {
  orderId: string;
  tourName: string;
  tourThumnail: string;
  tourDate: string;
  orderTickets: OrderTicket[];
  finalCost: number;
  status: OrderStatus;
}

export interface OrderTicket {
  code: string;
  ticketTypeId: string;
  quantity: number;
  grossCost: number;
  ticketKind: number;
}

export interface OrderRequest {
  tourScheduleId: string;
  name: string;
  phoneNumber: string;
  email: string;
  voucherCode: string;
  tickets: OrderTicketRequest[];
}

interface OrderTicketRequest {
  ticketTypeId: string;
  quantity: number;
}

export interface OrderDetailResponse {
  code: string;
  refCode: number;
  name: string;
  phoneNumber: string;
  email: string;
  tourName: string;
  tourThumnail: string;
  tourScheduleId: string;
  tourDate: string;
  orderDate: string;
  orderTickets: OrderTicket[];
  discountAmount: number;
  grossCost: number;
  netCost: number;
  status: OrderStatus;
  paymentLinkId: string;
}


