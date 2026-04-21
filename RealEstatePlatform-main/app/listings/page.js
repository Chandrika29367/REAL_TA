"use client";
// app/listings/page.js
import { useEffect, useState, useCallback } from "react";
import { Suspense } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { fmtPrice, getImageSrc, getRisk, getAge } from "@/lib/constants";

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "Residential Apartment", label: "Residential Apartment" },
  { value: "Builder Floor", label: "Builder Floor" },
  { value: "Farm House", label: "Farm House" },
  { value: "Serviced Apartments", label: "Serviced Apartments" },
  { value: "Independent House/Villa", label: "Independent House/Villa" },
  { value: "Residential Land", label: "Residential Land" },
  { value: "Other", label: "Other" },
];

const BHK_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK" },
  { value: "5+", label: "5+ BHK" },
];

const SORT_OPTIONS = [
  { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
];

// ── Google Map ───────────────────────────────────────────────────────────
function MapView({ properties }) {
  const [selected, setSelected] = useState(null);
  const VIJAYAWADA = { lat: 16.5062, lng: 80.6480 };

  const validProps = (properties || []).filter(p =>
    p.latitude && p.longitude &&
    !isNaN(parseFloat(p.latitude)) &&
    !isNaN(parseFloat(p.longitude))
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
      <Map
        defaultCenter={VIJAYAWADA}
        defaultZoom={12}
        style={{ width: "100%", height: "100%" }}
        gestureHandling="greedy"
      >
        {validProps.map((p) => {
          const lat = parseFloat(p.latitude);
          const lng = parseFloat(p.longitude);
          const price = p.price || "N/A";

          return (
            <Marker
              key={p.id || p._id}
              position={{ lat, lng }}
              onClick={() => setSelected(p)}
            />
          );
        })}

        {selected && (
          <InfoWindow
            position={{
              lat: parseFloat(selected.latitude),
              lng: parseFloat(selected.longitude),
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ fontFamily: "sans-serif", maxWidth: 220, padding: 6 }}>
              <img
                src={selected.images?.[0]
                  ? `https://images.weserv.nl/?url=${encodeURIComponent(selected.images[0])}&w=200&q=80`
                  : "/placeholder.jpg"}
                alt={selected.title}
                style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
                onError={(e) => { e.target.src = "/placeholder.jpg"; }}
              />
              <div style={{ fontWeight: 700, fontSize: 14, color: "#E03A3C", marginBottom: 2 }}>
                ₹{selected.price || "Price on request"}
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a", marginBottom: 4 }}>
                {selected.title}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                {selected.locality}, Vijayawada
              </div>
              <a
                href={`/property/${selected.id || selected._id}`}
                style={{
                  display: "block",
                  background: "#E03A3C",
                  color: "white",
                  textAlign: "center",
                  padding: "6px 0",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                View Details →
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}

// ── Main Page Content ─────────────────────────────────────────────────────────
function ListingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    search:   searchParams.get("search")   || "",
    type:     searchParams.get("type")     || "",
    listing:  searchParams.get("listing") ||
              (searchParams.get("listing_type") === "P" ? "Buy" : searchParams.get("listing_type") === "R" ? "Rent" : "") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy:   "createdAt",
    sortOrder:"desc",
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set("page", String(currentPage));
    params.set("limit", "20");
    try {
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setPagination(data.pagination || { total: 0, pages: 1 });
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [filters, currentPage]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const setFilter = (k, v) => setFilters(f => {
    const next = { ...f, [k]: v };
    if (k !== "page") {
      setCurrentPage(1);
    }
    if (k === "type" && (v === "Residential Land" || v === "Farm House")) {
      next.bedrooms = "";
    }
    return next;
  });
  const clearFilters = () => {
    setCurrentPage(1);
    return setFilters({ search: "", type: "", listing: "", bedrooms: "", minPrice: "", maxPrice: "", sortBy: "createdAt", sortOrder: "desc" });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inp = { border: "1px solid #E0E0E0", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "white", color: "#1A1A1A", width: "100%" };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#F5F5F5", minHeight: "100vh" }}>
      <style suppressHydrationWarning>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #E0E0E0; }
        select option { background: white; }
        .filter-input:focus { border-color: #E03A3C !important; }
      `}</style>

      <Navbar />

      {/* Search bar */}
      <div style={{ background: "white", borderBottom: "1px solid #E0E0E0", padding: "12px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F9F9F9", borderRadius: 6, padding: "8px 14px", border: "1px solid #E0E0E0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" style={{ marginRight: 8, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="filter-input"
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, flex: 1, fontFamily: "inherit" }}
              placeholder="Search by locality, project or landmark..."
              value={filters.search}
              onChange={e => setFilter("search", e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchProperties()}
            />
            {filters.search && <button onClick={() => setFilter("search", "")} style={{ border: "none", background: "none", cursor: "pointer", color: "#aaa", fontSize: 18, lineHeight: 1 }}>×</button>}
          </div>
          <select className="filter-input" style={{ ...inp, width: 260 }} value={filters.type} onChange={e => setFilter("type", e.target.value)}>
            {PROPERTY_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select className="filter-input" style={{ ...inp, width: 140 }} value={filters.listing} onChange={e => setFilter("listing", e.target.value)}>
            <option value="">Buy & Rent</option>
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
          <select className="filter-input" style={{ ...inp, width: 160 }} value={filters.maxPrice} onChange={e => setFilter("maxPrice", e.target.value)}>
            <option value="">Any Budget</option>
            <option value="5000000">Under ₹50 L</option>
            <option value="10000000">Under ₹1 Cr</option>
            <option value="30000000">Under ₹3 Cr</option>
            <option value="50000000">Under ₹5 Cr</option>
          </select>
          <button onClick={clearFilters} style={{ background: "white", border: "1px solid #E0E0E0", color: "#717171", padding: "8px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            Clear
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{ background: showMap ? "#E03A3C" : "white", color: showMap ? "white" : "#E03A3C", border: "1.5px solid #E03A3C", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            {showMap ? "Hide Map" : "Map View"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", maxWidth: showMap ? "100%" : 1200, margin: "0 auto" }}>

        {/* Sidebar filters */}
        {!showMap && (
          <div style={{ width: 260, flexShrink: 0, padding: "20px 0", position: "sticky", top: 108, height: "calc(100vh - 108px)", overflowY: "auto" }}>
            <div style={{ background: "white", border: "1px solid #E0E0E0", borderRadius: 8, margin: "0 16px", padding: "16px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Filters</div>

              {/* Property type */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Property Type</div>
                {PROPERTY_TYPES.map(({ value, label }) => (
                  <label key={value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                    <input type="radio" name="type" checked={filters.type === value} onChange={() => setFilter("type", value)} style={{ accentColor: "#E03A3C" }} />
                    <span style={{ fontSize: 13, color: "#1A1A1A" }}>{label}</span>
                  </label>
                ))}
              </div>
              {filters.type !== "Residential Land" && filters.type !== "Farm House" && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>BHK</div>
                  {BHK_OPTIONS.map(({ value, label }) => (
                    <label key={value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                      <input type="radio" name="bedrooms" checked={filters.bedrooms === value} onChange={() => setFilter("bedrooms", value)} style={{ accentColor: "#E03A3C" }} />
                      <span style={{ fontSize: 13, color: "#1A1A1A" }}>{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Listing type */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Listing Type</div>
                {[["", "Buy & Rent"], ["Buy", "Buy"], ["Rent", "Rent"]].map(([v, l]) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                    <input type="radio" name="listing" checked={filters.listing === v} onChange={() => setFilter("listing", v)} style={{ accentColor: "#E03A3C" }} />
                    <span style={{ fontSize: 13, color: "#1A1A1A" }}>{l}</span>
                  </label>
                ))}
              </div>

              {/* Budget */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Max Budget</div>
                <input className="filter-input" type="number" placeholder="Enter max price (₹)" value={filters.maxPrice} onChange={e => setFilter("maxPrice", e.target.value)} style={{ ...inp, fontSize: 13 }} />
              </div>

              {/* Status */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Status</div>
                {[["", "All"], ["available", "Available"], ["sold", "Sold"]].map(([v, l]) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                    <input type="radio" name="status" checked={(filters.status || "") === v} onChange={() => setFilter("status", v)} style={{ accentColor: "#E03A3C" }} />
                    <span style={{ fontSize: 13, color: "#1A1A1A" }}>{l}</span>
                  </label>
                ))}
              </div>

              <button onClick={clearFilters} style={{ width: "100%", background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 6, padding: "8px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#717171" }}>
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, padding: "20px 16px" }}>
          {/* Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: "white", border: "1px solid #E0E0E0", borderRadius: 8, padding: "10px 16px" }}>
            <div style={{ fontSize: 14, color: "#717171" }}>
              <strong style={{ color: "#1A1A1A" }}>{pagination.total}</strong> properties found
              {filters.search && <span> for "<strong>{filters.search}</strong>"</span>}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <span style={{ fontSize: 13, color: "#717171" }}>Sort:</span>
                <select
                  style={{ border: "none", outline: "none", fontSize: 13, color: "#1A1A1A", fontFamily: "inherit", cursor: "pointer" }}
                  value={`${filters.sortBy}|${filters.sortOrder}`}
                  onChange={e => {
                    const [sortBy, sortOrder] = e.target.value.split("|");
                    setFilter("sortBy", sortBy);
                    setFilter("sortOrder", sortOrder);
                  }}
                >
                  {SORT_OPTIONS.map(({ label, sortBy, sortOrder }) => (
                    <option key={`${sortBy}|${sortOrder}`} value={`${sortBy}|${sortOrder}`}>{label}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 4, borderLeft: "1px solid #E0E0E0", paddingLeft: 12 }}>
                {["list", "grid"].map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#E03A3C" : "white", color: view === v ? "white" : "#717171", border: "1px solid #E0E0E0", borderRadius: 4, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    {v === "list" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Properties */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ background: "white", borderRadius: 8, height: 160, border: "1px solid #E0E0E0", opacity: 0.5 }} />)}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", background: "white", borderRadius: 8, border: "1px solid #E0E0E0" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="1.5" style={{ margin: "0 auto 16px", display: "block" }}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>No properties found</div>
              <div style={{ fontSize: 14, color: "#717171", marginBottom: 20 }}>Try adjusting your search or filters</div>
              <button onClick={clearFilters} style={{ background: "#E03A3C", color: "white", border: "none", padding: "10px 24px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear Filters</button>
            </div>
          ) : view === "list" ? (
            <div>{properties.map(p => <PropertyCard key={p.id} prop={p} view="list" />)}</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {properties.map(p => <PropertyCard key={p.id} prop={p} view="grid" />)}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 32 }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: currentPage === page ? "none" : "1px solid #E0E0E0",
                    background: currentPage === page ? "#E03A3C" : "white",
                    color: currentPage === page ? "white" : "#1A1A1A",
                    fontWeight: currentPage === page ? 700 : 400,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map panel */}
        {showMap && (
          <div style={{ flex: 1, position: "sticky", top: 108, height: "calc(100vh - 108px)", borderLeft: "1px solid #E0E0E0" }}>
            {!loading && properties.length > 0 && <MapView properties={properties} />}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#f0efe9" }}>
                <div style={{ fontSize: 14, color: "#717171" }}>Loading map...</div>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: "white", border: "1px solid #E0E0E0", borderRadius: 20, padding: "8px 18px", fontSize: 12, color: "#717171", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Click a price pin to view property details
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "sans-serif",
        color: "#999",
        fontSize: 16,
      }}>
        Loading...
      </div>
    }>
      <ListingsPageContent />
    </Suspense>
  );
}
