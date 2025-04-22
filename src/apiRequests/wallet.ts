import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";

export const walletApiRequest = {
  getWallet: () => http.get(`${apiEndpoint.wallet}`, { cache: "no-store" }),
  getOtp: () => http.get(`${apiEndpoint.otp}`, { cache: "no-store" }),
  withdrawWithOTP: (body: { amount: number; otp: string }) =>
    http.post(
      `${apiEndpoint.withdrawWithOtp}`,
      { amount: body.amount },
      { headers: { "X-OTP": body.otp } },
    ),
};
