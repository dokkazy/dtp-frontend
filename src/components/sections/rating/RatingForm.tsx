"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Star, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/providers/AuthProvider";
import { links } from "@/configs/routes";

const ratingFormSchema = z.object({
  star: z.number().min(1, "5 sao bạn nhé").max(5),
  comment: z.string().min(1, "Đánh giá không được để trống"),
  images: z.array(z.string()).optional(),
});

type RatingFormSchemaType = z.infer<typeof ratingFormSchema>;

export default function RatingForm({ tourId }: { tourId: string }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const form = useForm<RatingFormSchemaType>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      star: 0,
      comment: "",
      images: [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setSelectedImages((prev) => [...prev, ...newFiles]);

      // In a real app, you would upload these to a server and get back URLs
      const mockImageUrls = newFiles.map(
        (_, index) => `https://example.com/image-${Date.now()}-${index}.jpg`,
      );

      form.setValue("images", [
        ...(form.getValues("images") || []),
        ...mockImageUrls,
      ]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    );
  };

  async function onSubmit(data: RatingFormSchemaType) {
    setIsSubmitting(true);

    try {
      // In a real app, you would upload images first and get back URLs

      const ratingData = {
        tourId,
        userId: user?.id,
        star: data.star,
        comment: data.comment,
        images: data.images || [],
      };

      // Mock API call
      console.log("Submitting rating:", ratingData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would make an actual fetch request:
      /*
      const response = await fetch("https://binhdinhtour.id.vn/api/tour/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      })
      
      if (!response.ok) {
        throw new Error("Failed to submit rating")
      }
      */

      toast("Rating submitted successfully");

      router.push(links.review.href);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="star"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center space-y-2">
              <FormLabel className="text-lg font-medium">
                Trải nghiệm của bạn với tour này ?
              </FormLabel>
              <FormControl>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredStar || field.value)
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đánh giá của bạn</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Chia sẻ cảm nhận của bạn về tour này..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thêm ảnh (Tùy chọn)</FormLabel>
              <FormControl>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-24 w-24 overflow-hidden rounded-md border"
                      >
                        <Image
                          src={image.preview}
                          alt={`Uploaded image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-black bg-opacity-50 p-1"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border border-dashed hover:bg-gray-50">
                      <div className="flex flex-col items-center">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">
                          Thêm ảnh
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="max- flex w-full items-center justify-between gap-6 px-12 max-[425px]:flex-col-reverse max-[425px]:gap-4 max-[425px]:px-0">
          <Button
            variant="outline"
            className="[425px]:basis-1/2 w-full"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.back();
            }}
          >
            Quay lại
          </Button>
          <Button
            variant="core"
            size="lg"
            type="submit"
            className="[425px]:basis-1/2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đánh giá ngay"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
