"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import {
  userChangePasswordRequestSchema,
  UserChangePasswordRequestType,
} from "@/schemaValidations/user.schema";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/common/loading/LoadingButton";
import { useLoadingOverlayStore } from "@/stores/loadingStore";
import userApiRequest from "@/apiRequests/user";
import { HttpError } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";

export default function ChangePassword() {
  const isNavigating = useRef(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const { isLoading, setLoading } = useLoadingOverlayStore((state) => state);
  const form = useForm<UserChangePasswordRequestType>({
    resolver: zodResolver(userChangePasswordRequestSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const formIsDirty = form.formState.isDirty;

  const oldPassword = form.watch("oldPassword");
  const newPassword = form.watch("newPassword");
  const confirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formIsDirty) {
        const message =
          "Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời đi không?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formIsDirty]);

  const showUnsavedChangesWarning = async (href: string) => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    const result = await Swal.fire({
      title: "Thay đổi chưa được lưu",
      text: "Bạn có thay đổi chưa được lưu. Nếu tiếp tục, những thay đổi này sẽ bị mất.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Tiếp tục rời đi",
      cancelButtonText: "Ở lại trang",
    });
    if (result.isConfirmed) {
      // User confirmed, proceed with navigation
      router.push = originalPush;
      originalPush.call(router, href);
    }
    isNavigating.current = false;
  };

  const originalPush = useRef(router.push).current;
  useEffect(() => {
    const currentPush = router.push;

    router.push = (href: string) => {
      if (formIsDirty && !isNavigating.current) {
        showUnsavedChangesWarning(href);
        return Promise.resolve(false);
      } else {
        return currentPush.call(router, href);
      }
    };

    // Cleanup function to reset router.push
    return () => {
      router.push = originalPush;
    };
  }, [formIsDirty, router, originalPush]);

  const onSubmit = async (values: UserChangePasswordRequestType) => {
    const { oldPassword, newPassword } = values;
    try {
      setLoading(true);
      const response = await userApiRequest.changePassword({
        oldPassword,
        newPassword,
      });
      if (response?.payload?.success) {
        toast.success("Thay đổi mật khẩu thành công");
        router.refresh();
        form.reset();
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof HttpError) {
        handleErrorApi(error);
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
      console.log("Change password error:", error);
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            noValidate
            className={"flex flex-col gap-6"}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Đổi mật khẩu</h1>
              <p className="text-sm text-muted-foreground">
                Thay đổi mật khẩu vui lòng nhập mật khẩu cũ và mật khẩu mới của
                bạn.
              </p>
            </div>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Mật khẩu cũ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={isLoading}
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        {oldPassword && (
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                          {...field}
                        />
                        {newPassword && (
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
                    <FormLabel className="font-semibold">
                      Xác nhận mật khẩu
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled={isLoading}
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

              <LoadingButton pending={form.formState.isSubmitting}>Lưu thay đổi</LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
