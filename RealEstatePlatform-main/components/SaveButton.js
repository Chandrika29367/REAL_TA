"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SaveButton({ propertyId }) {
  if (!propertyId) return null;

  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!session) {
      alert("Please login to save properties");
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        // Unsave
        const res = await fetch(`/api/saved-properties?propertyId=${String(propertyId)}`, { method: "DELETE" });
        if (res.ok) {
          setSaved(false);
        } else {
          alert("Failed to unsave property");
        }
      } else {
        // Save
        const res = await fetch("/api/saved-properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: String(propertyId) }),
        });

        if (res.ok) {
          setSaved(true);
          alert("Property saved successfully!");
        } else if (res.status === 401) {
          alert("Please login to save properties");
        } else if (res.status === 409) {
          alert("Already saved!");
          setSaved(true);
        } else {
          const errorData = await res.json();
          alert(`Failed to save: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      style={{
        background: "white",
        border: "1.5px solid #e0e0e0",
        color: "#555",
        padding: "8px 14px",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "..." : saved ? "✓ Saved" : "Save"}
    </button>
  );
}
