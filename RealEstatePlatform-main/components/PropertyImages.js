"use client";
// components/PropertyImages.js
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { getImageSrcs, PLACEHOLDER_IMG } from "@/lib/constants";

export default function PropertyImages({ mainImg, title, propId, type, status, featured, thumbnail = false, images = [] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const proxyUrl = (url) => {
    if (!url) return PLACEHOLDER_IMG;
    if (url.startsWith("http")) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1200&q=90`;
    }
    return url;
  };

  const imageList = images && images.length > 0 ? images : (mainImg ? [mainImg] : []);
  const validImages = imageList.filter(Boolean);
  const proxiedImages = validImages.length > 0 ? validImages.map(proxyUrl) : [PLACEHOLDER_IMG];
  const mainImage = proxiedImages[0] || PLACEHOLDER_IMG;
  const slides = proxiedImages.map((src) => ({ src }));

  const [activeImg, setActiveImg] = useState(mainImage);

  if (thumbnail) {
    return (
      <img
        src={imgError ? PLACEHOLDER_IMG : (mainImage || PLACEHOLDER_IMG)}
        alt={title}
        style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
        onError={() => setImgError(true)}
      />
    );
  }

  const propertyThumbs = proxiedImages.slice(1, 5);
  while (propertyThumbs.length < 4) {
    propertyThumbs.push(proxiedImages[0]);
  }

  return (
    <>
      <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 16, cursor: "zoom-in", border: "1px solid #e8e8e8" }}>
        <div style={{ position: "relative" }}>
          <img
            src={imgError ? PLACEHOLDER_IMG : (activeImg || mainImage)}
            alt={title}
            onClick={() => { setIndex(proxiedImages.indexOf(activeImg) || 0); setOpen(true); }}
            style={{ width: "100%", height: 420, objectFit: "cover", display: "block", cursor: "zoom-in" }}
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; setImgError(true); }}
          />
          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
            <span style={{ background: "#E03A3C", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4, textTransform: "uppercase" }}>{type}</span>
            {status === "available" && (
              <span style={{ background: "#00897B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4 }}>Available</span>
            )}
            {featured && (
              <span style={{ background: "#F59E0B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4 }}>Featured</span>
            )}
          </div>
          <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 4, display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            {proxiedImages.length} Photos
          </div>
        </div>

        {validImages.length > 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginTop: 4 }}>
            {proxiedImages.slice(1, 5).map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={img}
                  alt={`${title} ${i + 2}`}
                  onClick={() => { setIndex(i + 1); setActiveImg(img); setImgError(false); setOpen(true); }}
                  style={{ width: "100%", height: 90, objectFit: "cover", cursor: "zoom-in", display: "block" }}
                  onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                />
                {i === 3 && proxiedImages.length > 5 && (
                  <div
                    onClick={() => { setIndex(4); setActiveImg(proxiedImages[4]); setImgError(false); setOpen(true); }}
                    style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0.55)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 18, fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    +{proxiedImages.length - 4} more
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 4,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        thumbnails={{
          position: "bottom",
          width: 80,
          height: 60,
          gap: 8,
        }}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
        }}
        carousel={{ finite: false }}
        on={{
          view: ({ index: newIndex }) => setIndex(newIndex),
        }}
      />
    </>
  );
}

function ThumbnailImg({ src, alt, fallback, active, onClick }) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      onClick={onClick}
      style={{ width: "100%", height: 80, objectFit: "cover", display: "block", opacity: active ? 1 : 0.7, cursor: "pointer", outline: active ? "3px solid #E03A3C" : "none", transition: "opacity 0.2s" }}
      onError={() => setError(true)}
      onMouseEnter={e => { if (!active) e.target.style.opacity = "1"; }}
      onMouseLeave={e => { if (!active) e.target.style.opacity = "0.7"; }}
    />
  );
}
