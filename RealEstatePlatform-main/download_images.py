import json, os, time, requests, random

IMG_FOLDER = "public/property-images"
os.makedirs(IMG_FOLDER, exist_ok=True)

UNSPLASH_ACCESS_KEY = "tuHF8zOGvX3DrYliLMjM-Gh4c1cahahlSUkxenCmAMY"

with open("housing_data.json", encoding="utf-8") as f:
    data = json.load(f)

print(f"Found {len(data)} properties\n")
updated = 0

# Many different keywords — each property gets a different one
KEYWORDS = [
    "office interior modern",
    "retail shop store",
    "commercial building lobby",
    "coworking space desk",
    "shopping mall interior",
    "office workspace window",
    "business center building",
    "open plan office",
    "boutique store interior",
    "corporate office floor",
]

# Track used photo IDs to avoid duplicates
used_ids = set()

for i, prop in enumerate(data):
    prop_id = prop.get("propertyId", prop.get("id", str(i+1)))
    filename = f"prop_{prop_id}.jpg"
    filepath = os.path.join(IMG_FOLDER, filename)

    if os.path.exists(filepath):
        data[i]["localImageUrl"] = f"/property-images/{filename}"