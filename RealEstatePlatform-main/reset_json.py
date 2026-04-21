import json

# Read original scraped file
with open("MumbaiCommercialProperties.json", encoding="utf-8") as f:
    data = json.load(f)

# Remove any localImageUrl that was added before
for i in range(len(data)):
    if "localImageUrl" in data[i]:
        del data[i]["localImageUrl"]

# Save as housing_data.json
with open("housing_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Reset complete! {len(data)} properties restored")
print("Original Housing CDN image URLs are back")