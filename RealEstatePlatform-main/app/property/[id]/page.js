// app/property/[id]/page.js
import { notFound } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import Navbar from "@/components/Navbar";
import SaveButton from "@/components/SaveButton";
import InquiryForm from "@/components/InquiryForm";
import EMICalculator from "@/components/EMICalculator";
import ContactModal from "@/components/ContactModal";
import PropertyImages from "@/components/PropertyImages";
import StreetView from "@/components/StreetView";
import SatelliteMap from "@/components/SatelliteMap";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { getImageSrc, getImageSrcs, fmtPrice, decodeListing, PLACEHOLDER_IMG } from "@/lib/constants";

async function findProperty(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const byMongoId = await Property.findById(id).lean();
    if (byMongoId) return byMongoId;
  }
  return Property.findOne({ id }).lean();
}

export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const prop = await findProperty(params.id);
    if (!prop) return { title: "Not Found — REALTA" };
    return { title: `${prop.title} in ${prop.locality} — REALTA`, description: prop.description };
  } catch (e) {
    return { title: "Not Found — REALTA" };
  }
}

export default async function PropertyPage({ params }) {
  try {
    await connectDB();
    const prop = await findProperty(params.id);
    if (!prop) notFound();

    const similar = await Property.find({
      _id: { $ne: prop._id },
      status: "available",
      locality: prop.locality,
    }).limit(4).lean();

    const displayPrice = prop.price || fmtPrice(prop.min_price);
    const locality = prop.locality || "Vijayawada";
    const propType = prop.type || "Property";
    const isLand = ["Residential Land", "Farm House"].includes(propType);
    const bhkLabel = prop.bedrooms ? `${prop.bedrooms} BHK` : "Studio";
    const listingType = prop.listing_type ? decodeListing(prop.listing_type) : prop.listing || "Buy";
    const area = prop.area || "N/A";
    const emiPrice =
      parseFloat(prop.min_price) > 0 ? parseFloat(prop.min_price) :
      parseFloat(prop.max_price) > 0 ? parseFloat(prop.max_price) :
      0;

    let pricePerSqft = 0;
    if (prop.price_per_sqft) {
      pricePerSqft = parseFloat(prop.price_per_sqft);
    }

    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#F5F5F5", minHeight: "100vh", color: "#1a1a1a" }}>
        <style suppressHydrationWarning>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #ddd; }
          .sim-card { transition: all 0.2s; }
          .sim-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        `}</style>

        <Navbar />

        {/* Breadcrumb */}
        <div style={{ background: "white", borderBottom: "1px solid #e8e8e8", padding: "10px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: 12, color: "#999", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/listings" style={{ color: "#999", textDecoration: "none" }}>Properties in Vijayawada</Link>
            <span>›</span>
            <Link href={`/listings?search=${encodeURIComponent(locality)}`} style={{ color: "#999", textDecoration: "none" }}>{locality}</Link>
            <span>›</span>
            <span style={{ color: "#1a1a1a", fontWeight: 500 }}>{prop.title}</span>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 40px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* LEFT */}
          <div>

            {/* Images */}
            <PropertyImages
              mainImg={getImageSrc(prop)}
              title={prop.title}
              images={prop.images || []}
              propId={prop.id}
              type={propType}
              status={prop.status}
              featured={prop.featured}
            />

            {/* Price & Title */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#E03A3C", marginBottom: 4, lineHeight: 1 }}>₹{displayPrice}</div>
                  {pricePerSqft > 0 && <div style={{ fontSize: 13, color: "#999", marginBottom: 10 }}>₹{pricePerSqft.toLocaleString()} per sqft</div>}
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{prop.title}</div>
                  <div style={{ fontSize: 14, color: "#717171", display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E03A3C" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {locality}, Vijayawada, Andhra Pradesh
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <SaveButton propertyId={prop.id || prop._id?.toString()} />
                  <button style={{ background: "white", border: "1.5px solid #e0e0e0", color: "#555", padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Share</button>
                </div>
              </div>
            </div>

            {/* Key Details */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Property Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  ["Built-up Area", area],
                  ["Property Type", propType],
                  ["Bedrooms", bhkLabel],
                  ["Listing Type", listingType],
                  ["Status", prop.status?.charAt(0).toUpperCase() + prop.status?.slice(1) || "N/A"],
                  ["Locality", locality],
                ].map(([l, v]) => (
                  <div key={l} style={{ background: "#F9F9F9", borderRadius: 6, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", textTransform: "capitalize" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>About This Property</div>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.85 }}>
                {prop.description || `This ${propType} located in ${locality}, Vijayawada offers ${area} of prime residential space. Strategically located with excellent connectivity and amenities, ideal for modern living. Available for ${listingType.toLowerCase()} at ₹${displayPrice}.`}
              </p>
            </div>

            {/* Property Tour */}
            {isLand ? (
              <SatelliteMap
                latitude={prop.latitude}
                longitude={prop.longitude}
                title={prop.title}
              />
            ) : (
              <StreetView
                latitude={prop.latitude}
                longitude={prop.longitude}
                title={prop.title}
              />
            )}

            {/* EMI Calculator */}
            {emiPrice > 0 && (
              <EMICalculator price={emiPrice} />
            )}

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginTop: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Similar Properties</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                  {similar.map((p) => (
                    <Link key={p._id} href={`/property/${p.id || p._id}`} style={{ textDecoration: "none" }}>
                      <div className="sim-card" style={{ border: "1px solid #e8e8e8", borderRadius: 8, overflow: "hidden", background: "white" }}>
                        <PropertyImages
                          mainImg={getImageSrc(p)}
                          title={p.title}
                          images={p.images || []}
                          propId={p.id}
                          type={p.type}
                          status={p.status}
                          featured={false}
                          thumbnail
                        />
                        <div style={{ padding: "10px 12px" }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#E03A3C", marginBottom: 3 }}>₹{p.price || "N/A"}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                          <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{p.locality || "Vijayawada"}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ position: "sticky", top: 80 }}>

            {/* Inquiry Form */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px", marginBottom: 14 }}>
              <InquiryForm propertyId={prop.id || prop._id} />
            </div>

            {/* Contact Agent */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px", marginBottom: 14 }}>
              <ContactModal agent={prop.seller_name || "REALTA"} propTitle={prop.title} propId={prop.id || prop._id} />
            </div>

            {/* Property Info */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "16px 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Property Info</div>
              {[
                ["Property ID", prop.id || "N/A"],
                ["Listed", prop.posted_date || "Recently"],
                ["Type", propType],
                ["Area", area],
                ["Bedrooms", bhkLabel],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <span style={{ color: "#999" }}>{l}</span>
                  <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error("Error loading property:", e);
    notFound();
  }
}