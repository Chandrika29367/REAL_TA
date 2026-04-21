import os

# Search for image-related code in the project
for root, dirs, files in os.walk("."):
    # Skip node_modules and .next
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', '.git']]
    
    for file in files:
        if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            if 'housingcdn' in content or 'localImageUrl' in content or 'property.images' in content or 'images[0]' in content:
                print(f"✅ Found image code in: {filepath}")