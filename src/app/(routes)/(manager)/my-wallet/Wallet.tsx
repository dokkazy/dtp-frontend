"use client";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDownIcon, Loader2, LockIcon, RefreshCcw } from "lucide-react";

import { walletApiRequest } from "@/apiRequests/wallet";
import { formatPrice } from "@/lib/client/utils";
import { WalletResType } from "@/schemaValidations/wallet.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletWithdrawSheet } from "./wallet-withdaw-sheet";
import { HttpError } from "@/lib/http";
import { links } from "@/configs/routes";

export default function Wallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletResType | undefined>(undefined);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWallet = async (showToast = false) => {
    setIsLoading(true);
    setIsRefreshing(true);
    try {
      const res = await walletApiRequest.getWallet();
      if (res.status !== 200) {
        throw new Error("Failed to fetch wallet data");
      }
      const data = await res.payload;
      setWallet(data);
      if (showToast) {
        toast.success("Đã cập nhật thông tin ví");
      }
    } catch (error) {
      if (error instanceof HttpError) {
        toast.error(error.message);
        toast.error("Không thể tải thông tin ví");
      } else {
        toast.error("Đã có lỗi xảy ra trong quá trình tải dữ liệu");
      }
      setWallet(undefined);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleRefresh = () => {
    fetchWallet(true);
  };

  const handleWithdraw = () => {
    if (!wallet || wallet.balance <= 0) {
      toast.error("Số dư không đủ để thực hiện giao dịch");
      return;
    }

    setWithdrawDialogOpen(true);
  };

  const handleWithdrawComplete = () => {
    // Refresh wallet data after successful withdrawal
    fetchWallet();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Ví của tôi</CardTitle>
            <CardDescription className="font-semibold">
              Quản lý số dư và rút tiền
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Làm mới"
          >
            <RefreshCcw
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && !isRefreshing ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Đang tải...</span>
            </div>
          ) : wallet ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center rounded-lg border bg-muted/30 p-6">
                <p className="mb-1 text-sm text-muted-foreground">
                  Số dư hiện tại
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(wallet.balance)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
              <p>Không có dữ liệu</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fetchWallet()}
              >
                Tải lại
              </Button>
            </div>
          )}
        </CardContent>
        {wallet && wallet.balance > 0 && (
          <CardFooter>
            <Button variant="core" className="w-full" onClick={handleWithdraw}>
              <ArrowDownIcon className="mr-2 h-4 w-4" />
              Rút tiền
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Thiết lập xác thực OTP</CardTitle>
            <CardDescription>
              Thiết lập xác thực OTP để bảo vệ giao dịch
            </CardDescription>
          </div>
          <LockIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Thiết lập xác thực OTP sẽ giúp bảo vệ giao dịch của bạn. Mỗi khi rút
            tiền, bạn sẽ cần nhập mã xác thực từ ứng dụng.
          </p>
        </CardContent>
        <CardFooter>
          <Link href={`${links.otpQrSetup.href}`} className="w-full">
            <Button className="w-full" variant="outline">
              Thiết lập xác thực OTP
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {wallet && (
        <WalletWithdrawSheet
          open={withdrawDialogOpen}
          onOpenChange={setWithdrawDialogOpen}
          currentBalance={wallet.balance}
          onWithdrawComplete={handleWithdrawComplete}
        />
      )}
    </div>
  );
}
