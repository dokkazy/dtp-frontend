"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { walletApiRequest } from "@/apiRequests/wallet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OtpSetupModal() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpQrData, setOtpQrData] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  // Close modal and return to previous page
  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
    setOpen(open);
  };

  const fetchOtpQr = async () => {
    setIsLoading(true);
    try {
      const res = await walletApiRequest.getOtp();
      if (res.status !== 200) {
        throw new Error("Failed to fetch OTP QR data");
      }
      const data = await res.payload.message;
      setOtpQrData(data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải mã QR xác thực. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOtpQr();
  }, []);

  const handleRefresh = () => {
    fetchOtpQr();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Thiết lập xác thực OTP
          </DialogTitle>
          <DialogDescription>
            Quét mã QR với ứng dụng xác thực của bạn để bảo mật tài khoản
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Đang tải mã QR...
              </span>
            </div>
          ) : otpQrData ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-md border">
                  <Image
                    src={otpQrData}
                    alt="QR Code for authenticator app"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
              </div>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Thông tin quan trọng</AlertTitle>
                <AlertDescription>
                  <p className="mt-2">
                    Quét mã QR với Google Authenticator, Microsoft Authenticator
                    hoặc ứng dụng xác thực tương tự.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <p>Không có dữ liệu mã QR</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleRefresh}
              >
                Thử lại
              </Button>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              className="mr-2 flex-1"
              onClick={() => router.back()}
            >
              Đóng
            </Button>
            <Button
              variant="outline"
              className="ml-2 flex-1"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Tạo lại mã QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
