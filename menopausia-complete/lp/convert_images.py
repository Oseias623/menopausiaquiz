from PIL import Image
import os

def convert_to_webp(filename):
    try:
        if os.path.exists(filename):
            img = Image.open(filename)
            webp_filename = os.path.splitext(filename)[0] + ".webp"
            img.save(webp_filename, "WEBP", quality=85)
            print(f"Converted {filename} to {webp_filename}")
        else:
            print(f"File not found: {filename}")
    except Exception as e:
        print(f"Error converting {filename}: {e}")

convert_to_webp("public/ebook-cover-green.png")
