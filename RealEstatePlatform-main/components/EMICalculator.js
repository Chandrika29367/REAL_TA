"use client";
// components/EMICalculator.js
import { useState, useMemo } from "react";
import { fmtPrice } from "@/lib/constants";

export default function EMICalculator({ price = 5000000 }) {
  const [down, setDown]   = useState(Math.round(price * 0.2));
  const [rate, setRate]   = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, totalInterest, totalPayment, principal } = useMemo(() => {
    const principal = Math.max(0, price - down);
    const r = rate / 100 / 12;
    const n = years * 12;
    const emi = r > 0 && n > 0 && principal > 0
      ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
      : 0;
    return { emi, totalInterest: emi * n - principal, totalPayment: emi * n, principal };
  }, [price, down, rate, years]);

  const inp = { border: "1px solid #E0E0E0", borderRadius: 6, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "white", color: "#1A1A1A", width: "100%" };

  return (
    <div style={{ background: "white", borderRadius: 8, border: "1px solid #E0E0E0", padding: "20px 24px" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>EMI Calculator</div>
      <div style={{ fontSize: 12, color: "#717171", marginBottom: 20 }}>Estimate your monthly loan repayment</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, color: "#717171", display: "block", marginBottom: 6 }}>Property Price</label>
          <div style={{ ...inp, background: "#F9F9F9", color: "#717171" }}>{fmtPrice(price)}</div>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#717171", display: "block", marginBottom: 6 }}>Down Payment (₹)</label>
          <input style={inp} type="number" value={down} onChange={e => setDown(+e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#717171", display: "block", marginBottom: 6 }}>Interest Rate — <strong style={{ color: "#E03A3C" }}>{rate.toFixed(1)}%</strong></label>
          <input type="range" min="5" max="20" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} style={{ width: "100%", accentColor: "#E03A3C", marginTop: 8 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#717171", marginTop: 3 }}><span>5%</span><span>20%</span></div>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#717171", display: "block", marginBottom: 6 }}>Loan Tenure — <strong style={{ color: "#E03A3C" }}>{years} years</strong></label>
          <input type="range" min="1" max="30" step="1" value={years} onChange={e => setYears(+e.target.value)} style={{ width: "100%", accentColor: "#E03A3C", marginTop: 8 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#717171", marginTop: 3 }}><span>1yr</span><span>30yr</span></div>
        </div>
      </div>

      <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "16px 20px", marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "#717171", marginBottom: 4 }}>Monthly EMI</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#E03A3C" }}>{fmtPrice(Math.round(emi))}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          ["Loan Amount", fmtPrice(Math.round(principal))],
          ["Total Interest", fmtPrice(Math.round(totalInterest))],
          ["Total Payment", fmtPrice(Math.round(totalPayment))],
        ].map(([l, v]) => (
          <div key={l} style={{ background: "#F9F9F9", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#717171", marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#717171", marginTop: 10 }}>* Approximate values. Actual EMI may vary by bank.</div>
    </div>
  );
}
