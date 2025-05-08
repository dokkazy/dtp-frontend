"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Image from "next/image";

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
import {
  WithDrawSchema,
  WithDrawType,
} from "@/schemaValidations/wallet.schema";
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
import envConfig from "@/configs/envConfig";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface WalletWithdrawSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onWithdrawComplete: () => void;
}

interface Bank {
  id: number;
  name: string;
  shortName: string;
  logo: string;
}

export function WalletWithdrawSheet({
  open,
  onOpenChange,
  currentBalance,
  onWithdrawComplete,
}: WalletWithdrawSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankList, setBankList] = useState<Bank[]>([]);
  const savedFormValues = useRef<Partial<WithDrawType> | null>(null);
  const form = useForm<WithDrawType>({
    resolver: zodResolver(WithDrawSchema),
    defaultValues: {
      amount: 100000,
      bankAccountNumber: "",
      bankAccount: "",
      otp: "",
    },
  });

 // Restore saved values when sheet opens
 useEffect(() => {
  if (open && savedFormValues.current) {
    // When opening the sheet, restore the saved values
    const values = savedFormValues.current;
    Object.keys(values).forEach((key) => {
      if (values[key as keyof WithDrawType] !== undefined) {
        const value = values[key as keyof WithDrawType];
        if (value !== undefined) {
          form.setValue(key as keyof WithDrawType, value, {
            shouldDirty: true,
            shouldValidate: false,
          });
        }
      }
    });
  }
}, [open, form]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(envConfig.NEXT_PUBLIC_API_BANKS);
        if (!response.ok) {
          throw new Error("Failed to fetch banks");
        }
        const payload = await response.json();
        console.log("Banks data:", payload);
        if (payload && payload.data && Array.isArray(payload.data)) {
          setBankList(payload.data);
          console.log(`Successfully loaded ${payload.data.length} banks`);
        } else {
          console.error("Unexpected bank data format:", payload);
          setBankList([]);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
        setBankList([]);
      }
    };
    fetchBanks();
  }, []);

  // Handle form submission
  const onSubmit = async (data: WithDrawType) => {
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
        savedFormValues.current = null;
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
  // Modified sheet close handler
  const handleClose = (isOpen: boolean) => {
    if (!isOpen && !isSubmitting) {
      // Save current form values before closing
      savedFormValues.current = form.getValues();

      // Don't reset the form, just close the sheet
      onOpenChange(false);
    }
  };
  // Handle sheet close
  const handleCancel = () => {
    if (!isSubmitting) {
      savedFormValues.current = form.getValues();
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full overflow-y-auto">
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
                name="bankName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngân hàng</FormLabel>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              <div className="flex items-center">
                                {bankList.find(
                                  (bank: Bank) =>
                                    bank.shortName === field.value,
                                ) && (
                                  <>
                                    <Image
                                      width={20}
                                      height={20}
                                      src={
                                        bankList.find(
                                          (bank: Bank) =>
                                            bank.shortName === field.value,
                                        )?.logo || '/images/binhdinhtou3.png'
                                      }
                                      alt={field.value}
                                      className="mr-2 h-5 w-5 object-contain"
                                    />
                                    <span>
                                      {
                                        bankList.find(
                                          (bank: Bank) =>
                                            bank.shortName === field.value,
                                        )?.shortName
                                      }
                                    </span>
                                  </>
                                )}
                              </div>
                            ) : (
                              "Chọn ngân hàng"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command className="overflow-visible">
                            <CommandInput
                              placeholder="Tìm kiếm ngân hàng..."
                              className="h-9"
                            />
                            <CommandList className="max-h-[300px]">
                              <CommandEmpty>
                                Không tìm thấy ngân hàng phù hợp.
                              </CommandEmpty>
                              <CommandGroup>
                                {bankList.map((bank: Bank) => (
                                  <CommandItem
                                    value={bank.shortName}
                                    key={bank.id}
                                    onSelect={() => {
                                      form.setValue("bankName", bank.shortName);
                                    }}
                                    className="flex items-center"
                                  >
                                    <Image
                                      width={20}
                                      height={20}
                                      src={bank.logo || '/images/binhdinhtou3.png'}
                                      alt={bank.shortName}
                                      className="mr-2 h-5 w-5 object-contain"
                                    />
                                    <span className="flex-1 truncate">
                                      {bank.name}
                                    </span>
                                    <span className="ml-1 text-xs text-muted-foreground">
                                      ({bank.shortName})
                                    </span>
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        bank.shortName === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormControl>
                        <input {...field} className="sr-only" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>STK Ngân hàng</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập STK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chủ tài khoản</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên chủ tài khoản"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tên chủ tài khoản phải ghi hoa không dấu
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
                onClick={handleCancel}
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
