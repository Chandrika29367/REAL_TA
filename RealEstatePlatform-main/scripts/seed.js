// scripts/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const PROPERTIES = [
  { title:"Shop", city:"Mumbai", location:"Dahisar East", price:7500000, type:"Shop", listing:"Buy", beds:0, baths:0, area:275, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-3.housingcdn.com%2F354cef8f%2F127449df2c65f581b73bf6e5b282a9c9%2Fv0%2Fversion.jpg&w=800&q=80", featured:true, description:"Modern shop in Dahisar East with carpet area of 400 sqft. Power backup, water storage and CCTV surveillance available." },
  { title:"Ready to use Office Space", city:"Mumbai", location:"Lower Parel", price:100000000, type:"Office Space", listing:"Buy", beds:0, baths:0, area:1700, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-2.housingcdn.com%2F354cef8f%2F0c379d1ab6394af7b618f0016cb70594%2Fv0%2Fversion.jpg&w=800&q=80", featured:true, description:"Premium office space in Lower Parel. Carpet area 1542 sqft. Central AC, 3 private and 5 public parking. CCTV and power backup." },
  { title:"Shop", city:"Mumbai", location:"Dahisar West", price:44700000, type:"Shop", listing:"Buy", beds:0, baths:0, area:745, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-3.housingcdn.com%2F354cef8f%2F4d430884594234ba4c449e1c02996612%2Fv0%2Fversion.jpg&w=800&q=80", featured:true, description:"Prime shop in Dahisar West with carpet area of 745 sqft." },
  { title:"Ready to use Office Space", city:"Mumbai", location:"Andheri West", price:5000000, type:"Office Space", listing:"Buy", beds:0, baths:0, area:175, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-3.housingcdn.com%2F354cef8f%2F083f7f9282df8dd772ba9af7a2877b9f%2Fv0%2Fversion.jpg&w=800&q=80", featured:false, description:"Compact office space in Andheri West. Carpet area 136 sqft. Modern facilities and excellent metro connectivity." },
  { title:"Ready to use Office Space", city:"Mumbai", location:"Andheri West", price:8000000, type:"Office Space", listing:"Buy", beds:0, baths:0, area:250, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-2.housingcdn.com%2F354cef8f%2F36369d63b09d6699a3ec159edd9194ac%2Fv0%2Fversion.jpg&w=800&q=80", featured:false, description:"Well-located office space in Andheri West business hub. 250 sqft with modern amenities and 24/7 security." },
  { title:"Ready to use Office Space", city:"Mumbai", location:"Ghatkopar West", price:7200000, type:"Office Space", listing:"Buy", beds:0, baths:0, area:350, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-3.housingcdn.com%2F354cef8f%2F317daaa8e07358cd9da4ec28bd168553%2Fv0%2Fversion.jpg&w=800&q=80", featured:false, description:"Office space in Ghatkopar West with carpet area 203 sqft. Close to metro station, ideal for small businesses." },
  { title:"Bare shell Office Space", city:"Mumbai", location:"Borivali East", price:27000000, type:"Office Space", listing:"Buy", beds:0, baths:0, area:1100, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-3.housingcdn.com%2F354cef8f%2F0ed76c653abe4f2a778910cc50b17640%2Fv0%2Fversion.jpg&w=800&q=80", featured:false, description:"Bare shell office in Borivali East. Built-up area 1100 sqft. Power backup and parking available." },
  { title:"Bare shell Office Space", city:"Mumbai", location:"Borivali West", price:20100000, type:"Office Space", listing:"Buy", beds:0, baths:0, area:700, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-3.housingcdn.com%2F354cef8f%2F140fbc1c06bddfce5ebbf43471df8e0e%2Fv0%2Fversion.jpg&w=800&q=80", featured:false, description:"Bare shell office in Borivali West. Built-up area 700 sqft with modern day facilities." },
  { title:"Bare shell Office Space", city:"Mumbai", location:"Andheri West", price:22500000, type:"Office Space", listing:"Buy", beds:0, baths:0, area:850, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-2.housingcdn.com%2F354cef8f%2F051c29f4c2e53f674debaf71f042489d%2Fv0%2Fversion.jpg&w=800&q=80", featured:false, description:"10-year old bare shell office in Andheri West. Built-up area 850 sqft with excellent connectivity." },
  { title:"Shop", city:"Mumbai", location:"Malad East", price:13000000, type:"Shop", listing:"Buy", beds:0, baths:0, area:300, status:"available", imageUrl:"https://images.weserv.nl/?url=https%3A%2F%2Fis1-3.housingcdn.com%2F354cef8f%2F765a0b494562575ecb6258a73125091e%2Fv0%2Fversion.jpg&w=800&q=80", featured:false, description:"Ready to move shop in Malad East. Carpet area 220 sqft with contemporary facilities." },
];

const USERS = [
  { name:"Admin User", email:"admin@realty.com", password:"admin123", role:"admin" },
  { name:"John Buyer", email:"john@example.com", password:"john123", role:"buyer" },
  { name:"Priya Agent", email:"priya@realty.com", password:"priya123", role:"agent" },
];

function mapHousingData(item) {
  const areaStr = item.configurations || "";
  let area = 0;
  try { area = parseInt(areaStr.split(" ")[0]) || 0; } catch(e) {}
  const img = item.images && item.images[0] ? item.images[0].url : null;
  const price = item.price ? (item.price.minValue || 0) : 0;
  return {
    title: item.title || item.propertyType || "Untitled",
    city: item.location ? item.location.city : "Mumbai",
    location: item.location ? item.location.locality : "",
    price: parseFloat(price) || 0,
    type: item.propertyType || "Commercial",
    listing: "Buy",
    beds: 0, baths: 0,
    area: area,
    status: "available",
    imageUrl: img ? `https://images.weserv.nl/?url=${encodeURIComponent(img)}&w=800&q=80` : null,
    featured: false,
    description: item.description || "",
  };
}

async function main() {
  console.log("🌱 Seeding database...\n");
  await prisma.inquiry.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared existing data");

  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.create({ data: { ...u, password: hashed } });
  }
  console.log(`✅ Created ${USERS.length} users`);

  let properties = PROPERTIES;
  const jsonPath = path.join(__dirname, "..", "housing_data.json");
  if (fs.existsSync(jsonPath)) {
    console.log("📂 Found housing_data.json — importing...");
    const raw = fs.readFileSync(jsonPath, "utf-8");
    const scraped = JSON.parse(raw);
    const mapped = scraped.map(mapHousingData).filter(p => p.title && p.price > 0);
    if (mapped.length > 0) {
      properties = mapped;
      console.log(`   → Mapped ${mapped.length} properties`);
    }
  }

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }
  console.log(`✅ Created ${properties.length} properties`);

  const user = await prisma.user.findFirst({ where: { role: "buyer" } });
  const property = await prisma.property.findFirst();
  if (user && property) {
    await prisma.inquiry.create({ data: { message: "I'm interested in this property. Can we schedule a visit?", propertyId: property.id, userId: user.id } });
    console.log("✅ Created sample inquiry");
  }

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Login credentials:");
  USERS.forEach(u => console.log(`   ${u.role}: ${u.email} / ${u.password}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());