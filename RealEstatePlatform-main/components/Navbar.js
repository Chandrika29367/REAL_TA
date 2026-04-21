"use client";
// components/Navbar.js
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function NavbarContent() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentListing = searchParams.get("listing") || searchParams.get("listing_type");
  const currentType = searchParams.get("type");

  // Determine active tab
  const getActive = (label) => {
    if (label === "Properties" && pathname === "/listings" && !currentListing && !currentType) return true;
    if (label === "Buy" && (currentListing === "Buy" || currentListing === "P")) return true;
    if (label === "Rent" && (currentListing === "Rent" || currentListing === "R")) return true;
    if (label === "Admin" && pathname === "/admin") return true;
    return false;
  };

  const navLinks = [
    { label: "Properties", href: "/listings" },
    { label: "Buy", href: "/listings?listing_type=P" },
    { label: "Rent", href: "/listings?listing_type=R" },
  ];

  const handleTopBarClick = (action) => {
    if (action === "Post Free Property") {
      if (!session) {
        router.push("/login");
      } else if (session.user?.role === "agent" || session.user?.role === "admin") {
        router.push("/property/add");
      } else {
        alert("Only agents can post properties");
      }
    } else if (action === "Help") {
      router.push("/help");
    }
  };

  return (
    <>
      {/* Top bar */}
      <div style={{ background: "#1a1a1a", padding: "5px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#888" }}>Vijayawada's #1 Residential Real Estate Platform</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Post Free Property", "Help"].map(l => (
            <span 
              key={l} 
              onClick={() => handleTopBarClick(l)}
              style={{ fontSize: 12, color: "#888", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "#888"}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 56, gap: 4 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", marginRight: 16, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ background: "#E03A3C", width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#E03A3C", letterSpacing: "-0.5px" }}>REALTA</span>
            </div>
          </Link>

          {/* Nav links with moving red underline */}
          <div style={{ display: "flex", flex: 1 }}>
            {navLinks.map(({ label, href }) => {
              const active = getActive(label);
              return (
                <Link key={label} href={href} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "0 14px",
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#E03A3C" : "#333",
                    borderBottom: active ? "3px solid #E03A3C" : "3px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#E03A3C"; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#333"; } }}
                  >
                    {label}
                  </div>
                </Link>
              );
            })}

            {session?.user?.role === "admin" && (
              <Link href="/admin" style={{ textDecoration: "none" }}>
                <div style={{ padding: "0 14px", height: 56, display: "flex", alignItems: "center", fontSize: 14, fontWeight: getActive("Admin") ? 700 : 500, color: getActive("Admin") ? "#E03A3C" : "#333", borderBottom: getActive("Admin") ? "3px solid #E03A3C" : "3px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>
                  Admin
                </div>
              </Link>
            )}
          </div>

          {/* Auth */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
            {session ? (
              <>
                <span style={{ fontSize: 13, color: "#555" }}>
                  Hi, <strong style={{ color: "#1a1a1a" }}>{session.user?.name?.split(" ")[0]}</strong>
                </span>

                {/* Dashboard Dropdown */}
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    onMouseEnter={e => {
                      e.currentTarget.nextElementSibling.style.display = "block";
                    }}
                    style={{
                      background: "white",
                      border: "1.5px solid #e0e0e0",
                      color: "#555",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Dashboard ▼
                  </button>
                  <div
                    onMouseLeave={e => {
                      e.currentTarget.style.display = "none";
                    }}
                    style={{
                      display: "none",
                      position: "absolute",
                      background: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      top: "100%",
                      right: 0,
                      minWidth: 180,
                      zIndex: 1000,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {session.user?.role === "buyer" && (
                      <Link href="/dashboard" style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid #f0f0f0",
                          color: "#333",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                          onMouseLeave={e => e.currentTarget.style.background = "white"}
                        >
                          My Dashboard
                        </div>
                      </Link>
                    )}
                    {(session.user?.role === "agent" || session.user?.role === "admin") && (
                      <Link href="/agent-dashboard" style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid #f0f0f0",
                          color: "#333",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                          onMouseLeave={e => e.currentTarget.style.background = "white"}
                        >
                          Agent Dashboard
                        </div>
                      </Link>
                    )}
                    {session.user?.role === "buyer" && (
                      <Link href="/dashboard" style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "10px 14px",
                          color: "#333",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                          onMouseLeave={e => e.currentTarget.style.background = "white"}
                        >
                          Dashboard
                        </div>
                      </Link>
                    )}
                    {session.user?.role === "agent" && (
                      <Link href="/agent-dashboard" style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "10px 14px",
                          color: "#333",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                          onMouseLeave={e => e.currentTarget.style.background = "white"}
                        >
                          Agent Dashboard
                        </div>
                      </Link>
                    )}
                    {session.user?.role === "admin" && (
                      <Link href="/admin" style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "10px 14px",
                          color: "#333",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                          onMouseLeave={e => e.currentTarget.style.background = "white"}
                        >
                          Admin Dashboard
                        </div>
                      </Link>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{ background: "transparent", border: "1.5px solid #e0e0e0", color: "#555", padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <button style={{ background: "white", border: "1.5px solid #E03A3C", color: "#E03A3C", padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Login
                  </button>
                </Link>
                <Link href="/register" style={{ textDecoration: "none" }}>
                  <button style={{ background: "#E03A3C", border: "none", color: "white", padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <div style={{ 
        background: "#1a1a1a", 
        padding: "5px 40px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"
      }}>
        <span style={{ fontSize: 12, color: "#888" }}>Vijayawada's #1 Residential Real Estate Platform</span>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ fontSize: 12, color: "#888" }}>Post Free Property</span>
          <span style={{ fontSize: 12, color: "#888" }}>Help</span>
        </div>
      </div>
    }>
      <NavbarContent />
    </Suspense>
  );
}