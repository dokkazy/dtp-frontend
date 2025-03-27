"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Search, Send, SlidersHorizontal } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TourCategoryProps {
  query: string;
  setQuery: (query: string) => void;
  onResetAllFilters: () => void;
}



export default function TourCategory({ query, setQuery, onResetAllFilters }: TourCategoryProps) {
  const handleResetAll = () => {
    // Reset the query
    setQuery("");
    onResetAllFilters();
  };
  return (
    <Card className="border-t">
      <CardContent className="space-y-3 py-4">
        {/* <div>
          <h3 className="mb-4 text-lg font-bold">Danh mục</h3>
          <div className="flex flex-col gap-y-4">
            {categories.map((category) => (
              <div className="space-x-2" key={category.id}>
                <Checkbox
                  className="data-[state=checked]:bg-core"
                  id={category.id}
                  checked={selectedCategory === category.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // onSelectCategory(category.id);
                  }}
                />
                <Label htmlFor={category.id} className="text-base">
                  {" "}
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div> */}
        <div className="float-right" onClick={handleResetAll}>
          <h3 className="underline hover:cursor-pointer">Xóa tất cả</h3>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold">Tìm kiếm</h3>
          <div className="relative">
            <Input
              type="text"
              placeholder="địa điểm..."
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
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-start px-4">
        <Button variant="outline" onClick={() => setQuery("")}>
          Xóa <RotateCcw className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </CardFooter>
    </Card>
  );
}
