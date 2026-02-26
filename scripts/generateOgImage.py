#!/usr/bin/env python3
"""
Generate og-image.png (1200x630) for social sharing.
Uses portfolio theme: #11172b, #12f6ff, #ff906f, Comfortaa font.
"""

import os
import sys
from pathlib import Path

# Portfolio theme colors (from index.css)
BG_DARK = (17, 23, 43)       # #11172b
BG_MIDNIGHT = (11, 18, 36)   # #0b1224
ACCENT_CYAN = (18, 246, 255) # #12f6ff
ACCENT_CORAL = (255, 144, 111)  # #ff906f
TEXT_PRIMARY = (244, 248, 255)  # #f4f8ff
TEXT_SECONDARY = (197, 216, 255)  # #c5d8ff

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
FONTS_DIR = SCRIPT_DIR / "fonts"
OUTPUT_PATH = PROJECT_ROOT / "public" / "og-image.png"
WIDTH, HEIGHT = 1200, 630


def get_font_path():
    """Use Comfortaa if available, otherwise fall back to system font."""
    for name in ("Comfortaa-Variable.ttf", "Comfortaa-Regular.ttf"):
        p = FONTS_DIR / name
        if p.exists():
            return str(p)

    # Fallback: common system fonts
    fallbacks = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("/System/Library/Fonts/Helvetica.ttc"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for p in fallbacks:
        if p.exists():
            return str(p)

    return None


def download_comfortaa():
    """Download Comfortaa variable font from Google Fonts if not present."""
    FONTS_DIR.mkdir(exist_ok=True)
    target = FONTS_DIR / "Comfortaa-Variable.ttf"
    if target.exists():
        return str(target)

    try:
        import urllib.request
        url = "https://raw.githubusercontent.com/google/fonts/main/ofl/comfortaa/Comfortaa%5Bwght%5D.ttf"
        urllib.request.urlretrieve(url, target)
        return str(target)
    except Exception as e:
        print(f"Could not download Comfortaa: {e}")
    return None


def main():
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("Install Pillow: pip install Pillow")
        sys.exit(1)

    font_path = get_font_path() or download_comfortaa()
    if not font_path:
        print("No font found. Run the script once to download Comfortaa, or place a .ttf in scripts/fonts/")
        sys.exit(1)

    # Create image with dark gradient background
    img = Image.new("RGB", (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)

    # Subtle gradient overlay (simplified: radial-style vignette)
    for i in range(HEIGHT):
        factor = 1 - 0.3 * (i / HEIGHT) ** 2
        r = int(BG_DARK[0] * factor)
        g = int(BG_DARK[1] * factor)
        b = int(BG_DARK[2] * factor)
        draw.line([(0, i), (WIDTH, i)], fill=(r, g, b))

    # Accent gradient bar at top
    bar_height = 4
    for x in range(WIDTH):
        t = x / WIDTH
        r = int(ACCENT_CYAN[0] * (1 - t) + ACCENT_CORAL[0] * t)
        g = int(ACCENT_CYAN[1] * (1 - t) + ACCENT_CORAL[1] * t)
        b = int(ACCENT_CYAN[2] * (1 - t) + ACCENT_CORAL[2] * t)
        draw.rectangle([(x, 0), (x + 1, bar_height)], fill=(r, g, b))

    # Fonts
    font_large = ImageFont.truetype(font_path, 72)
    font_medium = ImageFont.truetype(font_path, 32)
    font_small = ImageFont.truetype(font_path, 24)

    # Text content
    name = "Nico Chikuji"
    tagline = "Full-Stack Developer • Flow Beyond Limits"
    brand = "nico.builds"

    # Center text vertically with padding
    y_base = HEIGHT // 2 - 60

    # Draw name (centered)
    bbox = draw.textbbox((0, 0), name, font=font_large)
    tw = bbox[2] - bbox[0]
    x_name = (WIDTH - tw) // 2
    draw.text((x_name, y_base), name, fill=ACCENT_CYAN, font=font_large)

    # Draw tagline
    bbox = draw.textbbox((0, 0), tagline, font=font_medium)
    tw = bbox[2] - bbox[0]
    x_tag = (WIDTH - tw) // 2
    draw.text((x_tag, y_base + 90), tagline, fill=TEXT_PRIMARY, font=font_medium)

    # Draw brand at bottom
    bbox = draw.textbbox((0, 0), brand, font=font_small)
    tw = bbox[2] - bbox[0]
    x_brand = (WIDTH - tw) // 2
    draw.text((x_brand, HEIGHT - 50), brand, fill=TEXT_SECONDARY, font=font_small)

    # Save
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUTPUT_PATH, "PNG", optimize=True)
    print(f"Generated {OUTPUT_PATH} ({WIDTH}x{HEIGHT})")


if __name__ == "__main__":
    main()
