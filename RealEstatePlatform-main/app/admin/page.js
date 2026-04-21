"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalInquiries: 0,
    activeListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "admin") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    fetch("/api/properties?limit=100")
      .then(r => r.json())
      .then(d => {
        setProperties(d.properties || []);
        setStats(prev => ({
          ...prev,
          totalProperties: d.pagination?.total || 0,
          activeListings: (d.properties || []).filter(p => p.status === "available").length,
        }));
      });

    fetch("/api/admin/users")
      .then(r => r.json())
      .then(d => {
        setUsers(d.users || []);
        setStats(prev => ({ ...prev, totalUsers: (d.users || []).length }));
      })
      .catch(() => setUsers([]));

    fetch("/api/inquiries")
      .then(r => r.json())
      .then(d => setStats(prev => ({ ...prev, totalInquiries: d.total || 0 })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.user?.role]);

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

  if (!session || session.user?.role !== "admin") return null;

  const handleDeleteProperty = async (id) => {
    if (!confirm("Delete this property?")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete");
        return;
      }
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert("Error deleting property");
    }
  };

  const handleDeleteUser = async (email) => {
    if (!confirm("Delete this user?")) return;
    try {
      await fetch(`/api/admin/users/${email}`, { method: "DELETE" });
      setUsers(users.filter(u => u.email !== email));
    } catch (e) {
      alert("Error deleting user");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Admin Dashboard</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>Manage platform, users, and listings</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 40 }}>
          {[
            { label: "Total Properties", value: stats.totalProperties, color: "#E03A3C" },
            { label: "Active Listings", value: stats.activeListings, color: "#00897B" },
            { label: "Total Users", value: stats.totalUsers, color: "#F59E0B" },
            { label: "Total Inquiries", value: stats.totalInquiries, color: "#2196F3" },
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
              <div style={{ fontSize: 36, fontWeight: 700, color: stat.color, marginBottom: 5 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 20, borderBottom: "2px solid #e0e0e0", marginBottom: 30 }}>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "properties", label: "🏢 All Properties" },
            { id: "users", label: "👥 Users" },
          ].map(({ id, label }) => (
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
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 12, padding: 30 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Platform Summary</h2>
            <div style={{ display: "grid", gap: 15 }}>
              {[
                { label: "Total Properties:", value: `${stats.totalProperties} listings` },
                { label: "Active Listings:", value: `${stats.activeListings} active` },
                { label: "Total Users:", value: `${stats.totalUsers} registered users` },
                { label: "Inquiries:", value: `${stats.totalInquiries} total inquiries` },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    gap: 20,
                    alignItems: "center",
                    borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none",
                    paddingBottom: i < arr.length - 1 ? 15 : 0,
                  }}
                >
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {tab === "properties" && (
          <div>
            {properties.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <p>No properties</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #E03A3C" }}>
                      {["Title", "Location", "Price", "Status", "Actions"].map(h => (
                        <th key={h} style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(prop => (
                      <tr
                        key={prop.id || prop._id?.toString()}
                        style={{
                          borderBottom: "1px solid #e0e0e0",
                          background: prop.status === "available" ? "white" : "#f5f5f5",
                        }}
                      >
                        <td style={{ padding: 12 }}>{prop.title}</td>
                        <td style={{ padding: 12 }}>{prop.locality || "N/A"}</td>
                        <td style={{ padding: 12 }}>₹{prop.price || "N/A"}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            background: prop.status === "available" ? "#E0F2F1" : "#FEE2E2",
                            color: prop.status === "available" ? "#00897B" : "#E03A3C",
                            padding: "4px 12px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                            {prop.status?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <button
                            onClick={() => handleDeleteProperty(prop._id)}
                            style={{
                              background: "#FFEBEE",
                              border: "1px solid #EF9A9A",
                              color: "#C62828",
                              padding: "6px 12px",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 12,
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div>
            {users.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <p>No users</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #E03A3C" }}>
                      {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                        <th key={h} style={{ padding: 12, textAlign: "left", fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                        <td style={{ padding: 12 }}>{user.name}</td>
                        <td style={{ padding: 12 }}>{user.email}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{user.role}</span>
                        </td>
                        <td style={{ padding: 12, fontSize: 12, color: "#666" }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: 12 }}>
                          <button
                            onClick={() => handleDeleteUser(user.email)}
                            style={{
                              background: "#FFEBEE",
                              border: "1px solid #EF9A9A",
                              color: "#C62828",
                              padding: "6px 12px",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 12,
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}