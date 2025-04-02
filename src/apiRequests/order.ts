import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { PaymentRequest } from "@/types/checkout";
import { OrderRequest } from "@/types/order";

export const orderApiRequest = {
  getOrders: () =>
    http.get(apiEndpoint.order),
  order: (body: OrderRequest) => http.post(apiEndpoint.order, body),
  checkout: (body: PaymentRequest) => http.post(`${apiEndpoint.payment}`, body),
  getOrderDetail: (orderId: string) =>
    http.get(`${apiEndpoint.order}/${orderId}`),
};
