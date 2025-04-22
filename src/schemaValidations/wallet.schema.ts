import { z } from "zod";

export const WalletResSchema = z.object({
  userId: z.string(),
  balance: z.number(),
});

export const WithDrawSchema = z.object({
  amount: z.number().positive().min(100000, "Số tiền tối thiểu là 100,000 VNĐ"),
  otp: z
    .string()
    .min(6, "Mã OTP phải có ít nhất 6 ký tự")
    .max(10, "Mã OTP không vượt quá 10 ký tự"),
});



export type WalletResType = z.infer<typeof WalletResSchema>;
export type WithDrawType = z.infer<typeof WithDrawSchema>;
