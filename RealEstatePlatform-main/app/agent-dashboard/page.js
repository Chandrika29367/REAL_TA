"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AgentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("inquiries");
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "agent" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Fetch agent's listings
    fetch(`/api/properties?agentId=${session.user.id}`)
      .then(r => r.json())
      .then(d => {
        setListings(d.properties || []);
        setStats(prev => ({
          ...prev,
          total: (d.properties || []).length,
          active: (d.properties || []).filter(p => p.status === "available").length,
        }));
      })
      .catch(() => setListings([]));

    // Fetch inquiries for agent's properties
    fetch(`/api/inquiries?agentId=${session.user.id}`)
      .then(r => r.json())
      .then(d => {
        setInquiries(d.inquiries || []);
        setStats(prev => ({ ...prev, inquiries: (d.inquiries || []).length }));
      })
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

  const handleDeleteProperty = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setListings(listings.filter(p => p.id !== id));
        alert("Property deleted successfully");
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      alert("Error deleting property");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Agent Dashboard</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>Manage your properties and inquiries</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {[
            { label: "Total Listings", value: stats.total, color: "#E03A3C" },
            { label: "Active Listings", value: stats.active, color: "#00897B" },
            { label: "Inquiries Received", value: stats.inquiries, color: "#F59E0B" },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                background: "white",
                border: `2px solid ${stat.color}`,
                borderRadius: 12,
                padding: 20,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, marginBottom: 5 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 20, borderBottom: "2px solid #e0e0e0", marginBottom: 30 }}>
          {[
            { id: "inquiries", label: "💬 Inquiries" },
            { id: "listings", label: "📋 My Listings" },
            { id: "add", label: "➕ Add Property" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                if (id === "add") {
                  router.push("/property/add");
                } else {
                  setTab(id);
                }
              }}
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
              {label}
            </button>
          ))}
        </div>

        {/* Inquiries Tab */}
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
                      background: inq.status === "resolved" ? "#E0F2F1" : "#FFF9F5",
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 20, alignItems: "start" }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
                          {inq.property?.title}
                        </h3>
                        <p style={{ color: "#666", fontSize: 14, marginBottom: 10 }}>
                          {inq.property?.location}
                        </p>
                        <p style={{ color: "#555", marginBottom: 5 }}>
                          <strong>From:</strong> {inq.user?.name}
                        </p>
                        <p style={{ color: "#555", marginBottom: 10 }}>
                          <strong>Phone:</strong> {inq.user?.phone || "Not provided"}
                        </p>
                        <p style={{ color: "#555" }}>
                          <strong>Message:</strong> {inq.message}
                        </p>
                        <p style={{ fontSize: 12, color: "#999", marginTop: 10 }}>
                          Received on {new Date(inq.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: inq.status === "resolved" ? "#E0F2F1" : "#FEE2E2",
                            color: inq.status === "resolved" ? "#00897B" : "#E03A3C",
                            padding: "6px 12px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            marginBottom: 10,
                          }}
                        >
                          {inq.status?.toUpperCase()}
                        </span>
                        <Link href={`/contact-requests?inquiry=${inq.id}`}>
                          <button
                            style={{
                              display: "block",
                              width: "100%",
                              background: "#E03A3C",
                              color: "white",
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            Reply
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Listings Tab */}
        {tab === "listings" && (
          <div>
            {listings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <p style={{ marginBottom: 20 }}>No listings yet</p>
                <Link href="/property/add">
                  <button style={{
                    background: "#E03A3C",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}>
                    Create First Listing
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 15 }}>
                {listings.map(prop => (
                  <div
                    key={prop.id}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                      padding: 20,
                      display: "grid",
                      gridTemplateColumns: "150px 1fr 200px",
                      gap: 20,
                      alignItems: "center",
                    }}
                  >
                    {/* Image */}
                    <img
                      src={prop.imageUrl || "https://via.placeholder.com/150"}
                      alt={prop.title}
                      style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6 }}
                    />

                    {/* Details */}
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>{prop.title}</h3>
                      <p style={{ color: "#666", fontSize: 14, marginBottom: 10 }}>{prop.locality || "Location unknown"}</p>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>
                        ₹{prop.price || "N/A"} • {prop.area || "Area N/A"}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 8,
                          background: prop.status === "available" ? "#E0F2F1" : "#FEE2E2",
                          color: prop.status === "available" ? "#00897B" : "#E03A3C",
                          padding: "4px 12px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {prop.status?.toUpperCase()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "grid", gap: 8 }}>
                      <Link href={`/property/${prop.id || prop._id}`}>
                        <button style={{
                          width: "100%",
                          background: "#f0f0f0",
                          border: "1px solid #e0e0e0",
                          padding: "8px 12px",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          View
                        </button>
                      </Link>
                      <Link href={`/property/add?id=${prop.id || prop._id}`}>
                        <button style={{
                          width: "100%",
                          background: "#E3F2FD",
                          border: "1px solid #90CAF9",
                          color: "#1976D2",
                          padding: "8px 12px",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(prop.id)}
                        style={{
                          width: "100%",
                          background: "#FFEBEE",
                          border: "1px solid #EF9A9A",
                          color: "#C62828",
                          padding: "8px 12px",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
