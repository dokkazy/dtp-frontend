"use client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { orderApiRequest } from "@/apiRequests/order";
import { toast } from "sonner";
import { HttpError } from "@/lib/http";

export default function CancelPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { removePaymentItem, clearDirectCheckoutItem } = useCartStore(
    (state) => state,
  );
  const cancel = searchParams.get("cancel");
  const paymentId = searchParams.get("id");
  const hasCanceledRef = useRef(false);

  const cancelPayment = useCallback(async (paymentId: string) => {
    if (hasCanceledRef.current) return;
    try {
      const response = await orderApiRequest.cancelPayment(paymentId);
      if (response.status !== 204) {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      }
      toast.success("Hủy thanh toán thành công.");
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.payload.message);
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      hasCanceledRef.current = true;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cancel === null || paymentId === null) {
      router.push("/");
      return;
    }
    cancelPayment(paymentId);
    localStorage.removeItem("paymentStartTime");

    removePaymentItem(cancel as unknown as boolean);
    clearDirectCheckoutItem();
  }, [
    removePaymentItem,
    router,
    cancel,
    clearDirectCheckoutItem,
    paymentId,
    cancelPayment,
  ]);

  if (loading || cancel === null) {
    return (
      <div className="container mx-auto my-12">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="mb-6 flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-core"></div>
          </div>
          <p className="text-center text-gray-500">
            Vui lòng đợi trong giây lát
          </p>
        </div>
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
            <p>Hủy đặt tour thành công</p>
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
