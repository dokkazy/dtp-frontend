/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CheckCircle, CircleX } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

import authApiRequest from "@/apiRequests/auth";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { links } from "@/configs/routes";
import { HttpError } from "@/lib/http";

export default function AccountConfirm() {
  const params = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const confirmationToken = params.get("confirmationToken") || null;
  const hasFetch = useRef(false);

  useEffect(() => {
    if (!confirmationToken) {
      console.error("No confirmation token provided in URL.");
      router.push(links.home.href);
      return;
    }
    if (hasFetch.current) return;
    hasFetch.current = true;

    const decodedToken = decodeURIComponent(
      confirmationToken.replace(/ /g, "+"),
    );
    setLoading(true);
    const fetchConfirmation = async () => {
      try {
        await authApiRequest.confirmAccountFromNextClientToNextServer({
          confirmationToken: decodedToken,
        });
      } catch (error) {
        if (error instanceof HttpError) {
          setError(error.payload.message);
          toast.error(error.payload.message);
        } else {
          setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmation();
  }, [confirmationToken, router]);

  if (loading || !confirmationToken) {
    return (
      <div className="container mx-auto my-12">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-6 flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-core"></div>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-700">
            Đang xác thực tài khoản...
          </h2>
          <p className="text-center text-gray-500">
            Vui lòng đợi trong giây lát.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <CircleX className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">Lỗi</h1>
          <p className="text-balance text-sm text-muted-foreground">{error}</p>
          <Button variant="core" size="lg" className="text-lg" asChild>
            <Link href={links.home.href}>Về trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="mb-24 mt-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-core">
            Bạn đã xác thực tài khoản thành công
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Hãy đăng nhập ngay để trải nghiệm những điều tuyệt vời mà chúng tôi
            mang lại.
          </p>
          <Button variant="core" size="lg" className="text-lg" asChild>
            <Link href={links.login.href}>Đến trang đăng nhập</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
