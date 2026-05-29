#!/usr/bin/env python3
"""
Generate modern, symmetrical oceanic social preview images for nico.builds.
  - public/og-image.png       (1200x630, Open Graph / Discord / Twitter)
  - public/social-image.png   (1200x1200, Instagram / LinkedIn / profile)

Bump IMAGE_VERSION when assets change so crawlers pick up updates.
"""

import math
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ImportError:
    Image = ImageDraw = ImageFilter = ImageFont = None

IMAGE_VERSION = "3"

# Portfolio theme (brand-kit/colors/palette.json)
BG_DARK = (17, 23, 43)
BG_MIDNIGHT = (11, 18, 36)
BG_INDIGO = (21, 59, 109)
ACCENT_CYAN = (18, 246, 255)
ACCENT_CORAL = (255, 144, 111)
ACCENT_TEAL = (20, 201, 201)
TEXT_PRIMARY = (244, 248, 255)
TEXT_SECONDARY = (197, 216, 255)
TEXT_TERTIARY = (159, 180, 216)

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


def draw_radial_base(size):
    width, height = size
    base = Image.new("RGBA", size, (*BG_MIDNIGHT, 255))
    cx, cy = width // 2, int(height * 0.38)
    pixels = base.load()
    max_dist = math.hypot(width, height) * 0.55

    for y in range(height):
        for x in range(width):
            dist = math.hypot(x - cx, y - cy)
            t = min(dist / max_dist, 1.0)
            edge = lerp_color(BG_DARK, BG_MIDNIGHT, y / max(height - 1, 1))
            center = lerp_color(ACCENT_TEAL, BG_MIDNIGHT, 0.82)
            color = lerp_color(center, edge, t ** 1.35)
            pixels[x, y] = (*color, 255)

    return base


def draw_glow_orb(canvas, cx, cy, radius, color, peak_alpha=72):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    orb_draw = ImageDraw.Draw(overlay)
    for r in range(radius, 0, -4):
        alpha = int(peak_alpha * (r / radius) ** 2)
        orb_draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*color, alpha))
    return Image.alpha_composite(canvas, overlay)


def symmetric_wave_y(x, width, amplitude, lobes, baseline):
    """Cosine waves mirrored on the vertical center axis."""
    return baseline + amplitude * math.cos((x - width / 2) / width * lobes * math.pi * 2)


def draw_symmetric_waves(canvas, width, height):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    wave_draw = ImageDraw.Draw(overlay)

    layers = [
        (height * 0.76, 20, 2, (*BG_INDIGO, 210)),
        (height * 0.82, 16, 3, (*ACCENT_TEAL, 70)),
        (height * 0.88, 12, 4, (*ACCENT_CYAN, 42)),
        (height * 0.93, 8, 5, (*ACCENT_CORAL, 28)),
    ]

    for baseline, amplitude, lobes, fill in layers:
        points = [(0, height)]
        step = 6
        for x in range(0, width + step, step):
            points.append((x, symmetric_wave_y(x, width, amplitude, lobes, baseline)))
        points.append((width, height))
        wave_draw.polygon(points, fill=fill)

    return Image.alpha_composite(canvas, overlay)


def draw_surface_glow(canvas, width):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(overlay)
    for y in range(110):
        alpha = int(48 * (1 - y / 110) ** 2)
        glow_draw.line([(0, y), (width, y)], fill=(*ACCENT_CYAN, alpha))
    return Image.alpha_composite(canvas, overlay)


def draw_accent_bar(canvas, width):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    bar_draw = ImageDraw.Draw(overlay)
    for x in range(width):
        t = x / max(width - 1, 1)
        color = lerp_color(ACCENT_CYAN, ACCENT_CORAL, t)
        bar_draw.rectangle((x, 0, x + 1, 4), fill=(*color, 255))
    return Image.alpha_composite(canvas, overlay)


def draw_center_beam(canvas, width, height):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    beam_draw = ImageDraw.Draw(overlay)
    cx = width // 2
    for offset in range(-1, 2):
        beam_draw.line(
            [(cx + offset, int(height * 0.08)), (cx + offset, int(height * 0.92))],
            fill=(*ACCENT_CYAN, 10),
        )
    return Image.alpha_composite(canvas, overlay)


def draw_symmetric_bubbles(canvas, width, height, pairs):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    bubble_draw = ImageDraw.Draw(overlay)

    for x_offset, y_ratio, radius, alpha in pairs:
        for x in (width // 2 - x_offset, width // 2 + x_offset):
            y = int(height * y_ratio)
            bubble_draw.ellipse(
                (x - radius, y - radius, x + radius, y + radius),
                outline=(*ACCENT_CYAN, alpha),
                width=max(1, radius // 4),
            )
            hr = max(1, radius // 3)
            bubble_draw.ellipse(
                (x - radius // 3, y - radius // 3, x - radius // 3 + hr, y - radius // 3 + hr),
                fill=(*TEXT_PRIMARY, alpha + 18),
            )

    return Image.alpha_composite(canvas, overlay)


def draw_symmetric_sparks(canvas, width, height, offsets):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    spark_draw = ImageDraw.Draw(overlay)
    colors = [ACCENT_CYAN, ACCENT_TEAL, ACCENT_CORAL]

    for idx, (x_offset, y_ratio) in enumerate(offsets):
        color = colors[idx % len(colors)]
        y = int(height * y_ratio)
        for x in (width // 2 - x_offset, width // 2 + x_offset):
            spark_draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(*color, 90))

    blurred = overlay.filter(ImageFilter.GaussianBlur(radius=1))
    return Image.alpha_composite(canvas, blurred)


def draw_glass_panel(canvas, box, radius=28):
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    panel_draw = ImageDraw.Draw(overlay)
    x0, y0, x1, y1 = box
    panel_draw.rounded_rectangle(box, radius=radius, fill=(*BG_INDIGO, 95))
    panel_draw.rounded_rectangle(box, radius=radius, outline=(*ACCENT_CYAN, 55), width=2)
    inner = (x0 + 10, y0 + 10, x1 - 10, y1 - 10)
    panel_draw.rounded_rectangle(inner, radius=max(radius - 8, 8), outline=(*ACCENT_TEAL, 24), width=1)
    return Image.alpha_composite(canvas, overlay)


def draw_flourish(draw, width, y, span=140):
    cx = width // 2
    draw.line([(cx - span, y), (cx - 36, y)], fill=(*ACCENT_CYAN, 180), width=2)
    draw.line([(cx + 36, y), (cx + span, y)], fill=(*ACCENT_CORAL, 180), width=2)
    draw.ellipse((cx - 5, y - 5, cx + 5, y + 5), fill=(*TEXT_PRIMARY, 220))


def find_logo():
    for path in LOGO_CANDIDATES:
        if path.exists():
            return path
    return None


def paste_logo_centered(canvas, logo_path, cx, top_y, max_size):
    logo = Image.open(logo_path).convert("RGBA")
    logo.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

    x = cx - logo.width // 2
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    lcx = cx
    lcy = top_y + logo.height // 2
    glow_draw.ellipse((lcx - 58, lcy - 58, lcx + 58, lcy + 58), fill=(*ACCENT_CYAN, 42))
    canvas = Image.alpha_composite(canvas, glow)
    canvas.alpha_composite(logo, (x, top_y))
    return canvas, logo.height


def centered_text(draw, text, y, font, fill, width):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((width - tw) // 2, y), text, fill=fill, font=font)


def build_canvas(size, layout):
    width, height = size
    canvas = draw_radial_base(size)
    canvas = draw_surface_glow(canvas, width)
    canvas = draw_center_beam(canvas, width, height)

    orb_y = int(height * (0.34 if layout == "og" else 0.30))
    orb_radius = int(width * 0.17)
    canvas = draw_glow_orb(canvas, width // 2, orb_y, int(orb_radius * 1.15), ACCENT_CYAN, 38)
    canvas = draw_glow_orb(canvas, int(width * 0.22), orb_y, orb_radius, ACCENT_TEAL, 58)
    canvas = draw_glow_orb(canvas, int(width * 0.78), orb_y, orb_radius, ACCENT_CORAL, 58)

    bubble_pairs = [
        (280, 0.62, 10, 38),
        (360, 0.70, 7, 32),
        (420, 0.55, 5, 28),
        (220, 0.48, 6, 24),
    ]
    if layout == "social":
        bubble_pairs.extend([(300, 0.78, 8, 30), (180, 0.36, 5, 22)])

    spark_offsets = [
        (250, 0.42),
        (330, 0.58),
        (390, 0.66),
        (210, 0.52),
    ]
    if layout == "social":
        spark_offsets.extend([(280, 0.74), (160, 0.38)])

    canvas = draw_symmetric_sparks(canvas, width, height, spark_offsets)
    canvas = draw_symmetric_waves(canvas, width, height)
    canvas = draw_symmetric_bubbles(canvas, width, height, bubble_pairs)
    canvas = draw_accent_bar(canvas, width)
    return canvas


def generate_image(size, layout, font_path, logo_path):
    width, height = size
    canvas = build_canvas(size, layout)

    if layout == "og":
        panel = (140, 96, width - 140, height - 72)
        logo_size = 88
        fonts = (
            ImageFont.truetype(font_path, 64),
            ImageFont.truetype(font_path, 30),
            ImageFont.truetype(font_path, 26),
            ImageFont.truetype(font_path, 22),
            ImageFont.truetype(font_path, 20),
        )
        text_start = height // 2 - 8
    else:
        panel = (110, 150, width - 110, height - 120)
        logo_size = 112
        fonts = (
            ImageFont.truetype(font_path, 76),
            ImageFont.truetype(font_path, 34),
            ImageFont.truetype(font_path, 30),
            ImageFont.truetype(font_path, 24),
            ImageFont.truetype(font_path, 22),
        )
        text_start = int(height * 0.47)

    canvas = draw_glass_panel(canvas, panel, radius=32 if layout == "social" else 28)

    cx = width // 2
    logo_h = 0
    if logo_path:
        logo_top = panel[1] + (24 if layout == "og" else 32)
        canvas, logo_h = paste_logo_centered(canvas, logo_path, cx, logo_top, logo_size)
        text_start = logo_top + logo_h + (18 if layout == "og" else 28)

    draw = ImageDraw.Draw(canvas)
    name_font, tag_font, motto_font, brand_font, desc_font = fonts

    centered_text(draw, "Nico Chikuji", text_start, name_font, ACCENT_CYAN, width)
    centered_text(draw, "Full-Stack Developer", text_start + 76, tag_font, TEXT_PRIMARY, width)
    draw_flourish(draw, width, text_start + 122)
    centered_text(draw, "Flow Beyond Limits", text_start + 138, motto_font, ACCENT_CORAL, width)
    centered_text(draw, "Crafting future internet habitats", text_start + 182, desc_font, TEXT_TERTIARY, width)
    centered_text(draw, "nico.builds", height - (48 if layout == "og" else 56), brand_font, TEXT_SECONDARY, width)

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

    social_image = generate_image(SOCIAL_SIZE, "social", font_path, logo_path)
    social_image.save(SOCIAL_OUTPUT, "PNG", optimize=True)
    print(f"Generated {SOCIAL_OUTPUT} ({SOCIAL_SIZE[0]}x{SOCIAL_SIZE[1]})")

    print(f"Image version: {IMAGE_VERSION}")


if __name__ == "__main__":
    main()
