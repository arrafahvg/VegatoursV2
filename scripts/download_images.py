import urllib.request
import os

images = {
    # Hero - Bali rice terraces / tropical landscape
    "hero.jpg": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
    # About section - Bali temple / culture
    "about.jpg": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80",
    # Logo / brand image
    "logo.png": "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&q=80",
    # Destination 1 - Ubud rice terraces
    "destination-1.jpg": "https://images.unsplash.com/photo-1504714146340-959ca07e1f38?w=800&q=80",
    # Destination 2 - Beach / ocean
    "destination-2.jpg": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    # Destination 3 - Temple
    "destination-3.jpg": "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&q=80",
    # Destination 4 - Monkey forest / nature
    "destination-4.jpg": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    # Destination 5 - Waterfall
    "destination-5.jpg": "https://images.unsplash.com/photo-1570488344390-4c9e3e030f9b?w=800&q=80",
    # Destination 6 - Traditional boat
    "destination-6.jpg": "https://images.unsplash.com/photo-1604998103924-89e012e5265a?w=800&q=80",
    # Gallery images
    "gallery-1.jpg": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    "gallery-2.jpg": "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
    "gallery-3.jpg": "https://images.unsplash.com/photo-1530789253388-582c4b4f0c9c?w=800&q=80",
    "gallery-4.jpg": "https://images.unsplash.com/photo-1505881502353-a1986f376d5c?w=800&q=80",
    "gallery-5.jpg": "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?w=800&q=80",
    "gallery-6.jpg": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
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

print("\nDone! Files in:", output_dir)