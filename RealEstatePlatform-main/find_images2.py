import os

for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', '.git']]
    
    for file in files:
        if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            if 'img' in content.lower() or 'Image' in content or 'image' in content or 'photo' in content.lower():
                print(f"✅ Found: {filepath}")