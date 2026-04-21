"use client";
import Navbar from "@/components/Navbar";

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 30 }}>Help & Support</h1>

        <div style={{ display: "grid", gap: 30 }}>
          {/* Buying */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 15, color: "#E03A3C" }}>📌 Buying Properties</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>How do I search for properties?</h3>
                <p style={{ color: "#555" }}>Use our search and filter options to find properties by location, price range, property type, and more.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>How do I contact an agent?</h3>
                <p style={{ color: "#555" }}>Click the "Contact Agent" button on any property page to send an inquiry. The agent will respond to your queries.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>Can I save properties?</h3>
                <p style={{ color: "#555" }}>Yes, click the heart icon on any property to save it. Your saved properties can be viewed in your account.</p>
              </div>
            </div>
          </section>

          {/* Listing */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 15, color: "#E03A3C" }}>🏠 Posting Properties</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>Who can post properties?</h3>
                <p style={{ color: "#555" }}>Agents can post properties for free using the "Post Free Property" button at the top of the page.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>What information is required?</h3>
                <p style={{ color: "#555" }}>Title, location, price, area, property type, and description are required. Photos and amenities are optional but recommended.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>How long does approval take?</h3>
                <p style={{ color: "#555" }}>Properties are typically approved within 24 hours for admins, and instantly listed by agents.</p>
              </div>
            </div>
          </section>

          {/* Account */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 15, color: "#E03A3C" }}>👤 Account & Login</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>How do I register?</h3>
                <p style={{ color: "#555" }}>Click "Register" on the login page and fill in your details. Choose your role: Buyer, Agent, or Admin.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>Forgot your password?</h3>
                <p style={{ color: "#555" }}>Currently, please contact our support team at support@realta.com for password reset assistance.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>Can I change my role later?</h3>
                <p style={{ color: "#555" }}>Contact our support team to request a role change.</p>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 15, color: "#E03A3C" }}>💰 EMI Calculator</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>How does the EMI Calculator work?</h3>
                <p style={{ color: "#555" }}>Enter your loan amount, interest rate, and tenure. The calculator will show your monthly EMI payment.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 5 }}>Is this calculator accurate?</h3>
                <p style={{ color: "#555" }}>This is an approximate calculator. Consult your bank for exact EMI details based on your eligibility.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 15, color: "#E03A3C" }}>📞 Contact Support</h2>
            <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8 }}>
              <p><strong>Email:</strong> support@realta.com</p>
              <p><strong>Phone:</strong> +91 8000 1234 567</p>
              <p><strong>Hours:</strong> 9 AM - 6 PM, Mon-Fri</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
