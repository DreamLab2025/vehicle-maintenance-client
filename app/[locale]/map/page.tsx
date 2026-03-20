"use client";

import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Search, MapPin, Star, Phone, Navigation, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Mock garage data
const MOCK_GARAGES = [
  {
    id: 1,
    name: "Garage Hùng Phát",
    address: "123 Nguyễn Văn Linh, Quận 7",
    lat: 10.7325,
    lng: 106.7219,
    rating: 4.8,
    reviews: 156,
    phone: "0901234567",
    isOpen: true,
    distance: "0.8 km",
    services: ["Thay dầu", "Sửa chữa", "Bảo dưỡng"],
  },
  {
    id: 2,
    name: "Auto Service Tân Phú",
    address: "456 Lê Trọng Tấn, Tân Phú",
    lat: 10.7389,
    lng: 106.7156,
    rating: 4.5,
    reviews: 89,
    phone: "0909876543",
    isOpen: true,
    distance: "1.2 km",
    services: ["Rửa xe", "Thay lốp", "Đánh bóng"],
  },
  {
    id: 3,
    name: "Moto Care Center",
    address: "789 Cách Mạng Tháng 8, Quận 3",
    lat: 10.7269,
    lng: 106.7289,
    rating: 4.9,
    reviews: 234,
    phone: "0912345678",
    isOpen: false,
    distance: "2.1 km",
    services: ["Xe máy", "Bảo dưỡng định kỳ"],
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 10.7325,
  lng: 106.7219,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function MapPage() {
  const { t } = useTranslation();
  const [selectedGarage, setSelectedGarage] = useState<typeof MOCK_GARAGES[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showList, setShowList] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const filteredGarages = MOCK_GARAGES.filter(
    (garage) =>
      garage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garage.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectGarage = (garage: typeof MOCK_GARAGES[0]) => {
    setSelectedGarage(garage);
    if (map) {
      map.panTo({ lat: garage.lat, lng: garage.lng });
      map.setZoom(16);
    }
  };

  return (
    <main className="min-h-dvh bg-gray-50 relative">
      {/* Map Container */}
      <div className="absolute inset-0 pb-20">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
          >
            {MOCK_GARAGES.map((garage) => (
              <Marker
                key={garage.id}
                position={{ lat: garage.lat, lng: garage.lng }}
                onClick={() => handleSelectGarage(garage)}
                icon={{
                  url: selectedGarage?.id === garage.id
                    ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23ef4444' stroke='white' stroke-width='2'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3' fill='white'/%3E%3C/svg%3E"
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%236b7280' stroke='white' stroke-width='2'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3' fill='white'/%3E%3C/svg%3E",
                  scaledSize: new google.maps.Size(
                    selectedGarage?.id === garage.id ? 40 : 32,
                    selectedGarage?.id === garage.id ? 40 : 32
                  ),
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Đang tải bản đồ...</span>
          </div>
        )}
      </div>

      {/* Search Bar - iOS Style */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-gray-100">
          <div className="flex items-center px-4 py-3">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder={t("map.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[15px]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sheet - Garage List */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-20 left-0 right-0 z-10"
          >
            <div className="bg-white rounded-t-3xl shadow-2xl shadow-black/10 max-h-[45vh] overflow-hidden">
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-5 pb-3">
                <h2 className="text-lg font-semibold text-gray-900">{t("map.nearbyGarages")}</h2>
                <p className="text-sm text-gray-500">{filteredGarages.length} kết quả</p>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-[30vh] px-4 pb-4">
                <div className="space-y-3">
                  {filteredGarages.map((garage) => (
                    <motion.div
                      key={garage.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectGarage(garage)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedGarage?.id === garage.id
                          ? "border-red-500 bg-red-50"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-[15px]">{garage.name}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{garage.address}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          garage.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {garage.isOpen ? t("map.open") : t("map.closed")}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{garage.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-gray-700">{garage.rating}</span>
                          <span className="text-gray-400">({garage.reviews})</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {selectedGarage?.id === garage.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex gap-2 mt-3 pt-3 border-t border-gray-100"
                        >
                          <a
                            href={`tel:${garage.phone}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-xl text-gray-700 text-sm font-medium"
                          >
                            <Phone className="h-4 w-4" />
                            {t("map.call")}
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${garage.lat},${garage.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 rounded-xl text-white text-sm font-medium"
                          >
                            <Navigation className="h-4 w-4" />
                            {t("map.getDirections")}
                          </a>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
