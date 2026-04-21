"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("saved");
  const [savedProperties, setSavedProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Fetch saved properties
    fetch(`/api/saved-properties?userId=${session.user.id}`)
      .then(r => r.json())
      .then(d => setSavedProperties(d.properties || []))
      .catch(() => setSavedProperties([]));

    // Fetch inquiries
    fetch(`/api/inquiries?userId=${session.user.id}`)
      .then(r => r.json())
      .then(d => setInquiries(d.inquiries || []))
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>My Dashboard</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>Welcome back, {session.user?.name?.split(" ")[0]}!</p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 20, borderBottom: "2px solid #e0e0e0", marginBottom: 30 }}>
          {[
            { id: "saved", label: "📌 Saved Properties", count: savedProperties.length },
            { id: "inquiries", label: "💬 My Inquiries", count: inquiries.length },
            { id: "profile", label: "👤 Profile Settings", count: 0 },
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "12px 20px",
                border: "none",
                background: "transparent",
                fontSize: 15,
                fontWeight: tab === id ? 700 : 500,
                color: tab === id ? "#E03A3C" : "#666",
                cursor: "pointer",
                borderBottom: tab === id ? "3px solid #E03A3C" : "3px solid transparent",
                marginBottom: -2,
              }}
            >
              {label} {count > 0 && `(${count})`}
            </button>
          ))}
        </div>

        {/* Saved Properties */}
        {tab === "saved" && (
          <div>
            {savedProperties.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <p style={{ fontSize: 16, marginBottom: 20 }}>No saved properties yet</p>
                <Link href="/listings" style={{ textDecoration: "none" }}>
                  <button style={{
                    background: "#E03A3C",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}>
                    Explore Properties
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {savedProperties.map(prop => (
                  <div key={prop.id || prop._id}>
                    <PropertyCard prop={prop} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inquiries */}
        {tab === "inquiries" && (
          <div>
            {inquiries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <p>No inquiries yet</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 15 }}>
                {inquiries.map(inq => (
                  <div
                    key={inq.id}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                      padding: 20,
                      background: "#fafafa",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
                          {inq.property?.title}
                        </h3>
                        <p style={{ color: "#666", fontSize: 14 }}>{inq.property?.location}</p>
                      </div>
                      <span
                        style={{
                          background: inq.status === "resolved" ? "#E0F2F1" : "#FFF3F0",
                          color: inq.status === "resolved" ? "#00897B" : "#E03A3C",
                          padding: "4px 12px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {inq.status?.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: "#555", marginBottom: 10 }}>Message: {inq.message}</p>
                    <p style={{ fontSize: 12, color: "#999" }}>
                      Sent on {new Date(inq.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/contact-requests?inquiry=${inq.id}`}>
                      <button
                        style={{
                          marginTop: 10,
                          background: "#E03A3C",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        View Conversation
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Settings */}
        {tab === "profile" && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Profile Information</h2>
              <div style={{ display: "grid", gap: 15 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 5 }}>Name</label>
                  <input
                    type="text"
                    value={session.user?.name || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      background: "#f5f5f5",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 5 }}>Email</label>
                  <input
                    type="email"
                    value={session.user?.email || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      background: "#f5f5f5",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 5 }}>Role</label>
                  <input
                    type="text"
                    value={session.user?.role?.toUpperCase() || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      background: "#f5f5f5",
                    }}
                  />
                </div>
              </div>
              <p style={{ color: "#999", fontSize: 12, marginTop: 15 }}>
                Contact support to update profile information
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
