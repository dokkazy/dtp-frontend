"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Map, NavigationControl, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import useTourFilterStore from "@/stores/tourFilterStore";

// Map options
const center = {
  lng: 109.2243,
  lat: 13.7798, // Default center for Quy Nhon
};

// Map styles with more detail
const mapStyles = {
  // Liberty style with 3D buildings and detailed terrain
  liberty: "https://tiles.openfreemap.org/styles/liberty",
  // Bright style with clear, vibrant colors
  bright: "https://tiles.openfreemap.org/styles/bright",
  // Positron style with clean, minimal design
  positron: "https://tiles.openfreemap.org/styles/positron",
  // Standard tileset (fallback)
  standard: "https://demotiles.maplibre.org/style.json",
};

export default function TourMap() {
  const router = useRouter();
  const [mapStyle, setMapStyle] = useState(mapStyles.bright);
  const { tours } = useTourFilterStore((state) => state);

  const handleOpenFullMap = () => {
    router.push("/map");
  };

  // Handle map load error
  const handleMapError = () => {
    console.error("Failed to load map style, falling back to standard style");
    setMapStyle(mapStyles.standard);
  };

  return (
    <Card
      className="relative h-40 w-full cursor-pointer transition-all duration-300 hover:shadow-md"
      onClick={handleOpenFullMap}
    >
      <div className="absolute inset-0 p-3">
        <Map
          mapStyle={mapStyle}
          initialViewState={{
            longitude: center.lng,
            latitude: center.lat,
            zoom: 11,
          }}
          interactive={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%", borderRadius: "0.375rem" }}
          onError={handleMapError}
        >
          <NavigationControl position="top-right" />

          {tours.map((tour) => (
            <Marker
              key={tour.id}
              longitude={Number(tour?.firstDestination?.longitude)}
              latitude={Number(tour?.firstDestination?.latitude)}
            >
              <div className="map-marker flex h-5 w-5 items-center justify-center rounded-full bg-core text-white">
                <MapPin size={12} />
              </div>
            </Marker>
          ))}
        </Map>
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-white/80 p-1 text-xs">
        <ExternalLink size={12} /> Xem bản đồ đầy đủ
      </div>
    </Card>
  );
}
