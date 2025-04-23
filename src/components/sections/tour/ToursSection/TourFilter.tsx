"use client";
import React, { useEffect, useState } from "react";
import { CalendarIcon, WalletCards } from "lucide-react";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTourFilterStore from "@/stores/tourFilterStore";
import { TourSortBy } from "@/types/tours";

interface TourFilterProps {
  tourCount: number;
  onApplyFilter: (page: number) => void;
}

export default function TourFilter({
  tourCount,
  onApplyFilter,
}: TourFilterProps) {
  const {
    priceRange,
    selectedDate,
    isDateFilterActive,
    isPriceFilterActive,
    maxPossiblePrice,
    setSelectedDate,
    setIsDateFilterActive,
    setPriceRange,
    setIsPriceFilterActive,
    setSortBy,
  } = useTourFilterStore((state) => state);
  const [values, setValues] = useState<[number, number]>(priceRange);
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  useEffect(() => {
    // Chỉ cập nhật values khi reset filter hoặc khi lần đầu load trang
    if (!isPriceFilterActive) {
      setValues(priceRange);
    }
  }, [priceRange, isPriceFilterActive]);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const handleDateFilter = () => {
    if (date) {
      setSelectedDate(date);
      setIsDateFilterActive(true);
      onApplyFilter(1);
    }
  };

  const handleClearDateFilter = () => {
    setDate(undefined);
    setSelectedDate(undefined);
    setIsDateFilterActive(false);
    onApplyFilter(1);
  };

  const handleFilter = (min: number, max: number) => {
    setPriceRange([min, max]);
    setIsPriceFilterActive(true);
    onApplyFilter(1);
  };

  const handleResetFilter = () => {
    const newValues: [number, number] = [0, maxPossiblePrice];
    setValues(newValues);
    setPriceRange(newValues);
    setIsPriceFilterActive(false);

    // Call parent with reset values
    onApplyFilter(1);
  };

  const handleSortBy = (sortBy: string) => {
    setSortBy(sortBy);
    onApplyFilter(1);
  };

  return (
    <div className="mb-4 animate-fade-in rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-lg font-semibold">
          Tìm thấy&nbsp;
          <span className="text-core transition-all duration-300">
            {tourCount || 0}&nbsp;
          </span>
          kết quả
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`text-sm ${isDateFilterActive ? "border-teal-500 bg-teal-50 text-teal-500 hover:border-teal-400 hover:text-teal-500" : ""}`}
              >
                Có thể đặt
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                selected={date}
                onSelect={handleDateSelect}
                locale={vi}
              />
              <div className="mt-2 flex justify-between">
                <Button variant="outline" onClick={handleClearDateFilter}>
                  Xóa
                </Button>
                <Button
                  variant="core"
                  onClick={handleDateFilter}
                  disabled={!date}
                >
                  Chọn
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`text-sm ${isPriceFilterActive ? "border-teal-500 bg-teal-50 text-teal-500 hover:border-teal-400 hover:text-teal-500" : ""}`}
              >
                Mức giá
                <WalletCards className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                  <h3>
                    Giá{" "}
                    <span className="font-semibold text-core">
                      {formatPrice(values[0])}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-core">
                      {formatPrice(values[1])}
                    </span>
                  </h3>
                </div>
                <Slider
                  value={values}
                  onValueChange={(newValues) =>
                    setValues(newValues as [number, number])
                  }
                  min={0}
                  max={maxPossiblePrice}
                  step={1}
                />

                <div className="space-x-4">
                  <Button
                    variant="core"
                    onClick={() => handleFilter(values[0], values[1])}
                  >
                    Lọc
                  </Button>
                  <Button variant="outline" onClick={handleResetFilter}>
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500">Sắp xếp theo:</div>
        <Select
          defaultValue={`${TourSortBy.Recommended}`}
          onValueChange={(value) => handleSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Đề xuất" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={`${TourSortBy.Recommended}`}>Đề xuất</SelectItem>
            <SelectItem value={`${TourSortBy.PriceAsc}`}>
              Giá từ thấp đến cao
            </SelectItem>
            <SelectItem value={`${TourSortBy.PriceDesc}`}>
              Giá từ cao đến thấp
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
