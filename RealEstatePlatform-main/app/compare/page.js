"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function PropertyComparison({ properties }) {
  if (properties.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Compare Properties</h1>
          <p style={{ color: "#666", marginBottom: 30 }}>Select properties from the listings page to compare</p>
          <Link href="/listings">
            <button style={{
              background: "#E03A3C",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}>
              Browse Properties
            </button>
          </Link>
        </div>
      </>
    );
  }

  const fmtPrice = (n) =>
    n >= 10000000 ? `₹${(n / 10000000).toFixed(1)} Cr` :
      n >= 100000 ? `₹${(n / 100000).toFixed(0)} L` :
        `₹${n?.toLocaleString()}`;

  const prices = properties.map((p) => parseFloat(p.min_price) || 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const getPriceColor = (p) => {
    const price = parseFloat(p.min_price) || 0;
    if (price === minPrice && prices.filter((x) => x === minPrice).length === 1) {
      return "#16a34a";
    }
    if (price === maxPrice && prices.filter((x) => x === maxPrice).length === 1) {
      return "#dc2626";
    }
    return "#1a1a1a";
  };

  const fields = [
    {
      label: "Price",
      fn: (p) => p.price ? `₹${p.price}` : "N/A",
    },
    {
      label: "Type",
      fn: (p) => p.type || "N/A",
    },
    {
      label: "Locality",
      fn: (p) => p.locality || p.location || "N/A",
    },
    {
      label: "Bedrooms",
      fn: (p) => p.bedrooms && p.bedrooms !== "0"
        ? `${p.bedrooms} BHK`
        : "N/A",
    },
    {
      label: "Bathrooms",
      fn: (p) => p.bathrooms && p.bathrooms !== "0"
        ? p.bathrooms
        : "N/A",
    },
    {
      label: "Area",
      fn: (p) => p.area || "N/A",
    },
    {
      label: "Price/sqft",
      fn: (p) => p.price_per_sqft && p.price_per_sqft !== "0"
        ? `₹${parseFloat(p.price_per_sqft).toLocaleString("en-IN")}`
        : "N/A",
    },
    {
      label: "Total Floors",
      fn: (p) => p.total_floors && p.total_floors !== "0"
        ? p.total_floors
        : "N/A",
    },
    {
      label: "Age",
      fn: (p) => p.age && p.age !== "0"
        ? `${p.age} years`
        : "N/A",
    },
    {
      label: "Listing Type",
      fn: (p) => {
        if (p.listing_type === "P") return "Buy";
        if (p.listing_type === "R") return "Rent";
        if (p.listing_type === "PG") return "PG";
        return p.listing || "N/A";
      },
    },
    {
      label: "New Launch",
      fn: (p) => p.is_new_launch === "Y" ? "Yes" : "No",
    },
    {
      label: "Verified",
      fn: (p) => p.verified ? "Yes" : "No",
    },
    {
      label: "Seller",
      fn: (p) => p.seller_name || p.seller_company || "N/A",
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Compare Properties</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>Side-by-side comparison of {properties.length} properties</p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E03A3C" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700 }}>Feature</th>
                {properties.map((prop, i) => (
                  <th key={i} style={{ padding: "12px", textAlign: "center", fontWeight: 700, minWidth: 200 }}>
                    <div style={{ marginBottom: 10 }}>
                      <img
                        src={prop.images?.[0]
                          ? `https://images.weserv.nl/?url=${encodeURIComponent(prop.images[0])}&w=400&q=80`
                          : "/placeholder.jpg"}
                        alt={prop.title || "Property image"}
                        style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 10 }}
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                      {prop.title || "Property"}
                    </div>
                    <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                      {prop.locality || prop.location || "Vijayawada"}, Vijayawada
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#E03A3C", marginBottom: 8 }}>
                      ₹{prop.price || "N/A"}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e0e0e0", background: idx % 2 === 0 ? "white" : "#f9f9f9" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#333" }}>{field.label}</td>
                  {properties.map((prop, i) => {
                    const value = field.fn(prop);
                    const isPrice = field.label === "Price";
                    const color = isPrice ? getPriceColor(prop) : "#555";
                    const weight = isPrice ? (color !== "#555" ? 700 : 400) : 400;

                    return (
                      <td key={i} style={{ padding: "12px", textAlign: "center", color }}>
                        <span style={{ color, fontWeight: weight }}>
                          {value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr style={{ background: "#f9f9f9" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Actions</td>
                {properties.map((prop, i) => (
                  <td key={i} style={{ padding: "12px", textAlign: "center" }}>
                    <Link href={`/property/${prop.id || prop._id}`}>
                      <button style={{
                        background: "#E03A3C",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        View Details
                      </button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (!ids) {
      setLoading(false);
      return;
    }

    const idArray = ids.split(",").map(id => id.trim());
    Promise.all(
      idArray.map(id =>
        fetch(`/api/properties/${id}`).then(r => r.ok ? r.json() : null).catch(() => null)
      )
    ).then(results => {
      setProperties(results.filter(p => p !== null));
      setLoading(false);
    });
  }, [searchParams]);

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

  return <PropertyComparison properties={properties} />;
}

export default function ComparePage() {
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
      <ComparePageContent />
    </Suspense>
  );
}
