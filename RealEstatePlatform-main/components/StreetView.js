"use client";
import { useEffect, useRef, useState } from "react";

export default function StreetView({ latitude, longitude, title }) {
  const ref = useRef(null);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  useEffect(() => {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      setAvailable(false);
      setLoading(false);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    // Load Google Maps script if not already loaded
    const existingScript = document.getElementById("google-maps-script");
    
    const initStreetView = () => {
      const position = { lat, lng };
      const sv = new window.google.maps.StreetViewService();
      
      sv.getPanorama({ location: position, radius: 50 }, (data, status) => {
  setLoading(false);
  if (status === "OK") {
    setAvailable(true);
    new window.google.maps.StreetViewPanorama(ref.current, {
      position: data.location.latLng,
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
      addressControl: false,
      fullscreenControl: true,
      motionTracking: false,
      motionTrackingControl: false,
    });
  } else {
    setAvailable(false);
  }
});
    };

    if (window.google && window.google.maps) {
      initStreetView();
    } else if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initStreetView;
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", initStreetView);
    }
  }, [lat, lng]);

  if (!available && !loading) {
    return (
      <div style={{
        background: "white",
        borderRadius: 10,
        border: "1px solid #e8e8e8",
        padding: "24px",
        marginBottom: 16,
        textAlign: "center",
        color: "#999",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🏠</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>
          Street View not available for this location
        </div>
        <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
          This property may be in a new area not yet covered by Google Street View
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "white",
      borderRadius: 10,
      border: "1px solid #e8e8e8",
      marginBottom: 16,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #e8e8e8",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
          stroke="#E03A3C" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>
          Virtual Tour — Street View
        </span>
        <span style={{ fontSize: 12, color: "#999", marginLeft: "auto" }}>
          Click and drag to look around
        </span>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          color: "#999",
          fontSize: 14,
        }}>
          Loading Street View...
        </div>
      )}

      {/* Street View container */}
      <div
        ref={ref}
        style={{
          width: "100%",
          height: 400,
          display: loading ? "none" : "block",
        }}
      />

      {/* Instructions */}
      <div style={{
        padding: "10px 24px",
        background: "#f9f9f9",
        borderTop: "1px solid #e8e8e8",
        display: "flex",
        gap: 20,
        fontSize: 12,
        color: "#888",
      }}>
        <span>🖱️ Click and drag to look around</span>
        <span>🔍 Scroll to zoom</span>
        <span>⛶ Click fullscreen icon for immersive view</span>
      </div>

      <div style={{
        padding: "10px 24px",
        background: "#fffbeb",
        borderTop: "1px solid #fde68a",
        fontSize: 12,
        color: "#92400e",
      }}>
        ⚠️ Street View shows the nearest available 360° view from Google Maps and may show the surrounding street rather than the exact property interior.
      </div>
    </div>
  );
}
