"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/common/loading/Spinner";

export default function ProcessCheckoutPage() {
  const router = useRouter();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [paymentTimeout, setPaymentTimeout] = useState(false);

  useEffect(() => {
    const paymentStartTime = localStorage.getItem("paymentStartTime");
    const startTime = paymentStartTime
      ? parseInt(paymentStartTime)
      : Date.now();

    // Kiểm tra nếu còn URL thanh toán
    const checkoutUrl = localStorage.getItem("checkoutUrl");
    if (checkoutUrl) {
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 3000);
      return;
    } else {
      // Nếu không có URL thanh toán, xóa cookie và localStorage
      localStorage.removeItem("isCheckoutProcessing");
      localStorage.removeItem("paymentStartTime");
      localStorage.removeItem("checkoutUrl");
      document.cookie = "isCheckoutProcessing=; path=/; max-age=0";
      router.push("/");
    }

    // Cập nhật thời gian đã trôi qua
    const intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsed);

      // Nếu quá 30 phút (1800 giây), hiển thị thông báo timeout
      if (elapsed > 600) {
        setPaymentTimeout(true);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [router]);

  // Hủy quá trình thanh toán
  const cancelPayment = () => {
    localStorage.removeItem("isCheckoutProcessing");
    localStorage.removeItem("paymentStartTime");
    localStorage.removeItem("checkoutUrl");
    document.cookie = "isCheckoutProcessing=; path=/; max-age=0";
    router.push("/");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-core">
          {paymentTimeout
            ? "Quá thời gian thanh toán"
            : "Đang xử lý thanh toán"}
        </h1>

        {!paymentTimeout ? (
          <>
            <div className="mb-6 flex justify-center">
              <Spinner className="h-16 w-16 text-core" />
            </div>

            <p className="mb-4 text-center text-gray-600">
              Thanh toán của bạn đang được xử lý.
              <br />
              Vui lòng không đóng cửa sổ trình duyệt.
            </p>

            <p className="mb-6 text-center text-sm text-gray-500">
              Thời gian đã trôi qua: {Math.floor(timeElapsed / 60)}:
              {(timeElapsed % 60).toString().padStart(2, "0")}
            </p>

            {/* <div className="flex justify-center">
              <button 
                onClick={cancelPayment}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Hủy thanh toán
              </button>
            </div> */}
          </>
        ) : (
          <>
            <p className="mb-6 text-center text-gray-600">
              Quá trình thanh toán đã vượt quá thời gian cho phép.
              <br />
              Vui lòng thử lại sau.
            </p>

            <div className="flex justify-center">
              <button
                onClick={cancelPayment}
                className="rounded-md bg-core px-4 py-2 text-sm font-medium text-white hover:bg-core/90"
              >
                Quay lại trang chủ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
