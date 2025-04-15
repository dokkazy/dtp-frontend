"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, Search, Send, SlidersHorizontal } from "lucide-react";
import { vi } from "date-fns/locale";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import useTourFilterStore from "@/stores/tourFilterStore";
import { TourSortBy } from "@/types/tours";

interface TourFilterProps {
  query: string;
  setQuery: (query: string) => void;
  onResetAllFilters: () => void;
  onApplyFilter: (page: number) => void;
}

export default function TourFilter({
  query,
  setQuery,
  onResetAllFilters,
  onApplyFilter,
}: TourFilterProps) {
  const {
    priceRange,
    selectedDate,
    totalItems,
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
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

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
      setOpenDatePicker(false);
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
    setOpenFilter(false);
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

  const handleResetAll = () => {
    // Reset the query
    setQuery("");
    onResetAllFilters();
  };

  return (
    <div aria-label="filter" className="space-y-4">
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Tìm kiếm địa điểm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 rounded-lg py-1.5 pl-3 pr-9 text-sm focus-visible:ring-offset-0"
          />
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2">
            <AnimatePresence mode="popLayout">
              {query.length > 0 ? (
                <motion.div
                  key="send"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Send className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Button variant="outline" onClick={handleResetAll}>
          Xóa tất cả
        </Button>
      </div>
      <div className="flex gap-2 px-2">
        <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setOpenDatePicker(!openDatePicker)}
              variant="outline"
              className={`basis-1/2 text-sm ${isDateFilterActive ? "border-teal-500 bg-teal-50 text-teal-500 hover:border-teal-400 hover:text-teal-500" : ""}`}
            >
              <CalendarIcon className="h-4 w-4 opacity-50" />
              <span> Ngày</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              disabled={(date) =>
                date < new Date() || date < new Date("1900-01-01")
              }
              initialFocus
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
        <Popover></Popover>
        <Drawer open={openFilter} onOpenChange={setOpenFilter}>
          <DrawerTrigger asChild>
            <Button
              onClick={() => setOpenFilter(!openFilter)}
              variant="outline"
              className={`basis-1/2 ${isPriceFilterActive ? "border-teal-500 bg-teal-50 text-teal-500 hover:border-teal-400 hover:text-teal-500" : ""}`}
            >
              <SlidersHorizontal className="h-4 w-4 opacity-50" />
              <span>Lọc</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="mx-auto min-h-fit w-full max-w-2xl px-6">
            <DrawerHeader className="mb-4 text-xl font-semibold">
              Lọc
            </DrawerHeader>
            <div className="mb-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Giá</h3>
                <div className="flex items-center justify-between">
                  <h3>
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
              </div>
            </div>
            <DrawerFooter>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleResetFilter}>
                  Xóa
                </Button>
                <Button
                  variant="core"
                  onClick={() => handleFilter(values[0], values[1])}
                >
                  Lọc
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm">{totalItems} kết quả</div>
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
        {/* <Button variant="ghost">
          <ArrowDownUp className="h4-w-4 mr-auto opacity-50" />
          Nên đặt
        </Button> */}
      </div>
    </div>
  );
}
