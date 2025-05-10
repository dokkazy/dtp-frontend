import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { WithDrawType } from "@/schemaValidations/wallet.schema";

export const walletApiRequest = {
  getWallet: () => http.get(`${apiEndpoint.wallet}`, { cache: "no-store" }),
  getOtp: () => http.get(`${apiEndpoint.otp}`, { cache: "no-store" }),
  withdrawWithOTP: (body: WithDrawType) =>
    http.post(
      `${apiEndpoint.withdrawWithOtp}`,
      {
        amount: body.amount,
        bankAccountNumber: body.bankAccountNumber,
        bankName: body.bankName,
        bankAccount: body.bankAccount,
      },
      { headers: { "X-OTP": body.otp } },
    ),

  getTransaction: () => http.get(`${apiEndpoint.transaction}`, { cache: "no-store" }),
  
};
