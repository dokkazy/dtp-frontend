"use client";

import { useState } from "react";
import { Clipboard, Loader2, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Voucher, VoucherList } from "@/types/order";
import { orderApiRequest } from "@/apiRequests/order";
import { formatPrice } from "@/lib/utils";
import { formatDateTime } from "@/lib/client/utils";

interface VoucherButtonProps {
  setVoucher: (voucher: Voucher | null) => void;
}

export default function VoucherButton({ setVoucher }: VoucherButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [vouchers, setVouchers] = useState<VoucherList>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVouchers = async () => {
    if (vouchers.length > 0) return; // Don't reload if we already have vouchers

    try {
      setIsLoading(true);
      const response = await orderApiRequest.getVouchers();
      console.log("Response:", response);
      if (response.status === 200) {
        console.log("Vouchers loaded successfully:", response.payload);
        setVouchers(response.payload);
        setError(null);
      } else {
        setError("Failed to load vouchers. Please try again later.");
      }
      // const data = await fetchVouchers();
      // setVouchers(data);
      // setError(null);
    } catch (err) {
      setError("Failed to load vouchers. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadVouchers();
    }
  };

  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleApply = () => {
    if (selectedVoucher) {
      setAppliedVoucher(selectedVoucher);
      setVoucher(selectedVoucher);
      setIsOpen(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucher(null);
    setSelectedVoucher(null);
  };

  const isAboutToExpire = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="space-y-4">
      {appliedVoucher ? (
        <div className="flex items-center gap-2 rounded-lg border bg-primary/5 p-3">
          <Ticket className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{appliedVoucher.code}</p>
            <p className="text-xs text-muted-foreground">
              Giảm lên đến {formatPrice(appliedVoucher.maxDiscountAmount)}
            </p>
          </div>
          <Badge variant="secondary" className="font-medium">
            {appliedVoucher.percent * 100}%
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveVoucher}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Xóa voucher</span>
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start py-8 sm:text-base"
          onClick={() => handleOpenChange(true)}
        >
          <Ticket className="mr-2 h-4 w-4" />
          Chọn mã giảm giá
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn một mã giảm giá</DialogTitle>
            <DialogDescription>
              Chọn một mã giảm giá để áp dụng cho đơn hàng của bạn
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">{error}</div>
          ) : vouchers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="flex flex-col items-center gap-2">
                <Ticket className="h-8 w-8" />
                Hiện tại không có mã giảm giá nào có sẵn
              </p>
            </div>
          ) : (
            <div className="grid max-h-[60vh] gap-3 overflow-y-auto py-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.code}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedVoucher?.code === voucher.code
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => handleVoucherSelect(voucher)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{voucher.code}</h3>
                        {isAboutToExpire(voucher.expiryDate) && (
                          <Badge variant="destructive" className="text-xs">
                            Sắp hết hạn
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {voucher.percent * 100}% giảm giá đến{" "}
                        {formatPrice(voucher.maxDiscountAmount)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Hết hạn: {formatDateTime(voucher.expiryDate)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        voucher.availableVoucher < 5 ? "destructive" : "core"
                      }
                    >
                      Còn {voucher.availableVoucher}
                    </Badge>
                  </div>
                  {selectedVoucher?.code === voucher.code && (
                    <div className="mt-2 rounded bg-muted p-2 text-xs">
                      <p>
                        Giảm giá tổng cộng:{" "}
                        {formatPrice(voucher.maxDiscountAmount)}
                      </p>
                      <p>
                        Còn: {voucher.availableVoucher}/{voucher.quantity}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Hủy
              </Button>
            </DialogClose>
            <Button
              variant="core"
              type="button"
              onClick={handleApply}
              disabled={!selectedVoucher || isLoading}
            >
              <Clipboard className="mr-2 h-4 w-4" />
              Áp dụng mã giảm giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
