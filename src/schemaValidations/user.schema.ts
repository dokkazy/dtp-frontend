import { z } from "zod";
export const userUpdateRequestSchema = z
  .object({
    id: z.string(),
    userName: z.string().min(2, {
      message: "Username phải có ít nhất 2 kí tự",
    }),
    name: z.string().min(1, {
      message: "Tên không được để trống",
    }),
    email: z.string().email({
      message: "Email không hợp lệ",
    }),
    phoneNumber: z
      .string()
      .regex(
        /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
        {
          message: "Số điện thoại không hợp lệ",
        },
      ),
    address: z.string(),
    roleName: z
      .enum(["Tourist"], {
        message: "Vai trò không hợp lệ",
      })
      .default("Tourist"),
  })
  .strict();

export type UserUpdateRequestType = z.infer<typeof userUpdateRequestSchema>;

export const userUpdateResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    error: z.array(z.string()).optional(),
  })
  .strict();

export type UserUpdateResponseType = z.TypeOf<typeof userUpdateResponseSchema>;
