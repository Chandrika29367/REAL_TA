import json

with open("housing_data.json", encoding="utf-8") as f:
    data = json.load(f)

for i, prop in enumerate(data[:3]):
    images = prop.get("images", [])
    if images:
        img = images[0]
        url = img.get("url", "") if isinstance(img, dict) else img
        print(f"\nProperty {i+1}: {prop.get('title', '?')}")
        print(f"Full URL: {url}")
        print(f"All image fields: {img}")