import { z } from "zod";

export const loginSchema = z
  .object({
    userName: z.string().min(1, { message: "Username không được để trống" }),
    password: z
      .string()
      .min(1, { message: "Mật khẩu không được để trống" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" }),
  })
  .strict();

export type LoginSchemaType = z.TypeOf<typeof loginSchema>;

export const loginResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      tokenType: z.string(),
      accessToken: z.string(),
      expiresIn: z.number(),
      refreshToken: z.string(),
      role: z.enum(["Admin", "Operator", "Tourist", "Manager"]),
    }),
  })
  .strict();

export type LoginResponseSchemaType = z.TypeOf<typeof loginResponseSchema>;

// - Regular Expression: The string must contain at least one uppercase letter
//   (A-Z) and at least one special character from the set (!@#$%^&*(),.?":{}|<>).

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Tên không được để trống" }),
    address: z.string().min(1, { message: "Địa chỉ không được để trống" }),
    email: z.string().email("Email không hợp lệ"),
    userName: z.string(),
    phoneNumber: z
      .string()
      .regex(
        /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
        {
          message: "Số điện thoại không hợp lệ",
        },
      ),
    password: z
      .string()
      .min(1, { message: "Mật khẩu không được để trống" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" })
      .max(50, { message: "Mật khẩu không được quá 50 kí tự" })
      .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
        message:
          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa và một ký tự đặc biệt",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Xác nhận mật khẩu không được để trống" }),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
    return true;
  });

// Export the type derived from the register schema
export type RegisterSchemaType = z.TypeOf<typeof registerSchema>;

export const registerResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.boolean(),
    error: z.array(z.string()).optional(),
  })
  .strict();

export type RegisterResponseSchemaType = z.TypeOf<
  typeof registerResponseSchema
>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Mật khẩu không được để trống" })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" })
      .max(50, { message: "Mật khẩu không được quá 50 kí tự" })
      .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
        message:
          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa và một ký tự đặc biệt",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Xác nhận mật khẩu không được để trống" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
