import { z } from "zod";

export const WalletResSchema = z.object({
  userId: z.string(),
  balance: z.number(),
});

export const WithDrawSchema = z.object({
  amount: z.number().positive().min(5000, "Số tiền tối thiểu là 5,000 VNĐ"),
  otp: z
    .string()
    .min(6, "Mã OTP phải có ít nhất 6 ký tự")
    .max(10, "Mã OTP không vượt quá 10 ký tự"),
  bankAccountNumber: z.string({
    required_error: "Số tài khoản ngân hàng không được để trống",
  }),
  bankName: z.string({
    required_error: "Tên ngân hàng không được để trống",
  }),
  bankAccount: z.string({
    required_error: "Tên chủ tài khoản không được để trống",
  }),
});

export type WalletResType = z.infer<typeof WalletResSchema>;
export type WithDrawType = z.infer<typeof WithDrawSchema>;
