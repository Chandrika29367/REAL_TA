files = [
    r".\components\PropertyCard.js",
    r".\components\PropertyImages.js",
]

for filepath in files:
    print(f"\n{'='*50}")
    print(f"FILE: {filepath}")
    print('='*50)
    with open(filepath, encoding='utf-8', errors='ignore') as f:
        print(f.read())