"use client";
import { useSession } from "next-auth/react";
import { useCompare } from "@/lib/CompareContext";
import { useRouter } from "next/navigation";

export default function CompareBar() {
  const { data: session } = useSession();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const router = useRouter();

  if (!session || compareList.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "white",
      borderTop: "2px solid #E03A3C",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      zIndex: 9998,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
      flexWrap: "wrap",
    }}>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#1a1a1a",
        minWidth: 120,
      }}>
        Compare ({compareList.length}/4)
      </span>

      <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
        {compareList.map((p) => (
          <div key={p.id || p._id} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#f5f5f5",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 12,
          }}>
            <span style={{
              maxWidth: 150,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "#1a1a1a",
              fontWeight: 600,
            }}>
              {p.title || p.name || "Property"}
            </span>
            <span style={{ color: "#E03A3C", fontWeight: 700 }}>
              {p.price ? `₹${p.price}` : "N/A"}
            </span>
            <button
              onClick={() => removeFromCompare(p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#999",
                fontSize: 16,
                padding: 0,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}

        {Array.from({ length: 4 - compareList.length }).map((_, i) => (
          <div key={i} style={{
            width: 120,
            height: 34,
            border: "1px dashed #ddd",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#bbb",
          }}>
            + Add property
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={clearCompare}
          style={{
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: 6,
            padding: "8px 14px",
            fontSize: 13,
            cursor: "pointer",
            color: "#666",
            fontFamily: "inherit",
          }}
        >
          Clear
        </button>
        <button
          onClick={() => {
            const ids = compareList.map((p) => p.id || p._id).join(",");
            router.push(`/compare?ids=${ids}`);
          }}
          disabled={compareList.length < 2}
          style={{
            background: compareList.length < 2 ? "#ccc" : "#E03A3C",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 700,
            cursor: compareList.length < 2 ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          Compare Now →
        </button>
      </div>
    </div>
  );
}
