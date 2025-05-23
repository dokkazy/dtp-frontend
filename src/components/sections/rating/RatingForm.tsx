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
import { links } from "@/configs/routes";
import { tourApiRequest } from "@/apiRequests/tour";
import { HttpError } from "@/lib/http";
import { RatingRequest } from "@/types/tours";
import { uploadApiRequest } from "@/apiRequests/upload";
import { useLoadingOverlayStore } from "@/stores/loadingStore";
import { useOrderStore } from "@/stores/orderStore";

const MAX_PHOTOS = 6; // Maximum number of photos allowed
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ratingFormSchema = z.object({
  star: z.number().min(1, "5 sao bạn nhé").max(5),
  comment: z.string().min(1, "Đánh giá không được để trống"),
  feedback: z.string().default("").optional(),
  images: z
    .array(z.string())
    .max(MAX_PHOTOS, `Bạn chỉ có thể upload nhiều nhất là ${MAX_PHOTOS} ảnh`)
    .optional(),
});

type RatingFormSchemaType = z.infer<typeof ratingFormSchema>;

export default function RatingForm({
  orderId,
  tourId,
  tourScheduleId,
  onClose,
}: {
  tourId: string;
  tourScheduleId: string;
  orderId: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const { isLoading, setLoading } = useLoadingOverlayStore((state) => state);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [imageUploads, setImageUploads] = useState<string[]>([]);

  const form = useForm<RatingFormSchemaType>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      star: 0,
      comment: "",
      feedback: "",
      images: [],
    },
  });

  const handleImagePreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && selectedImages.length < MAX_PHOTOS) {
      // Calculate how many more images we can add
      const remainingSlots = MAX_PHOTOS - selectedImages.length;

      // Filter out non-image files
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      Array.from(e.target.files).forEach((file) => {
        // Check if file is an image
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          invalidFiles.push(`${file.name} (File không hợp lệ)`);
          return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles.push(`${file.name} (vượt quá 5MB)`);
          return;
        }

        validFiles.push(file);
      });

      // Take only as many files as we have slots for
      const filesToAdd = validFiles.slice(0, remainingSlots);

      const newFiles = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setSelectedImages((prev) => [...prev, ...newFiles]);

      // In a real app, you would upload these to a server and get back URLs

      if (invalidFiles.length > 0) {
        toast.warning(() => (
          <div className="max-h-40 overflow-auto">
            <p className="mb-2">
              Chỉ upload file JPG, PNG, GIF và WebP images dưới 5MB.
            </p>
            <ul className="list-disc pl-4">
              {invalidFiles.map((file, i) => (
                <li key={i} className="text-xs">
                  {file}
                </li>
              ))}
            </ul>
          </div>
        ));
      }

      form.setValue("images", [...(form.getValues("images") || [])]);
    } else if (selectedImages.length >= MAX_PHOTOS) {
      toast.error("Bạn đã đạt giới hạn ảnh tối đa");
    }

    // Reset the input value so the same file can be selected again if needed
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(selectedImages[index].preview);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    );
  };

  const handleRating = async (data: RatingRequest) => {
    try {
      const response = await tourApiRequest.postRating(data);
      if (response.status === 200) {
        toast.success("Đánh giá thành công");
        if (onClose) {
          await fetchOrders(true);
        }
        router.push(links.review.href);
        onClose?.();
        setLoading(false);
      } else {
        toast.error("Đánh giá không thành công. Vui lòng thử lại.");
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof HttpError) {
        console.error("Error submitting rating:", error.message);
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
      setLoading(false);
    }
  };

  const handleFeedback = async (data: {
    tourScheduleId: string;
    description: string | undefined;
  }) => {
    try {
      const response = await tourApiRequest.postFeedback(data);
      if (response.status === 200) {
        console.log(
          "Feedback submitted successfully:",
          response.payload.data.id,
        );
      }
    } catch (error) {
      if (error instanceof HttpError) {
        console.error("Error submitting feedback:", error.message);
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  const handleImageUpload = async () => {
    if (selectedImages.length > 0) {
      try {
        const imageFiles = selectedImages.map((image) => image.file);
        const response = await uploadApiRequest.uploadRatingImages(imageFiles);
        if (response.urls && response.urls.length > 0) {
          setImageUploads(response.urls);
        } else {
          console.error("No URL returned from rating image upload");
          toast.error(
            "Upload ảnh không thành công, đánh giá của bạn sẽ không có ảnh",
          );
        }
      } catch (error) {
        console.error("Error uploading rating image:", error);
        toast.error(
          "Upload ảnh không thành công, đánh giá của bạn sẽ không có ảnh",
        );
      }
    }
  };
  
  function onSubmit(data: RatingFormSchemaType) {
    setLoading(true);
    const ratingData: RatingRequest = {
      tourId,
      bookingId: orderId,
      star: data.star,
      comment: data.comment,
      images: data.images || [],
    };

    const feedbackData = {
      tourScheduleId: tourScheduleId,
      description: data.feedback,
    };
    if (imageUploads.length > 0) {
      ratingData.images = imageUploads;
      handleRating(ratingData);
    } else {
      handleImageUpload().then(() => {
        if (data.feedback) {
          handleFeedback(feedbackData);
        }
        handleRating(ratingData);
      });
    }
  }

  return (
    <Form {...form}>
      <div className="relative">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="star"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-2">
                <FormLabel className="text-lg font-semibold">
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
                <FormLabel className="font-semibold">
                  Đánh giá của bạn
                </FormLabel>
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
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Góp ý thêm về tour (Tùy chọn)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Góp ý..."
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
                <FormLabel className="font-semibold">
                  Thêm ảnh (Tùy chọn)
                </FormLabel>
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
                      {selectedImages.length < MAX_PHOTOS && (
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
                            onChange={handleImagePreUpload}
                          />
                        </label>
                      )}
                    </div>
                    {selectedImages.length > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selectedImages.length} / {MAX_PHOTOS} ảnh đã chọn
                      </p>
                    )}
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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              {isLoading ? (
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
      </div>
    </Form>
  );
}
