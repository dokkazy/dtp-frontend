/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Spinner from "@/components/common/loading/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserUpdateRequestType,
  userUpdateRequestSchema,
} from "@/schemaValidations/user.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/common/loading/LoadingButton";
import userApiRequest from "@/apiRequests/user";
import { Input } from "@/components/ui/input";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuthContext } from "@/providers/AuthProvider";

export default function Profile() {
  const { user, setUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isNavigating = useRef(false);



  const form = useForm<UserUpdateRequestType>({
    resolver: zodResolver(userUpdateRequestSchema),
    defaultValues: {
      id: user?.id || "",
      userName: user?.userName || "",
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      roleName: "Tourist",
    },
  });
  const formIsDirty = form.formState.isDirty;
  const resetFormState = () => {
    form.reset(form.getValues());
  };

  useEffect(() => {
    if (user) {
      form.reset({
        id: user.id || "",
        userName: user.userName || "",
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        roleName: "Tourist",
      });
    }
  }, [user, form]);

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

  if (!user) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="text-core" />
      </div>
    );
  }

  const onSubmit = async (values: UserUpdateRequestType) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await userApiRequest.updateMe(values);
      if (response?.payload?.success) {
        toast.success("Cập nhật thông tin thành công");
        // Update user in store
        const userResponse = await userApiRequest.me();
        if (userResponse?.payload?.success) {
          setUser(userResponse?.payload?.data);
        }
        router.refresh();
        resetFormState();
      } else {
        toast.error("Cập nhật thông tin thất bại");
      }
      setLoading(false);
    } catch (error: any) {
      handleErrorApi(error);
      console.log("Update error:", error);
      toast.error("Cập nhật thông tin thất bại");
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
              <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
              <p className="text-sm text-muted-foreground">
                Cập nhật thông tin cá nhân của bạn
              </p>
            </div>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
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
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
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
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={loading}>Lưu thay đổi</LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
