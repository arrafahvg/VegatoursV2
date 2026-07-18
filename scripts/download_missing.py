import urllib.request
import os

images = {
    # Failed ones - alternative URLs
    "destination-5.jpg": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
    "gallery-3.jpg": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    "gallery-4.jpg": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
}

output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "images")
os.makedirs(output_dir, exist_ok=True)

for filename, url in images.items():
    filepath = os.path.join(output_dir, filename)
    if os.path.exists(filepath):
        print(f"SKIP (exists): {filename}")
        continue
    try:
        print(f"Downloading: {filename} ...", end=" ", flush=True)
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(filepath, "wb") as f:
                f.write(response.read())
        size = os.path.getsize(filepath)
        print(f"OK ({size} bytes)")
    except Exception as e:
        print(f"FAILED: {e}")

print("\nDone!")