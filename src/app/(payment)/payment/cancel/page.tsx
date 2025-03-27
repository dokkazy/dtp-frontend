"use client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/providers/CartProvider";
import Spinner from "@/components/common/Spinner";

export default function CancelPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { removePaymentItem } = useCartStore((state) => state);
  const cancel = searchParams.get("cancel");
  const isCheckoutProcessing = localStorage.getItem("isCheckoutProcessing");

  useEffect(() => {
    if (cancel === null) {
      router.push("/");
      return;
    }

    localStorage.removeItem("isCheckoutProcessing");
    localStorage.removeItem("paymentStartTime");
    localStorage.removeItem("checkoutUrl");

    document.cookie = "isCheckoutProcessing=; path=/; max-age=0";
    removePaymentItem(cancel as unknown as boolean);
  }, [removePaymentItem, router, cancel, isCheckoutProcessing]);

  if (cancel === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="text-core" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center py-10">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Đã hủy thanh toán</CardTitle>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="space-y-2 text-center">
            <p>Đơn hàng của bạn đã hủy thành công</p>
            <p className="text-sm text-muted-foreground">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với bộ phận hỗ trợ
              của chúng tôi.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-6">
          <Button asChild size="lg" variant="core">
            <Link href="/">Trở về trang chủ</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
