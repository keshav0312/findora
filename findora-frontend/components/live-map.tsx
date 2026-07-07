"use client";

import { useCallback, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { MapPreview } from "./map-preview";
import { cn } from "@/lib/utils";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  kind?: "lost" | "found";
}

const DEFAULT_CENTER = { lat: 23.2599, lng: 77.4126 }; // Bhopal, MP — sensible default

interface LiveMapProps {
  className?: string;
  pins?: MapPin[];
  center?: { lat: number; lng: number };
  zoom?: number;
  /** Enables click-to-pick-location mode (used by the report form). */
  pickable?: boolean;
  onPick?: (coords: { lat: number; lng: number }) => void;
  pickedLocation?: { lat: number; lng: number } | null;
}

/**
 * Live Google Map used across the app: nearby-reports widget on the
 * dashboard, item detail location, search results, and the
 * click-to-drop-a-pin location picker in the report form.
 *
 * Falls back to the stylized `MapPreview` placeholder if
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY isn't set, so the app still renders
 * something reasonable with zero configuration.
 */
export function LiveMap({
  className,
  pins = [],
  center,
  zoom = 12,
  pickable = false,
  onPick,
  pickedLocation,
}: LiveMapProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  const mapCenter =
    center ||
    (pins.length > 0 ? { lat: pins[0].lat, lng: pins[0].lng } : DEFAULT_CENTER);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!pickable || !onPick || !e.latLng) return;
      onPick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    },
    [pickable, onPick]
  );

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={cn("relative", className)}>
        <MapPreview className="h-full w-full" dense={pins.length > 3} />
        <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-amber-50/95 px-3 py-1.5 text-[11px] font-medium text-amber-700">
          Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable live Google Maps
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-2xl", className)}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={zoom}
          onClick={handleMapClick}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            ],
          }}
        >
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={{ lat: pin.lat, lng: pin.lng }}
              onClick={() => setActivePin(pin.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: pin.kind === "found" ? "#16a34a" : "#dc2626",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          ))}

          {pins
            .filter((p) => p.id === activePin)
            .map((pin) => (
              <InfoWindow
                key={pin.id}
                position={{ lat: pin.lat, lng: pin.lng }}
                onCloseClick={() => setActivePin(null)}
              >
                <div className="text-xs">
                  <p className="font-semibold text-slate-800">{pin.label}</p>
                  {pin.sublabel && <p className="text-slate-500">{pin.sublabel}</p>}
                </div>
              </InfoWindow>
            ))}

          {pickedLocation && (
            <Marker
              position={pickedLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                fillColor: "#4338ca",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
