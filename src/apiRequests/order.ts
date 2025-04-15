import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { PaymentRequest } from "@/types/checkout";
import { OrderRequest } from "@/types/order";

export const orderApiRequest = {
  getOrders: () => http.get(apiEndpoint.order, { cache: "no-store" }),
  order: (body: OrderRequest) => http.post(apiEndpoint.order, body),
  checkout: (body: PaymentRequest) => http.post(`${apiEndpoint.payment}`, body),
  getOrderDetail: (orderId: string, sessionToken?: string) =>
    http.get(
      `${apiEndpoint.order}/${orderId}`,
      sessionToken
        ? {
            headers: { Authorization: `Bearer ${sessionToken}` },
          }
        : {},
    ),
  getOrderDetailClient: (orderId: string) =>
    http.get(`${apiEndpoint.order}/${orderId}`, { cache: "no-store" }),

  cancelPayment: (paymentId: string) =>
    http.put(`${apiEndpoint.payment}/${paymentId}`, {}),
  cancelPaymentByOrderId: (orderId: string) =>
    http.put(`${apiEndpoint.order}/${orderId}`, ""),
};
