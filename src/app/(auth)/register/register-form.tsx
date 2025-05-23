"use client";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLayoutEffect, useState } from "react";

import { cn, handleErrorApi } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { links } from "@/configs/routes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  registerSchema,
  RegisterSchemaType,
} from "@/schemaValidations/auth.schema";
import LoadingButton from "@/components/common/loading/LoadingButton";
import authApiRequest from "@/apiRequests/auth";
import envConfig from "@/configs/envConfig";
import { HttpError } from "@/lib/http";
import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoadingOverlayStore } from "@/stores/loadingStore";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { isLoading, setLoading } = useLoadingOverlayStore((state) => state);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      userName: "",
      phoneNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [email] = useWatch({
    control: form.control,
    name: ["email"],
  });
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  useLayoutEffect(() => {
    const userName = email.split("@")[0];
    form.setValue("userName", userName);
  }, [email, form]);

  const onSubmit = async (values: RegisterSchemaType) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...SubmitData } = values;
    const data = {
      ...SubmitData,
      confirmUrl: `${envConfig.NEXT_PUBLIC_BASE_URL}${links.accountConfirm.href}`,
    };
    setLoading(true);
    try {
      const response = await authApiRequest.register(data);
      if (response.status === 200) {
        toast.success("Đăng ký thành công");
        setIsSuccess(true);
        // router.push(links.login.href);
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof HttpError) {
        handleErrorApi(error);
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-core">
            Kiểm tra email của bạn
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Chúng tôi đã gửi email đến <strong>{email}</strong> với liên kết để
            xác thực tài khoản của bạn.
          </p>
        </div>
        <div className="grid gap-6">
          <p className="text-center text-sm text-muted-foreground">
            Nếu không nhận được email, vui lòng kiểm tra thư mục spam hoặc thử
            lại.
          </p>
          <Button
            variant="core"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
          >
            Đăng ký lại
          </Button>
          <Button variant="outline" asChild>
            <Link href={links.login.href}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="relative">
        <form
          className={cn("flex flex-col gap-6", className)}
          {...props}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-core">Đăng ký</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-core">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-core">
                      Tên
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-core">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-core">
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-core">
                    Địa chỉ
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-core">
                    Mật khẩu
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                      {password && (
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-core">
                    Nhập lại mật khẩu
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                      {confirmPassword && (
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton pending={isLoading}>Đăng ký</LoadingButton>
            {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Hoặc tiếp tục với
              </span>
            </div>
            <Button variant="outline" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Đăng nhập bằng Google
            </Button> */}
          </div>
          <div className="text-center text-sm">
            Đã có tài khoản?{" "}
            <Link
              href={links.login.href}
              className="underline underline-offset-4"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </Form>
  );
}
