// app/api/properties/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type      = searchParams.get("type");
    const listing   = searchParams.get("listing");
    const bedrooms  = searchParams.get("bedrooms");
    const minPrice  = searchParams.get("minPrice");
    const maxPrice  = searchParams.get("maxPrice");
    const search    = searchParams.get("search");
    const featured  = searchParams.get("featured");
    const status    = searchParams.get("status");
    const agentId   = searchParams.get("agentId");
    const page      = parseInt(searchParams.get("page") || "1");
    const limit     = parseInt(searchParams.get("limit") || "12");
    const sortBy    = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const filter = {};

    // All properties are in Vijayawada, so no city filter needed
    
    if (type)    filter.type    = type;
    if (listing) filter.listing_type = listing;  // "P", "R", or "PG"
    if (bedrooms) filter.bedrooms = bedrooms;    // "1", "2", "3", "4", "5+"
    if (status)  filter.status  = status;
    if (featured === "true") filter.featured = true;
    if (agentId) filter.agentId = agentId;       // Filter by agent

    // Search by locality (primary) or title, description
    if (search) {
      filter.$or = [
        { locality:     { $regex: search, $options: "i" } },
        { title:        { $regex: search, $options: "i" } },
        { description:  { $regex: search, $options: "i" } },
        { property_name:{ $regex: search, $options: "i" } },
      ];
    }

    // Price filter: use min_price and max_price fields (stored as strings, need numeric comparison)
    if (minPrice || maxPrice) {
      const priceFilter = [];
      if (minPrice) {
        // min_price >= minPrice
        priceFilter.push({
          $expr: { $gte: [{ $toDouble: "$min_price" }, parseFloat(minPrice)] }
        });
      }
      if (maxPrice) {
        // max_price <= maxPrice
        priceFilter.push({
          $expr: { $lte: [{ $toDouble: "$max_price" }, parseFloat(maxPrice)] }
        });
      }
      if (priceFilter.length === 1) {
        Object.assign(filter, priceFilter[0]);
      } else if (priceFilter.length > 1) {
        filter.$and = priceFilter;
      }
    }

    const skip = (page - 1) * limit;

    if (sortBy === "price") {
      const pipeline = [
        { $match: filter },
        { $addFields: { numericPrice: { $toDouble: { $ifNull: ["$min_price", "0"] } } } },
        { $sort: { numericPrice: sortOrder } },
        { $skip: skip },
        { $limit: limit },
      ];

      const [properties, total] = await Promise.all([
        Property.aggregate(pipeline),
        Property.countDocuments(filter),
      ]);

      return NextResponse.json({
        properties,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    const sort = { [sortBy]: sortOrder };
    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      properties,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "agent" && session.user?.role !== "admin")) {
      return NextResponse.json({ error: "Only agents and admins can post properties" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { title, city, location, price, type, listing, beds, baths, area, status, imageUrl, images, description, amenities } = body;

    if (!title || !city || !location || !price || !area) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await Property.create({
      title,
      city,
      location,
      price: String(price),
      min_price: String(parseFloat(price)),
      max_price: String(parseFloat(price)),
      type: type || "Residential",
      listing: listing || "Buy",
      beds: parseInt(beds) || 0,
      baths: parseInt(baths) || 0,
      area_num: parseFloat(area),
      area: String(area),
      status: status || "available",
      imageUrl: imageUrl || null,
      images: images || [],
      amenities: amenities || [],
      description: description || null,
      agentId: session.user.id,
      source: "manual",
    });

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
