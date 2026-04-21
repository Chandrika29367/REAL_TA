"use client";
import { useEffect, useRef } from "react";

export default function SatelliteMap({ latitude, longitude, title }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  useEffect(() => {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;
    if (!ref.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    const initMap = () => {
      if (mapRef.current) {
        mapRef.current.setCenter({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
          markerRef.current.setTitle(title);
        }
        return;
      }

      mapRef.current = new window.google.maps.Map(ref.current, {
        center: { lat, lng },
        zoom: 18,
        mapTypeId: "satellite",
        tilt: 45,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#E03A3C",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
      });
    };

    const existingScript = document.getElementById("google-maps-script");
    let removeListener = null;

    if (window.google && window.google.maps) {
      initMap();
    } else if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      const listener = () => initMap();
      existingScript.addEventListener("load", listener);
      removeListener = () => existingScript.removeEventListener("load", listener);
    }

    return () => {
      if (removeListener) removeListener();
    };
  }, [lat, lng, title]);

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

  return (
    <div style={{
      background: "white",
      borderRadius: 10,
      border: "1px solid #e8e8e8",
      marginBottom: 16,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #e8e8e8",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#E03A3C" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>
          Plot Location — Satellite View
        </span>
        <span style={{ fontSize: 12, color: "#999", marginLeft: "auto" }}>
          Scroll to zoom • Drag to explore
        </span>
      </div>

      <div ref={ref} style={{ width: "100%", height: 400 }} />

      <div style={{
        padding: "10px 24px",
        background: "#f0fdf4",
        borderTop: "1px solid #bbf7d0",
        fontSize: 12,
        color: "#166534",
      }}>
        📍 Showing satellite view of the exact plot coordinates. The red dot marks the property location.
      </div>
    </div>
  );
}
