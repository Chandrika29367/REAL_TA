"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const pricingPlans = [
  {
    id: "basic",
    title: "Basic",
    price: 499,
    frequency: "month",
    description: "Perfect for first-time listers",
    features: ["1 property listing", "Homepage featured", "Email support", "Basic analytics"],
  },
  {
    id: "professional",
    title: "Professional",
    price: 999,
    frequency: "month",
    description: "Best for active agents",
    features: ["5 property listings", "Premium homepage placement", "Priority inbox", "Advanced analytics", "Lead scoring", "Phone support"],
    popular: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: 2499,
    frequency: "month",
    description: "For large agencies",
    features: ["Unlimited listings", "Top homepage placement", "Dedicated account manager", "Custom branding", "CRM integration", "24/7 dedicated support", "API access"],
  },
];

export default function AdvertisePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (planId) => {
    setSelectedPlan(planId);
    if (!session) {
      setMessage("Please login/register to continue.");
      router.push("/login?redirect=/advertise");
      return;
    }

    if (!["agent", "admin"].includes(session.user?.role)) {
      setMessage("Only agents/admins can purchase ad plans. Contact support.");
      return;
    }

    setStatus("processing");
    setMessage(`Subscribing ${planId}...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      setMessage(`Subscribed to ${planId} plan! Redirecting...`);
      setTimeout(() => router.push(session.user?.role === "admin" ? "/admin" : "/agent-dashboard"), 900);
    } catch (err) {
      setStatus("error");
      setMessage("Subscription failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Premium Advertising</h1>
        <p style={{ fontSize: 16, color: "#666", marginBottom: 30 }}>Boost your property's visibility with our premium advertising plans</p>

        {message && (
          <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 8, background: status === "error" ? "#FFEBEE" : "#E8F5E9", color: status === "error" ? "#C62828" : "#2E7D32", border: `1px solid ${status === "error" ? "#EF9A9A" : "#A5D6A7"}` }}>
            {message}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30, marginBottom: 40 }}>
          {pricingPlans.map((plan) => {
            const active = selectedPlan === plan.id;
            return (
              <div key={plan.id} style={{ border: active ? "2px solid #E03A3C" : "1px solid #e0e0e0", borderRadius: 12, padding: 20, textAlign: "center", boxShadow: active ? "0 0 16px rgba(224,58,60,0.2)" : "none", background: plan.popular ? "#fdf4f3" : "white" }}>
                {plan.popular && <div style={{ marginBottom: 10, display: "inline-block", background: "#E03A3C", color: "white", fontSize: 11, fontWeight: 700, borderRadius: 100, padding: "5px 12px" }}>POPULAR</div>}
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{plan.title}</h2>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#E03A3C", marginBottom: 5 }}>₹{plan.price}<span style={{ fontSize: 14, color: "#999" }}>/ {plan.frequency}</span></div>
                <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>{plan.description}</p>
                <ul style={{ textAlign: "left", marginBottom: 20, color: "#555", fontSize: 14 }}>
                  {plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
                </ul>
                <button onClick={() => handleSubscribe(plan.id)} disabled={status === "processing"} style={{ width: "100%", padding: "10px", background: active ? "#E03A3C" : "#f0f0f0", color: active ? "white" : "#333", border: active ? "none" : "1px solid #ddd", borderRadius: 6, cursor: status === "processing" ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {status === "processing" && active ? "Processing..." : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>

        <section style={{ background: "#f9f9f9", padding: 30, borderRadius: 12, marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Why Advertise with REALTA?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>🎯 Targeted Reach</h3>
              <p style={{ color: "#666" }}>Your properties reach serious buyers in your target market.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>📊 Real-Time Analytics</h3>
              <p style={{ color: "#666" }}>Track views, inquiries, and lead quality in real-time.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>⚡ Quick Setup</h3>
              <p style={{ color: "#666" }}>Start advertising in minutes with our simple process.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>💡 Smart Recommendations</h3>
              <p style={{ color: "#666" }}>AI powered to suggest similar properties to buyers.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>🔐 Secure Platform</h3>
              <p style={{ color: "#666" }}>Your listings and data are fully protected.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>📱 Mobile-First</h3>
              <p style={{ color: "#666" }}>90% of searches happen on mobile devices.</p>
            </div>
          </div>
        </section>

        <div style={{ textAlign: "center", background: "#E03A3C", color: "white", padding: 40, borderRadius: 12 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Ready to Get Started?</h2>
          <p style={{ fontSize: 18, marginBottom: 20 }}>Post your first property for free today</p>
          <button onClick={() => router.push("/property/add")} style={{ background: "white", color: "#E03A3C", padding: "12px 30px", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            Post Free Property
          </button>
        </div>
      </div>
    </>
  );
}
