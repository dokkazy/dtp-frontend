"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { walletApiRequest } from "@/apiRequests/wallet";
import { WithDrawSchema } from "@/schemaValidations/wallet.schema";
import { formatPrice } from "@/lib/client/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface WalletWithdrawSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onWithdrawComplete: () => void;
}

export function WalletWithdrawSheet({
  open,
  onOpenChange,
  currentBalance,
  onWithdrawComplete,
}: WalletWithdrawSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof WithDrawSchema>>({
    resolver: zodResolver(WithDrawSchema),
    defaultValues: {
      amount: 100000,
      otp: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof WithDrawSchema>) => {
    if (data.amount > currentBalance) {
      form.setError("amount", {
        type: "manual",
        message: "Số tiền rút không được vượt quá số dư hiện tại",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Using the withdrawWithOTP function that accepts OTP
      const response = await walletApiRequest.withdrawWithOTP(data);
      if (response.status === 200) {
        toast.success("Yêu cầu rút tiền thành công");
        onOpenChange(false);
        form.reset();
        onWithdrawComplete();
      } else {
        throw new Error("Rút tiền thất bại");
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast.error("Không thể rút tiền. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sheet close
  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="top" className="z-[9999992] w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Rút tiền</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <div className="space-y-4 py-2">
              <div className="mb-4 rounded-md bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">Số dư hiện tại</p>
                <p className="text-xl font-semibold">
                  {formatPrice(currentBalance)}
                </p>
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền muốn rút</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số tiền"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Số tiền tối thiểu là 100,000 VNĐ
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã OTP</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập mã OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-center sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>
              <Button
                variant="core"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
