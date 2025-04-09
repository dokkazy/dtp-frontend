"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Map, NavigationControl, Marker } from "@vis.gl/react-maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';

// Map options
const center = {
  lng: 109.2243,
  lat: 13.7798, // Default center for Quy Nhon
};

// Map styles with more detail
const mapStyles = {
  // Liberty style with 3D buildings and detailed terrain
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
  // Bright style with clear, vibrant colors
  bright: 'https://tiles.openfreemap.org/styles/bright',
  // Positron style with clean, minimal design
  positron: 'https://tiles.openfreemap.org/styles/positron',
  // Standard tileset (fallback)
  standard: 'https://demotiles.maplibre.org/style.json'
};

export const mockTourLocations = [
  {
    id: "1a2b3c-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
    title: "Tour Kỳ Co - Eo Gió",
    thumbnailUrl: "/images/eo-gio.jpg",
    companyName: "BinhDinhTour",
    description: "Khám phá vẻ đẹp hoang sơ của bãi biển Kỳ Co và Eo Gió",
    avgStar: 4.8,
    totalRating: 156,
    onlyFromCost: 550000,
    isDeleted: false,
    lat: 13.7598, 
    lng: 109.2643
  },
  {
    id: "2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    title: "Tour Eo Gió - Phương Mai",
    thumbnailUrl: "/images/eo-gio.jpg",
    companyName: "QuyNhonTravel",
    description: "Trải nghiệm cảm giác đứng giữa eo biển, ngắm nhìn toàn cảnh vịnh Quy Nhơn",
    avgStar: 4.6,
    totalRating: 128,
    onlyFromCost: 480000,
    isDeleted: false,
    lat: 13.7698, 
    lng: 109.2143
  },
  {
    id: "3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    title: "Tour Tháp Đôi - Di sản Chăm",
    thumbnailUrl: "/images/eo-gio.jpg",
    companyName: "BinhDinhHeritage",
    description: "Tìm hiểu về lịch sử và văn hóa Chăm qua kiến trúc độc đáo của Tháp Đôi",
    avgStar: 4.5,
    totalRating: 94,
    onlyFromCost: 350000,
    isDeleted: false,
    lat: 13.7898, 
    lng: 109.2343
  },
  {
    id: "4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    title: "Tour Ghép Quy Nhơn - Phú Yên",
    thumbnailUrl: "/images/eo-gio.jpg",
    companyName: "CentralCoastTravel",
    description: "Hành trình khám phá hai vùng đất tuyệt đẹp của duyên hải miền Trung",
    avgStar: 4.9,
    totalRating: 187,
    onlyFromCost: 1250000,
    isDeleted: false,
    lat: 13.7548, 
    lng: 109.2843
  },
  {
    id: "5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
    title: "Tour Bãi Xép - Gành Đá Dĩa",
    thumbnailUrl: "/images/eo-gio.jpg",
    companyName: "BinhDinhTour",
    description: "Ngắm hoàng hôn tại Bãi Xép và khám phá kỳ quan thiên nhiên Gành Đá Dĩa",
    avgStar: 4.7,
    totalRating: 142,
    onlyFromCost: 750000,
    isDeleted: false,
    lat: 13.7998, 
    lng: 109.2843
  }
];

export default function TourMap() {
  const router = useRouter();
  const [mapStyle, setMapStyle] = useState(mapStyles.bright);
  
  const handleOpenFullMap = () => {
    router.push('/map');
  };

  // Handle map load error
  const handleMapError = () => {
    console.error("Failed to load map style, falling back to standard style");
    setMapStyle(mapStyles.standard);
  };
  
  return (
    <Card 
      className="h-40 w-full relative cursor-pointer hover:shadow-md transition-all duration-300"
      onClick={handleOpenFullMap}
    >
      <div className="absolute inset-0 p-3">
        <Map
          mapStyle={mapStyle}
          initialViewState={{
            longitude: center.lng,
            latitude: center.lat,
            zoom: 11
          }}
          interactive={false}
          attributionControl={false}
          style={{ width: '100%', height: '100%', borderRadius: '0.375rem' }}
          onError={handleMapError}
        >
          <NavigationControl position="top-right" />
          
          {mockTourLocations.map(location => (
            <Marker 
              key={location.id}
              longitude={location.lng} 
              latitude={location.lat}
            >
              <div className="map-marker flex items-center justify-center bg-core text-white rounded-full w-5 h-5">
                <MapPin size={12} />
              </div>
            </Marker>
          ))}
        </Map>
      </div>
      <div className="absolute bottom-2 right-2 bg-white/80 rounded-md p-1 text-xs flex items-center gap-1">
        <ExternalLink size={12} /> Xem bản đồ đầy đủ
      </div>
    </Card>
  );
}
