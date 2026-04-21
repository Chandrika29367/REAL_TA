// scripts/seed-mongo.js
// Run with: node scripts/seed-mongo.js
// Make sure final_merged.json is in the project root before running.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set in .env");
  process.exit(1);
}

// ── Inline schemas (no ES module imports needed for a CJS seed script) ────────

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    role: { type: String, default: "buyer" },
    phone: String,
  },
  { timestamps: true }
);

const PropertySchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const InquirySchema = new mongoose.Schema(
  {
    message: String,
    propertyId: String,
    userId: mongoose.Schema.Types.ObjectId,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const User     = mongoose.models.User     || mongoose.model("User",     UserSchema);
const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);
const Inquiry  = mongoose.models.Inquiry  || mongoose.model("Inquiry",  InquirySchema);

// ── Default users ──────────────────────────────────────────────────────────────

const USERS = [
  { name: "Admin User",  email: "admin@realty.com",   password: "admin123", role: "admin" },
  { name: "John Buyer",  email: "john@example.com",   password: "john123",  role: "buyer" },
  { name: "Priya Agent", email: "priya@realty.com",   password: "priya123", role: "agent" },
];

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  // Clear existing data
  await Promise.all([
    Inquiry.deleteMany(),
    Property.deleteMany(),
    User.deleteMany(),
  ]);
  console.log("🗑️  Cleared existing data");

  // Seed users
  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
  }
  console.log(`✅ Created ${USERS.length} users`);

  // Import final_merged.json
  const jsonPath = path.join(__dirname, "..", "final_merged.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("❌  final_merged.json not found in project root. Place it there and re-run.");
    process.exit(1);
  }

  const raw  = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  // Insert in batches of 100 to avoid hitting document size limits
  const BATCH = 100;
  let inserted = 0;
  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH).map((p) => ({
      ...p,
      id: p.id,
      source: "scraped",
      status: p.status || "available",
    }));
    await Property.insertMany(batch, { ordered: false });
    inserted += batch.length;
    process.stdout.write(`\r   → Inserted ${inserted} / ${data.length} properties...`);
  }
  console.log(`\n✅ Imported ${inserted} properties from final_merged.json`);

  // Sample inquiry
  const buyer    = await User.findOne({ role: "buyer" });
  const property = await Property.findOne();
  if (buyer && property) {
    await Inquiry.create({
      message: "I'm interested in this property. Can we schedule a visit?",
      propertyId: property.id || property._id.toString(),
      userId: buyer._id,
      status: "pending",
    });
    console.log("✅ Created sample inquiry");
  }

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Login credentials:");
  USERS.forEach((u) => console.log(`   ${u.role.padEnd(6)}: ${u.email}  /  ${u.password}`));
}

main()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(() => mongoose.disconnect());
