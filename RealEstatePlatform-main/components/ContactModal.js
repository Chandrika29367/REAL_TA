"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const PLANS = [
  {
    id: "basic",
    name: "Basic Contact",
    price: 99,
    displayPrice: "₹99",
    features: [
      "Agent phone number",
      "1 site visit request",
      "Valid for 7 days",
    ],
  },
  {
    id: "premium",
    name: "Premium Contact",
    price: 299,
    displayPrice: "₹299",
    recommended: true,
    features: [
      "Agent phone number",
      "WhatsApp access",
      "3 site visit requests",
      "Priority response",
      "Valid for 30 days",
    ],
  },
];

export default function ContactModal({ agent, propTitle, propId }) {
  const { data: session } = useSession();
  const [step, setStep] = useState("plans");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const [orderId] = useState("ORD" + Date.now().toString().slice(-8));

  const handlePayment = async () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      setError("Please fill in all payment details");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid 16-digit card number");
      return;
    }

    setError("");
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setStep("success");
  };

  const handleSendMessage = async () => {
    if (!postMessage.trim()) {
      setError("Please enter a message for the agent");
      return;
    }

    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: postMessage, propertyId: propId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send message");
        return;
      }
      setPostMessage("");
      alert("Message sent to agent!");
    } catch (err) {
      setError("Failed to send message");
    }
  };

  if (!session) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>
          Login to contact the agent
        </p>
        <Link href="/login" style={{ display: "block", background: "#E03A3C", color: "white", padding: "10px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
          Login to Continue
        </Link>
      </div>
    );
  }

  if (step === "plans") {
    return (
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Contact Agent</div>
        <div style={{ fontSize: 12, color: "#999", marginBottom: 14 }}>Select a plan to unlock agent contact details</div>

        {PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            style={{
              border: selectedPlan?.id === plan.id ? "2px solid #E03A3C" : "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 10,
              cursor: "pointer",
              position: "relative",
              background: selectedPlan?.id === plan.id ? "#fff5f5" : "white",
            }}
          >
            {plan.recommended && (
              <div style={{ position: "absolute", top: -10, right: 10, background: "#E03A3C", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                RECOMMENDED
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{plan.name}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#E03A3C" }}>{plan.displayPrice}</span>
            </div>
            {plan.features.map((f) => (
              <div key={f} style={{ fontSize: 12, color: "#555", marginTop: 3 }}>✓ {f}</div>
            ))}
          </div>
        ))}

        <button
          onClick={() => {
            if (!selectedPlan) {
              setError("Please select a plan first");
              return;
            }
            setError("");
            setStep("payment");
          }}
          style={{ background: "#E03A3C", color: "white", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", marginTop: 4 }}
        >
          Continue →
        </button>
        {error && <div style={{ color: "#E03A3C", fontSize: 12, marginTop: 10 }}>{error}</div>}
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setStep("plans")} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18, padding: 0 }}>←</button>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Payment Details</div>
          <div style={{ marginLeft: "auto", fontSize: 16, fontWeight: 800, color: "#E03A3C" }}>{selectedPlan?.displayPrice}</div>
        </div>

        <div style={{ background: "#f9f9f9", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: "#555" }}>
          <div style={{ fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Order Summary</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>{selectedPlan?.name}</span><span>{selectedPlan?.displayPrice}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#999", marginTop: 2 }}><span>Order ID</span><span>{orderId}</span></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Cardholder Name</label>
            <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" style={{ width: "100%", padding: "9px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Card Number</label>
            <input
              value={cardNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
                setCardNumber(val);
              }}
              placeholder="1234 5678 9012 3456"
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", letterSpacing: "0.05em" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ fontSize: 12, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>Expiry Date</label>
              <input
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                  setExpiry(val);
                }}
                placeholder="MM/YY"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#555", fontWeight: 600, display: "block", marginBottom: 4 }}>CVV</label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="123"
                type="password"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>

        {error && <div style={{ color: "#E03A3C", fontSize: 12, marginTop: 8 }}>{error}</div>}

        <button
          onClick={handlePayment}
          disabled={processing}
          style={{ width: "100%", marginTop: 12, background: processing ? "#ccc" : "#E03A3C", color: "white", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontFamily: "inherit" }}
        >
          {processing ? "Processing Payment..." : `Pay ${selectedPlan?.displayPrice}`}
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Payment Successful!</div>
      <div style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>Order ID: {orderId}</div>

      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 16, textAlign: "left", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 10 }}>Agent Contact Details</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 600 }}>{agent || "REALTA Agent"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📞</span>
            <a href="tel:+919876543210" style={{ fontSize: 13, color: "#E03A3C", fontWeight: 600, textDecoration: "none" }}>+91 98765 43210</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>
              WhatsApp Agent
            </a>
          </div>
        </div>
      </div>

      <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 14, textAlign: "left", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>Send a Message to Agent</div>
        <textarea
          value={postMessage}
          onChange={(e) => setPostMessage(e.target.value)}
          placeholder="Hi, I'm interested in this property and would like to schedule a visit..."
          rows={3}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box" }}
        />
        {error && <div style={{ color: "#E03A3C", fontSize: 12, marginTop: 8 }}>{error}</div>}
        <button
          onClick={handleSendMessage}
          style={{ width: "100%", background: "#1a1a1a", color: "white", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}
        >
          Send Message
        </button>
      </div>

      <button
        onClick={() => {
          setStep("plans");
          setSelectedPlan(null);
          setCardNumber("");
          setExpiry("");
          setCvv("");
          setCardName("");
          setPostMessage("");
          setError("");
        }}
        style={{ width: "100%", background: "white", border: "1px solid #e0e0e0", borderRadius: 8, padding: "8px 0", fontSize: 12, cursor: "pointer", color: "#666", fontFamily: "inherit" }}
      >
        Done
      </button>
    </div>
  );
}
