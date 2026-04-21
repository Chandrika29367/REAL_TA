"use client";
// components/InquiryForm.js
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function InquiryForm({ propertyId }) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!message.trim()) { setStatus("empty"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, propertyId }),
      });
      if (res.ok) { setStatus("success"); setMessage(""); }
      else { const d = await res.json(); setStatus(d.error || "error"); }
    } catch {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Send Enquiry</div>
      <div style={{ fontSize: 12, color: "#717171", marginBottom: 14 }}>Get details from the agent directly</div>

      {status === "success" && (
        <div style={{ background: "#E0F2F1", border: "1px solid #00897B", borderRadius: 6, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#00897B", fontWeight: 500 }}>
          Inquiry sent! The agent will contact you soon.
        </div>
      )}
      {status && status !== "success" && status !== "empty" && (
        <div style={{ background: "#FEE2E2", border: "1px solid #E03A3C", borderRadius: 6, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#E03A3C" }}>
          {status === "error" ? "Failed to send. Please try again." : status}
        </div>
      )}

      <textarea
        value={message}
        onChange={e => { setMessage(e.target.value); setStatus(null); }}
        placeholder="I'm interested in this property. Please share more details..."
        rows={4}
        disabled={!session}
        style={{
          width: "100%", background: session ? "#F9F9F9" : "#F0F0F0",
          border: `1px solid ${status === "empty" ? "#E03A3C" : "#E0E0E0"}`,
          borderRadius: 6, padding: "12px", fontSize: 13,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          resize: "vertical", outline: "none", color: "#1A1A1A",
          marginBottom: 10, display: "block",
          opacity: session ? 1 : 0.6,
        }}
      />
      {status === "empty" && <div style={{ fontSize: 12, color: "#E03A3C", marginTop: -8, marginBottom: 8 }}>Please enter a message</div>}

      {session ? (
        <button
          onClick={submit}
          disabled={loading}
          style={{ width: "100%", background: "#E03A3C", border: "none", color: "white", padding: "12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: loading ? 0.7 : 1, marginBottom: 8 }}
        >
          {loading ? "Sending..." : "Send Enquiry"}
        </button>
      ) : (
        <Link href="/login">
          <button style={{ width: "100%", background: "#E03A3C", border: "none", color: "white", padding: "12px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>
            Login to Send Enquiry
          </button>
        </Link>
      )}

      <button style={{ width: "100%", background: "white", border: "1.5px solid #E0E0E0", color: "#1A1A1A", padding: "11px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Request Site Visit
      </button>
    </div>
  );
}
