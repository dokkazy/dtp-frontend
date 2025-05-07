"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, MapPin, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Map,
  NavigationControl,
  Marker,
  Popup,
  ScaleControl,
  FullscreenControl,
  MapRef,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import { tourApiRequest } from "@/apiRequests/tour";
import { HttpError } from "@/lib/http";
import { Tour, TourList } from "@/types/tours";
import Spinner from "@/components/common/loading/Spinner";

// default center of Quy Nhon
const center = {
  lng: 109.2243,
  lat: 13.7798,
};

// Map styles with more detail
const mapStyles = {
  liberty: "https://tiles.openfreemap.org/styles/liberty",
  bright: "https://tiles.openfreemap.org/styles/bright",
  positron: "https://tiles.openfreemap.org/styles/positron",
  standard: "https://demotiles.maplibre.org/style.json",
};

export default function MapPage() {
  const router = useRouter();
  const [tours, setTours] = useState<TourList>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Tour | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState(mapStyles.standard);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await tourApiRequest.getAll();
        if (response.status === 200) {
          setTours(response.payload);
        }
      } catch (error) {
        if (error instanceof HttpError) {
          console.error("Error fetching tours:", error.message);
          toast.error(error.message);
        } else {
          console.log(error)
          toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map reference
  const mapRef = useRef<MapRef>(null);

  const handleTourFocus = useCallback((tour: Tour) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [
          Number(tour?.firstDestination?.longitude),
          Number(tour?.firstDestination?.latitude),
        ],
        zoom: 12,
        duration: 1000,
      });
    }
    // Also set the selected location to show the popup
    setSelectedLocation(tour);
    setIsSidebarVisible(false);
  }, []);

  // Handle map load
  const onMapLoad = useCallback(() => {
    setMapInitialized(true);
    try {
      setCurrentMapStyle(mapStyles.bright);
    } catch (error) {
      console.error("Error setting detailed style:", error);
    }
  }, []);

  // Handle map error
  const handleMapError = useCallback(() => {
    console.error("Map style failed to load, falling back to standard style");
    setCurrentMapStyle(mapStyles.standard);
  }, []);

  // Handle view details click
  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`/tour/${id}`);
    },
    [router],
  );

  // Handle marker click
  const handleMarkerClick = useCallback((location: Tour) => {
    setSelectedLocation(location);
  }, []);

  // Custom marker element
  const MapMarker = ({ location }: { location: Tour }) => {
    return (
      <Marker
        longitude={Number(location?.firstDestination?.longitude) || center.lng}
        latitude={Number(location?.firstDestination?.latitude) || center.lat}
      >
        <div
          className="map-marker flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-core text-white shadow-md transition-transform hover:scale-110"
          onClick={() => handleMarkerClick(location)}
        >
          <MapPin size={14} />
        </div>
      </Marker>
    );
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center gap-2 bg-background/50">
        <p>Đang tải tài nguyên...</p>
        <Spinner className="text-core" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        className={`absolute top-1/2 z-10 left-0 flex max-w-prose -translate-y-1/2 sm:right-10 transform transition-all duration-300 ease-in-out sm:left-10 md:w-auto ${isSidebarVisible ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-full opacity-0"}`}
      >
        <div className="h-[calc(100vh-8rem)] w-full overflow-hidden rounded-lg shadow-lg sm:min-w-[400px] sm:w-[550px]">
          <div className="relative h-32 w-full">
            <div className="absolute inset-0">
              <Image
                src={"/images/quynhonbanner.jpg"}
                alt="quynhonbanner"
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 ml-6 flex items-center justify-start">
              {" "}
              <h3 className="basis-1/3 text-lg font-medium text-white">
                Những hoạt động tại Quy Nhơn
              </h3>
            </div>
          </div>
          {tours.length > 0 ? (
            <ScrollArea className="h-full bg-white pb-32">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="flex cursor-pointer overflow-hidden border p-3 hover:bg-secondary/20"
                    onClick={() => {
                      handleTourFocus(tour);
                    }}
                  >
                    <div className="aspect-square h-full w-1/4">
                      <Image
                        src={tour.thumbnailUrl || "/images/quynhonbanner.jpg"}
                        alt="quynhonbanner"
                        width={500}
                        height={500}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex w-3/4 flex-col gap-1">
                      <p className="font-medium">{tour.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tour.companyName}
                      </p>
                      <div className="inline-flex items-center text-sm text-yellow-500">
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
                      <p className="text-sm">{formatPrice(tour.onlyFromCost)}</p>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          ) : (
            <>
              <div className="flex h-full w-full justify-center bg-white">
                <h1>Không có hoạt động nào tại Quy Nhơn</h1>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="relative h-full flex-1">
        {!mapInitialized && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50">
            <p>Đang tải bản đồ...</p>
          </div>
        )}

        <Map
          ref={mapRef}
          mapStyle={currentMapStyle}
          initialViewState={{
            longitude: center.lng,
            latitude: center.lat,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%", borderRadius: "0.375rem" }}
          onLoad={onMapLoad}
          onError={handleMapError}
          attributionControl={false}
        >
          <div className="absolute left-2 top-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className=""
              >
                <ArrowLeft size={18} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className=""
                onClick={toggleSidebar}
              >
                <Menu size={18} />
              </Button>
            </div>
          </div>
          <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />
          <ScaleControl position="bottom-left" />

          {tours.map((location) => (
            <MapMarker key={location.id} location={location} />
          ))}

          {selectedLocation && (
            <Popup
              longitude={Number(selectedLocation?.firstDestination?.longitude) || center.lng}
              latitude={Number(selectedLocation?.firstDestination?.latitude) || center.lat}
              offset={[0, -30]}
              closeButton={false}
              closeOnClick={false}
              onClose={() => setSelectedLocation(null)}
            >
              <div className="relative space-y-2 p-2">
                <button
                  className="absolute right-0 top-0 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedLocation(null)}
                  aria-label="Close popup"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <h3 className="line-clamp-1 text-base font-medium">
                  {selectedLocation.title}
                </h3>
                <Button
                  size="sm"
                  variant="core"
                  className="mt-2"
                  onClick={() => handleViewDetails(selectedLocation.id)}
                >
                  Xem chi tiết
                </Button>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
