import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TourDetail } from "@/types/tours";
import ImageModal from "@/components/sections/tour-detail/ImageModal";

const images = [
  {
    id: 1,
    src: "/images/eo-gio.jpg",
    // alt: "Luxury van interior with plush white leather seats"
  },
  {
    id: 2,
    src: "/images/thap-doi.jpg",
    // alt: "Luxury van interior with plush white leather seats"
  },
  {
    id: 3,
    src: "/images/doi-cat-phuong-mai.jpg",
    // alt: "Luxury van interior with plush white leather seats"
  },
];

function extractImageUrls(
  tourDestinations: TourDetail["tourDestinations"],
  imageUrls?: string[],
) {
  let id = 1;
  const imageGallery = tourDestinations.flatMap((destination) =>
    destination.imageUrls.length > 0
      ? destination.imageUrls.map((url) => ({
          id: id++, // Gán ID duy nhất
          src: url,
        }))
      : [],
  );
  return [
    ...(imageUrls?.map((url) => ({ id: id++, src: url })) || []),
    ...imageGallery,
  ];
}

export default function GallerySection({ data }: { data: TourDetail | null }) {
  const [showGallery, setShowGallery] = React.useState(false);
  const [selectedImageId, setSelectedImageId] = React.useState<number>();
  const imageGallery = extractImageUrls(
    data?.tourDestinations || [],
    data?.tour.imageUrls || [],
  );
  const handleShowGallery = () => {
    if (imageGallery.length > 0) {
      setSelectedImageId(imageGallery[0].id);
    }
    setShowGallery(true);
  };
  const handleCloseModal = () => {
    setShowGallery(false);
  };
  return (
    <div className="relative h-96 auto-rows-auto gap-1 md:grid md:h-[450px] md:grid-cols-12">
      {/* Large image - spans 8 columns on medium screens and up */}
      {imageGallery.length > 0 && (
        <Button
          variant="outline"
          size="lg"
          className="absolute bottom-4 right-4 z-[5] border border-black"
          onClick={handleShowGallery}
        >
          Thư viện ảnh
        </Button>
      )}
      <div className="relative size-full md:hidden">
        <Image
          src={imageGallery[0]?.src || images[0].src}
          alt="Luxury van interior with plush white leather seats"
          className="size-full object-cover object-center"
          width={500}
          height={500}
          priority
        />
      </div>
      <Card className="row-span-2 hidden overflow-hidden md:col-span-8 md:block">
        <CardContent className="h-full p-0">
          <div className="relative size-full">
            <Image
              src={imageGallery[0]?.src || images[0].src}
              alt="Luxury van interior with plush white leather seats"
              className="size-full object-cover object-center"
              width={500}
              height={500}
              priority
            />
          </div>
        </CardContent>
      </Card>

      {/* First small image - spans 4 columns on medium screens and up */}
      <Card className="hidden overflow-hidden md:col-span-4 md:block">
        <CardContent className="h-full p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={imageGallery[1]?.src || images[1].src}
              alt="Luxury van interior with plush white leather seats"
              className="size-full object-cover object-center"
              width={400}
              height={400}
              priority
            />
          </div>
        </CardContent>
      </Card>

      {/* Second small image - spans 4 columns on medium screens and up */}
      <Card className="hidden overflow-hidden md:col-span-4 md:block">
        <CardContent className="relative h-full p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={imageGallery[2]?.src || images[2].src}
              alt="Luxury van interior with plush white leather seats"
              className="size-full object-cover"
              width={400}
              height={400}
              priority
            />
          </div>
        </CardContent>
      </Card>
      {imageGallery.length > 0 && showGallery === true && (
        <ImageModal
          isOpen={showGallery}
          onClose={handleCloseModal}
          images={imageGallery}
          initialImageId={selectedImageId}
        />
      )}
    </div>
  );
}
