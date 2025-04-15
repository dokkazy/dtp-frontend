"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { links } from "@/configs/routes";
import { formatPrice } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TourList as Tours } from "@/types/tours";
import TourCardSkeleton from "@/components/common/loading/TourCardSkeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TourListProps {
  tours: Tours;
  isLoading?: boolean;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function TourList({
  tours,
  isLoading,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: TourListProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  // State cho popover và input số trang
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>("");
  const [popoverType, setPopoverType] = useState<number>(0); // 0: không mở, -1: ellipsis đầu, -2: ellipsis cuối

  // Xử lý khi mở popover
  const handleOpenPopover = (type: number) => {
    setPopoverType(type);
    setPageInput("");
    setOpenPopover(true);
  };

  // Xử lý khi gửi số trang
  const handlePageInputSubmit = () => {
    const page = parseInt(pageInput);
    if (page && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setOpenPopover(false);
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePageInputSubmit();
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    // Luôn hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang 1
      pages.push(1);

      // Tính toán trang bắt đầu và kết thúc để hiển thị
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Điều chỉnh nếu ở gần trang đầu hoặc trang cuối
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Thêm dấu chấm lửng nếu không bắt đầu từ trang 2
      if (startPage > 2) {
        pages.push(-1); // -1 đại diện cho dấu chấm lửng
      }

      // Thêm các trang ở giữa
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Thêm dấu chấm lửng nếu không kết thúc ở trang kế cuối
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 đại diện cho dấu chấm lửng thứ hai
      }

      // Luôn hiển thị trang cuối cùng
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Tạo gợi ý phạm vi trang tùy thuộc vào loại ellipsis
  const getPageHint = () => {
    if (popoverType === -1) {
      // Ellipsis đầu: từ trang 2 đến startPage-1
      return `Nhập số từ 2 đến ${Math.max(2, currentPage - 2)}`;
    } else if (popoverType === -2) {
      // Ellipsis cuối: từ endPage+1 đến totalPages-1
      return `Nhập số từ ${Math.min(totalPages - 1, currentPage + 2)} đến ${totalPages - 1}`;
    }
    return `Nhập số từ 1 đến ${totalPages}`;
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        {isLoading ? (
          <>
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <TourCardSkeleton key={index} />
              ))}
          </>
        ) : tours.length > 0 ? (
          <>
            {tours.map((tour) => (
              <Link
                href={`${links.tour.href}/${tour.id}`}
                key={tour.id}
                className="group"
              >
                <div
                  className={`h-full overflow-hidden rounded-xl border border-core bg-white transition-all duration-300`}
                  id={`tour-${tour.id}`}
                >
                  <div className="relative">
                    <Image
                      src={tour.thumbnailUrl}
                      alt={tour.title || ""}
                      className="h-60 w-full object-cover sm:h-96"
                      loading="lazy"
                      width={300}
                      height={300}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/quynhonbanner.jpg";
                      }}
                    />
                  </div>

                  <div className="p-3 space-y-2">
                    <h3
                      title=""
                      className="line-clamp-2 text-base font-semibold"
                    >
                      {tour.title}
                    </h3>

                    <div className="mb-2 flex items-center text-xs">
                      <div className="inline-flex items-center text-yellow-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 font-medium">
                          {tour.totalRating}
                        </span>
                        <span className="ml-1 text-gray-600">(100)</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-gray-600">100+ Đã đặt</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex gap-2">
                        <span className="text-xs text-gray-500">Từ</span>
                        <div className="inline-flex items-center font-semibold text-core">
                          {formatPrice(tour.onlyFromCost)}
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            {formatPrice(tour.onlyFromCost * 2)}
                          </span>
                        </div>
                      </div>

                      <button className="bg-tour-primary rounded-lg px-2 py-1 text-xs font-medium text-white transition-all hover:bg-opacity-90">
                        Đặt
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-black/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-xl font-semibold">
              Không tìm thấy tour nào
            </h3>
            <p className="text-sm text-gray-500">
              Không có tour nào khả dụng trong danh sách này.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Vui lòng thử lại sau hoặc điều chỉnh bộ lọc tìm kiếm của bạn.
            </p>
          </div>
        )}
      </div>
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center py-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                  {page === -1 || page === -2 ? (
                    <PaginationItem>
                      <Popover
                        open={openPopover && popoverType === page}
                        onOpenChange={(open) => {
                          if (!open) setOpenPopover(false);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleOpenPopover(page)}
                          >
                            <PaginationEllipsis />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60">
                          <div className="space-y-2">
                            <h4 className="font-medium">Đi đến trang</h4>
                            <p className="text-xs text-muted-foreground">
                              {getPageHint()}
                            </p>
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                min={1}
                                max={totalPages}
                                placeholder="Nhập số trang"
                                value={pageInput}
                                onChange={(e) => setPageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1"
                              />
                              <Button
                                variant="core"
                                onClick={handlePageInputSubmit}
                              >
                                Đi
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </PaginationItem>
                  ) : (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </React.Fragment>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
