"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AddPropertyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    city: "",
    location: "",
    price: "",
    type: "Residential",
    listing: "Buy",
    beds: "",
    baths: "",
    area: "",
    description: "",
    amenities: [],
    imageUrl: "",
  });

  if (!session || (session?.user?.role !== "agent" && session?.user?.role !== "admin")) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <h1>Access Denied</h1>
          <p>Only agents and admins can post properties.</p>
        </div>
      </>
    );
  }

  const amenitiesList = ["Parking", "Gym", "Pool", "Garden", "Security", "Lift", "Balcony", "Kitchen"];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenities = (e) => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter(a => a !== value)
        : [...prev.amenities, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          beds: parseInt(form.beds) || 0,
          baths: parseInt(form.baths) || 0,
          area: parseFloat(form.area),
          agentId: session.user.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add property");
      
      const data = await response.json();
      router.push(`/property/${data.id || data._id}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }}>Post Free Property</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
            <input
              type="text"
              name="title"
              placeholder="Property Title"
              value={form.title}
              onChange={handleInput}
              required
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            />
            <select
              name="type"
              value={form.type}
              onChange={handleInput}
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            >
              <option>Residential</option>
              <option>Commercial</option>
              <option>Office</option>
              <option>Apartment</option>
            </select>
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleInput}
              required
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            />
            <input
              type="text"
              name="location"
              placeholder="Location / Area Name"
              value={form.location}
              onChange={handleInput}
              required
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            />
          </div>

          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={form.price}
              onChange={handleInput}
              required
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            />
            <select
              name="listing"
              value={form.listing}
              onChange={handleInput}
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            >
              <option>Buy</option>
              <option>Rent</option>
            </select>
          </div>

          {/* Row 4 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15 }}>
            <input
              type="number"
              name="beds"
              placeholder="Bedrooms"
              value={form.beds}
              onChange={handleInput}
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            />
            <input
              type="number"
              name="baths"
              placeholder="Bathrooms"
              value={form.baths}
              onChange={handleInput}
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            />
            <input
              type="number"
              name="area"
              placeholder="Area (sq ft)"
              value={form.area}
              onChange={handleInput}
              required
              style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
            />
          </div>

          {/* Image URL */}
          <input
            type="url"
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleInput}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInput}
            rows={4}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit" }}
          />

          {/* Amenities */}
          <div>
            <label style={{ display: "block", marginBottom: 10, fontWeight: 500 }}>Amenities:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {amenitiesList.map(amenity => (
                <label key={amenity} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={form.amenities.includes(amenity)}
                    onChange={handleAmenities}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#E03A3C",
              color: "white",
              padding: "12px 20px",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {loading ? "Publishing..." : "Publish Property"}
          </button>
        </form>
      </div>
    </>
  );
}
