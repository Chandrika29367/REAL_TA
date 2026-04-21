"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { getImageSrc, fmtPrice, PLACEHOLDER_IMG } from "@/lib/constants";

// Vijayawada localities
const localities = [
  "Tadepalli",
  "Benz Circle",
  "Moghalrajpuram",
  "Machilipatnam",
  "Dwaraka Nagar",
  "Vijayawada City Center",
];

// Property types found in the scraped data
const propertyTypes = [
  "Residential Apartment",
  "Independent House/Villa",
  "Plot/Land",
  "Commercial Office Space",
  "Shop/Showroom",
  "Builder Floor Apartment",
];

export default function HomePage({ properties: initialProperties = [], total: initialTotal = 0 }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [propType, setPropType] = useState("");
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState(initialProperties);
  const [total, setTotal] = useState(initialTotal);

  useEffect(() => {
    // Fetch properties for the home page
    fetch("/api/properties?limit=20")
      .then(r => r.json())
      .then(d => {
        setProperties(d.properties || []);
        setTotal(d.pagination?.total || 0);
      })
      .catch(() => {
        setProperties([]);
        setTotal(0);
      });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (propType) params.set("type", propType);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div>
      <Navbar />

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: "580px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#1a1a2e" }}>
        {/* Background image */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />

        {/* Dark overlay so text stays readable */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(15,15,40,0.85) 0%, rgba(30,30,70,0.75) 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 900, padding: "0 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, color: "white", marginBottom: 6, letterSpacing: "-0.5px" }}>
            Find the perfect property in Vijayawada
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, marginBottom: 28 }}>
            Andhra Pradesh's fastest growing real estate market
          </p>

          {/* Search box */}
          <div style={{ background: "white", borderRadius: 10, boxShadow: "0 8px 40px rgba(0,0,0,0.3)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 10 }}>
              <select
                value={propType}
                onChange={e => setPropType(e.target.value)}
                style={{ border: "1px solid #e0e0e0", borderRadius: 6, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", color: "#333", background: "white", minWidth: 160, cursor: "pointer" }}
              >
                <option value="">All Types</option>
                {propertyTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 6, padding: "0 12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ flexShrink: 0, marginRight: 8 }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder="Search by locality, project name..."
                  style={{ border: "none", fontSize: 14, flex: 1, padding: "9px 0", fontFamily: "inherit", color: "#333", outline: "none" }}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{ background: "#E03A3C", color: "white", border: "none", padding: "10px 28px", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "background 0.2s" }}
              >
                Search
              </button>
            </div>

            <div style={{ padding: "8px 16px 14px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", borderTop: "1px solid #f5f5f5" }}>
              <span style={{ fontSize: 12, color: "#999" }}>Popular localities:</span>
              {localities.slice(0, 3).map(l => (
                <span
                  key={l}
                  onClick={() => router.push(`/listings?search=${encodeURIComponent(l)}`)}
                  style={{ fontSize: 12, color: "#555", background: "#f5f5f5", border: "1px solid #e8e8e8", padding: "4px 10px", borderRadius: 16, cursor: "pointer", transition: "background 0.2s" }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTINUE BROWSING ── */}
      <div style={{ background: "#f8f8f8", borderBottom: "1px solid #e8e8e8", padding: "10px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 8, alignItems: "center", overflowX: "auto" }}>
          <span style={{ fontSize: 13, color: "#555", flexShrink: 0, fontWeight: 500 }}>Continue browsing...</span>
          {localities.map(l => (
            <Link key={l} href={`/listings?search=${encodeURIComponent(l)}`} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid #e0e0e0", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#333", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                {l}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 20px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>

        {/* Left */}
        <div>

          {/* Recommended Properties */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>Featured Properties</h2>
            <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Curated especially for you</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
              {properties.slice(0, 8).map((prop) => (
                <Link key={prop.id || prop._id} href={`/property/${prop.id || prop._id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "white", border: "1px solid #e8e8e8", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={getImageSrc(prop)}
                        alt={prop.title}
                        style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                        onError={e => { e.target.src = PLACEHOLDER_IMG; }}
                      />
                      <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.75)", color: "white", fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 4 }}>
                        ₹{prop.price || "N/A"}
                      </div>
                      <button
                        onClick={e => e.preventDefault()}
                        style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ padding: "12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prop.title}</div>
                      <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
                        <strong>{prop.locality}</strong>, Vijayawada
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#999" }}>
                        <span>{prop.bedrooms ? `${prop.bedrooms} BHK` : "N/A"}</span>
                        <span>{prop.area || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Link href="/listings" style={{ textDecoration: "none" }}>
                <button style={{ background: "white", border: "1.5px solid #E03A3C", color: "#E03A3C", padding: "10px 32px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  View All {total}+ Properties →
                </button>
              </Link>
            </div>
          </div>

          {/* Property Types */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>Explore Property Types</h2>
            <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>in Vijayawada</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {propertyTypes.slice(0, 4).map((type) => (
                <Link key={type} href={`/listings?type=${encodeURIComponent(type)}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "white", borderRadius: 10, overflow: "hidden", border: "1px solid #e8e8e8", p: "20px 16px", height: 120, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{type}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* High Demand Localities */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Explore Localities</h2>
            <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>in Vijayawada</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {localities.map(l => (
                <Link key={l} href={`/listings?search=${encodeURIComponent(l)}`} style={{ textDecoration: "none" }}>
                  <div style={{ border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#333", cursor: "pointer", background: "white", transition: "all 0.2s" }}>
                    {l}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          {!session ? (
            <div style={{ background: "white", border: "1px solid #e8e8e8", borderRadius: 10, padding: "20px", marginBottom: 16, position: "sticky", top: 72 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Welcome to REALTA</div>
                  <div style={{ fontSize: 12, color: "#999" }}>Vijayawada Real Estate</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#999", marginBottom: 16, lineHeight: 1.5 }}>Explore premium properties across Vijayawada's best localities.</p>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button style={{ width: "100%", background: "#E03A3C", border: "none", color: "white", padding: "12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  LOGIN / REGISTER
                </button>
              </Link>
              <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 8 }}>to access all the features on REALTA</p>
            </div>
          ) : (
            <div style={{ background: "white", border: "1px solid #e8e8e8", borderRadius: 10, padding: "20px", marginBottom: 16, position: "sticky", top: 72 }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
                  Welcome, {session.user?.name?.split(" ")[0] || "User"}
                </span>
                <div style={{ fontSize: 12, color: "#777" }}>Role: {session.user?.role || "buyer"}</div>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                <Link href={session.user?.role === "admin" ? "/admin" : session.user?.role === "agent" ? "/agent-dashboard" : "/dashboard"} style={{ textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "10px", background: "#E03A3C", color: "white", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>
                    {session.user?.role === "admin" ? "Admin Panel" : session.user?.role === "agent" ? "Agent Dashboard" : "My Dashboard"}
                  </button>
                </Link>
                {session.user?.role === "admin" && (
                  <Link href="/agent-dashboard" style={{ textDecoration: "none" }}>
                    <button style={{ width: "100%", padding: "10px", background: "#f0f0f0", border: "1px solid #ddd", borderRadius: 6, color: "#333", fontWeight: 600 }}>Agent Dashboard</button>
                  </Link>
                )}
              </div>
            </div>
          )}

          <div style={{ background: "white", border: "1px solid #e8e8e8", borderRadius: 10, padding: "20px", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 14 }}>Platform Stats</h3>
            {[
              { label: "Verified Listings", value: `${total}+` },
              { label: "Prime Localities", value: `${localities.length}` },
              { label: "Property Types", value: "2" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                <span style={{ color: "#717171" }}>{label}</span>
                <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#f8f8f8", border: "1px solid #e8e8e8", borderRadius: 10, padding: "16px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Links</h3>
            {[
              ["Shops for Sale", "/listings?type=Shop"],
              ["Office Spaces", "/listings?type=Office+Space"],
              ["Lower Parel", "/listings?search=Lower+Parel"],
              ["Andheri West", "/listings?search=Andheri+West"],
              ...(session?.user?.role === "admin" ? [["Admin Dashboard", "/admin"]] : []),
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{ textDecoration: "none" }}>
                <div style={{ fontSize: 13, color: "#E03A3C", padding: "8px 4px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #f0f0f0", transition: "background 0.15s" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E03A3C" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  {label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1a1a2e", padding: "40px 20px 20px", marginTop: 20 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#E03A3C", marginBottom: 10 }}>REALTA</div>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, maxWidth: 260 }}>
                Vijayawada's trusted residential real estate platform. Curated apartments and plots across prime residential areas.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Properties</div>
              {[
                ["Buy Properties", "/listings?listing=Buy"],
                ["Rent Properties", "/listings?listing=Rent"],
                ["Commercial Spaces", "/listings?type=Office+Space"],
                ["Shop for Sale", "/listings?type=Shop"],
              ].map(([label, href]) => (
                <Link key={label} href={href} style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: 13, color: "#777", marginBottom: 10, cursor: "pointer" }}>{label}</div>
                </Link>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Company</div>
              {[
                ["About REALTA", "/"],
                ["Contact Us", "/login"],
                ["Post Property", "/login"],
                ["Admin Panel", "/admin"],
              ].map(([label, href]) => (
                <Link key={label} href={href} style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: 13, color: "#777", marginBottom: 10, cursor: "pointer" }}>{label}</div>
                </Link>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Support</div>
              {[
                ["Browse All", "/listings"],
                ["Login", "/login"],
                ["Register", "/login?tab=register"],
                ["Admin Dashboard", "/admin"],
              ].map(([label, href]) => (
                <Link key={label} href={href} style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: 13, color: "#777", marginBottom: 10, cursor: "pointer" }}>{label}</div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #2a2a3e", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555" }}>
            <span>© 2026 REALTA. All rights reserved.</span>
            <span>Vijayawada Residential Real Estate Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}