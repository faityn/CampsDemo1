"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";

function parseCoordinates(value: string): [number, number] | null {
  const [latitude, longitude] = value.split(",").map(Number);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }
  return [latitude, longitude];
}

export default function LocationPicker({
  coordinates,
  onChange,
}: {
  coordinates: string;
  onChange: (coordinates: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const center = parseCoordinates(coordinates) ?? [47.9, 106.9];

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let disposed = false;
    let map: LeafletMap | null = null;

    async function initializeMap() {
      const leaflet = await import("leaflet");
      if (disposed || !containerRef.current) return;

      const initialCenter = parseCoordinates(coordinates) ?? [47.9, 106.9];
      map = leaflet.map(containerRef.current).setView(initialCenter, 12);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map);

      const marker = leaflet.marker(initialCenter, {
        draggable: true,
        icon: leaflet.divIcon({
          className: "",
          html: '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#b42318;border:3px solid white;box-shadow:0 2px 8px #0006;transform:rotate(-45deg)"></div>',
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        }),
      });
      marker.addTo(map);
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onChangeRef.current(`${position.lat.toFixed(6)},${position.lng.toFixed(6)}`);
      });
      map.on("click", (event) => {
        marker.setLatLng(event.latlng);
        onChangeRef.current(`${event.latlng.lat.toFixed(6)},${event.latlng.lng.toFixed(6)}`);
      });

      mapRef.current = map;
      markerRef.current = marker;
      requestAnimationFrame(() => map?.invalidateSize());
    }

    void initializeMap();

    return () => {
      disposed = true;
      map?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    marker.setLatLng(center);
    map.setView(center, map.getZoom());
  }, [coordinates]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full overflow-hidden rounded-md border border-[#dfe2df] bg-[#e8ecea]"
      aria-label="Choose resort location on map"
    />
  );
}
