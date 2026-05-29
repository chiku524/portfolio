#!/usr/bin/env python3
"""
Generate oceanic-themed social preview images for nico.builds.
  - public/og-image.png       (1200x630, Open Graph / Discord / Twitter)
  - public/social-image.png   (1200x1200, Instagram / LinkedIn / profile)
"""

import math
import random
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    Image = ImageDraw = ImageFilter = None

# Portfolio theme (brand-kit/colors/palette.json)
BG_DARK = (17, 23, 43)          # #11172b Deep Ocean
BG_MIDNIGHT = (11, 18, 36)      # #0b1224 Midnight Depths
BG_INDIGO = (21, 59, 109)       # #153b6d Indigo Reef
ACCENT_CYAN = (18, 246, 255)    # #12f6ff
ACCENT_CORAL = (255, 144, 111)  # #ff906f
ACCENT_TEAL = (20, 201, 201)    # #14c9c9 Teal Lagoon
TEXT_PRIMARY = (244, 248, 255)  # #f4f8ff
TEXT_SECONDARY = (197, 216, 255)  # #c5d8ff
TEXT_TERTIARY = (159, 180, 216)   # #9fb4d8

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
FONTS_DIR = SCRIPT_DIR / "fonts"
PUBLIC_DIR = PROJECT_ROOT / "public"
OG_OUTPUT = PUBLIC_DIR / "og-image.png"
SOCIAL_OUTPUT = PUBLIC_DIR / "social-image.png"

LOGO_CANDIDATES = [
    PROJECT_ROOT / "brand-kit" / "logos" / "logo-primary.png",
    PROJECT_ROOT / "src" / "assets" / "generated-image.png",
]

OG_SIZE = (1200, 630)
SOCIAL_SIZE = (1200, 1200)


def get_font_path():
    for name in ("Comfortaa-Variable.ttf", "Comfortaa-Regular.ttf"):
        path = FONTS_DIR / name
        if path.exists():
            return str(path)

    fallbacks = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("/System/Library/Fonts/Helvetica.ttc"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for path in fallbacks:
        if path.exists():
            return str(path)
    return None


def download_comfortaa():
    FONTS_DIR.mkdir(exist_ok=True)
    target = FONTS_DIR / "Comfortaa-Variable.ttf"
    if target.exists():
        return str(target)

    try:
        import urllib.request

        url = (
            "https://raw.githubusercontent.com/google/fonts/main/ofl/comfortaa/"
            "Comfortaa%5Bwght%5D.ttf"
        )
        urllib.request.urlretrieve(url, target)
        return str(target)
    except Exception as exc:
        print(f"Could not download Comfortaa: {exc}")
    return None


def lerp_color(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def draw_vertical_gradient(draw, width, height, top, bottom):
    for y in range(height):
        t = y / max(height - 1, 1)
        color = lerp_color(top, bottom, t)
        draw.line([(0, y), (width, y)], fill=color)


def draw_glow_orb(canvas, cx, cy, radius, color, peak_alpha=90):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    orb_draw = ImageDraw.Draw(overlay)
    for r in range(radius, 0, -3):
        alpha = int(peak_alpha * (r / radius) ** 1.8)
        orb_draw.ellipse(
            (cx - r, cy - r, cx + r, cy + r),
            fill=(*color, alpha),
        )
    return Image.alpha_composite(canvas, overlay)


def draw_surface_glow(canvas, width):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(overlay)
    for y in range(140):
        alpha = int(55 * (1 - y / 140) ** 2)
        glow_draw.line([(0, y), (width, y)], fill=(*ACCENT_CYAN, alpha))
    return Image.alpha_composite(canvas, overlay)


def wave_y(x, width, amplitude, frequency, phase, baseline):
    return baseline + amplitude * math.sin((x / width) * frequency * math.pi * 2 + phase)


def draw_ocean_waves(canvas, width, height, rng):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    wave_draw = ImageDraw.Draw(overlay)

    layers = [
        (height * 0.72, 26, 1.4, 0.0, (*BG_INDIGO, 180)),
        (height * 0.78, 22, 1.8, 1.2, (*ACCENT_TEAL, 55)),
        (height * 0.84, 18, 2.2, 2.4, (*ACCENT_CYAN, 35)),
        (height * 0.90, 14, 2.8, 0.8, (*ACCENT_CORAL, 22)),
    ]

    for baseline, amplitude, frequency, phase, fill in layers:
        points = [(0, height)]
        step = 8
        for x in range(0, width + step, step):
            y = wave_y(x, width, amplitude, frequency, phase, baseline)
            points.append((x, y))
        points.append((width, height))
        wave_draw.polygon(points, fill=fill)

    # Foam crest highlights
    foam_draw = ImageDraw.Draw(overlay)
    for _ in range(18):
        x = rng.randint(40, width - 40)
        base = wave_y(x, width, 14, 2.8, 0.8, height * 0.90)
        foam_draw.ellipse((x - 18, base - 6, x + 18, base + 6), fill=(*TEXT_PRIMARY, 28))

    return Image.alpha_composite(canvas, overlay)


def draw_bubbles(canvas, width, height, rng, count=28):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    bubble_draw = ImageDraw.Draw(overlay)

    for _ in range(count):
        r = rng.randint(3, 14)
        x = rng.randint(20, width - 20)
        y = rng.randint(int(height * 0.15), int(height * 0.88))
        alpha = rng.randint(18, 55)
        bubble_draw.ellipse(
            (x - r, y - r, x + r, y + r),
            outline=(*ACCENT_CYAN, alpha),
            width=max(1, r // 5),
        )
        highlight_r = max(1, r // 3)
        bubble_draw.ellipse(
            (x - r // 2, y - r // 2, x - r // 2 + highlight_r, y - r // 2 + highlight_r),
            fill=(*TEXT_PRIMARY, alpha + 20),
        )

    return Image.alpha_composite(canvas, overlay)


def draw_bioluminescence(canvas, width, height, rng, count=55):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    spark_draw = ImageDraw.Draw(overlay)

    for _ in range(count):
        x = rng.randint(0, width)
        y = rng.randint(int(height * 0.2), int(height * 0.85))
        r = rng.randint(1, 3)
        color = rng.choice([ACCENT_CYAN, ACCENT_TEAL, ACCENT_CORAL])
        alpha = rng.randint(40, 120)
        spark_draw.ellipse((x - r, y - r, x + r, y + r), fill=(*color, alpha))

    blurred = overlay.filter(ImageFilter.GaussianBlur(radius=1.2))
    return Image.alpha_composite(canvas, blurred)


def draw_current_lines(canvas, width, height, rng):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    line_draw = ImageDraw.Draw(overlay)

    for _ in range(6):
        x0 = rng.randint(-80, width // 3)
        y0 = rng.randint(int(height * 0.25), int(height * 0.7))
        points = []
        steps = rng.randint(8, 14)
        for i in range(steps):
            t = i / max(steps - 1, 1)
            x = x0 + t * rng.randint(width // 2, width)
            y = y0 + math.sin(t * math.pi * 2) * rng.randint(20, 45) + t * 30
            points.append((x, y))
        color = rng.choice([ACCENT_CYAN, ACCENT_TEAL])
        line_draw.line(points, fill=(*color, 22), width=2, joint="curve")

    return Image.alpha_composite(canvas, overlay)


def draw_accent_bar(canvas, width):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    bar_draw = ImageDraw.Draw(overlay)
    bar_height = 5
    for x in range(width):
        t = x / max(width - 1, 1)
        color = lerp_color(ACCENT_CYAN, ACCENT_CORAL, t)
        bar_draw.rectangle((x, 0, x + 1, bar_height), fill=(*color, 255))
    return Image.alpha_composite(canvas, overlay)


def find_logo():
    for path in LOGO_CANDIDATES:
        if path.exists():
            return path
    return None


def paste_logo(canvas, logo_path, width, height, layout):
    logo = Image.open(logo_path).convert("RGBA")
    max_size = 120 if layout == "og" else 160
    logo.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

    if layout == "og":
        x = width - logo.width - 56
        y = 48
    else:
        x = (width - logo.width) // 2
        y = int(height * 0.12)

    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cx = x + logo.width // 2
    cy = y + logo.height // 2
    glow_draw.ellipse(
        (cx - 70, cy - 70, cx + 70, cy + 70),
        fill=(*ACCENT_CYAN, 35),
    )
    canvas = Image.alpha_composite(canvas, glow)
    canvas.alpha_composite(logo, (x, y))
    return canvas


def draw_text_block(draw, width, height, fonts, layout):
    name = "Nico Chikuji"
    tagline = "Full-Stack Developer"
    motto = "Flow Beyond Limits"
    brand = "nico.builds"
    descriptor = "Crafting future internet habitats"

    if layout == "og":
        name_font, tag_font, motto_font, brand_font, desc_font = fonts
        y_name = height // 2 - 95
        name_color = ACCENT_CYAN
    else:
        name_font, tag_font, motto_font, brand_font, desc_font = fonts
        y_name = int(height * 0.46)
        name_color = ACCENT_CYAN

    def centered_text(text, y, font, fill):
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((width - tw) // 2, y), text, fill=fill, font=font)

    centered_text(name, y_name, name_font, name_color)
    centered_text(tagline, y_name + 88, tag_font, TEXT_PRIMARY)
    centered_text(motto, y_name + 138, motto_font, ACCENT_CORAL)
    centered_text(descriptor, y_name + 196, desc_font, TEXT_TERTIARY)
    centered_text(brand, height - (52 if layout == "og" else 64), brand_font, TEXT_SECONDARY)


def build_ocean_canvas(size, layout, rng):
    width, height = size
    base = Image.new("RGBA", size, (*BG_MIDNIGHT, 255))
    draw = ImageDraw.Draw(base)
    draw_vertical_gradient(draw, width, height, BG_MIDNIGHT, BG_DARK)

    canvas = base.convert("RGBA")
    canvas = draw_surface_glow(canvas, width)
    canvas = draw_glow_orb(canvas, int(width * 0.18), int(height * 0.28), 220, ACCENT_TEAL, 70)
    canvas = draw_glow_orb(canvas, int(width * 0.82), int(height * 0.35), 180, ACCENT_CORAL, 55)
    canvas = draw_glow_orb(canvas, int(width * 0.55), int(height * 0.55), 260, ACCENT_CYAN, 45)
    if layout == "social":
        canvas = draw_glow_orb(canvas, int(width * 0.5), int(height * 0.22), 200, ACCENT_TEAL, 40)
    canvas = draw_current_lines(canvas, width, height, rng)
    canvas = draw_bioluminescence(canvas, width, height, rng, count=65 if layout == "social" else 45)
    canvas = draw_ocean_waves(canvas, width, height, rng)
    canvas = draw_bubbles(canvas, width, height, rng, count=34 if layout == "social" else 24)
    canvas = draw_accent_bar(canvas, width)
    return canvas


def generate_image(size, layout, font_path, logo_path, seed=42):
    from PIL import ImageDraw, ImageFont

    rng = random.Random(seed)
    width, height = size
    canvas = build_ocean_canvas(size, layout, rng)

    if logo_path:
        canvas = paste_logo(canvas, logo_path, width, height, layout)

    draw = ImageDraw.Draw(canvas)

    if layout == "og":
        fonts = (
            ImageFont.truetype(font_path, 72),
            ImageFont.truetype(font_path, 34),
            ImageFont.truetype(font_path, 28),
            ImageFont.truetype(font_path, 24),
            ImageFont.truetype(font_path, 22),
        )
    else:
        fonts = (
            ImageFont.truetype(font_path, 84),
            ImageFont.truetype(font_path, 38),
            ImageFont.truetype(font_path, 32),
            ImageFont.truetype(font_path, 28),
            ImageFont.truetype(font_path, 24),
        )

    draw_text_block(draw, width, height, fonts, layout)
    return canvas.convert("RGB")


def main():
    if Image is None:
        print("Install Pillow: pip install Pillow")
        sys.exit(1)

    font_path = get_font_path() or download_comfortaa()
    if not font_path:
        print("No font found. Place a .ttf in scripts/fonts/ or rerun to download Comfortaa.")
        sys.exit(1)

    logo_path = find_logo()
    if logo_path:
        print(f"Using logo: {logo_path}")
    else:
        print("No logo found — generating without logo mark.")

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    og_image = generate_image(OG_SIZE, "og", font_path, logo_path)
    og_image.save(OG_OUTPUT, "PNG", optimize=True)
    print(f"Generated {OG_OUTPUT} ({OG_SIZE[0]}x{OG_SIZE[1]})")

    social_image = generate_image(SOCIAL_SIZE, "social", font_path, logo_path, seed=7)
    social_image.save(SOCIAL_OUTPUT, "PNG", optimize=True)
    print(f"Generated {SOCIAL_OUTPUT} ({SOCIAL_SIZE[0]}x{SOCIAL_SIZE[1]})")


if __name__ == "__main__":
    main()
