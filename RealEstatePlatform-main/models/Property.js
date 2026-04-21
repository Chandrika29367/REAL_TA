// models/Property.js
import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    // --- Fields from final_merged.json (scraped data) ---
    id: { type: String },                         // original "P89075154" style ID
    title: { type: String, required: true },
    property_name: { type: String },
    type: { type: String },
    price: { type: String },                      // stored as string e.g. "1.75 - 1.85 Cr"
    price_per_sqft: { type: String },
    min_price: { type: String },
    max_price: { type: String },
    bedrooms: { type: String },
    bathrooms: { type: String },
    area: { type: String },
    area_unit: { type: String },
    total_floors: { type: String },
    age: { type: String },
    furnishing: { type: String },
    facing: { type: mongoose.Schema.Types.Mixed },
    availability: { type: String },
    listing_type: { type: String },
    is_new_launch: { type: String },
    city: { type: String },
    locality: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    description: { type: String },
    highlights: { type: mongoose.Schema.Types.Mixed },
    images: [{ type: String }],
    seller_name: { type: String },
    seller_company: { type: String },
    tags: [{ type: String }],
    posted_date: { type: String },
    verified: { type: mongoose.Schema.Types.Mixed },

    // --- Fields for manually added listings (agents/admin) ---
    location: { type: String },                   // full address string
    listing: { type: String, default: "Buy" },    // "Buy" | "Rent"
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    area_num: { type: Number },                   // numeric area for manual listings
    status: { type: String, default: "available" },
    imageUrl: { type: String },
    amenities: [{ type: String }],
    featured: { type: Boolean, default: false },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    source: { type: String, default: "scraped" }, // "scraped" | "manual"
  },
  { timestamps: true }
);

// Text index for search
PropertySchema.index({ title: "text", city: "text", locality: "text", description: "text", type: "text" });

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);
