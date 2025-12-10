# Logo Assets - nico.builds

## Logo Description

The nico.builds logo features a modern, abstract design with:
- **Graphic Element:** Interlocking three-dimensional shapes in shades of blue and orange, creating a dynamic and glossy appearance
- **Design Elements:**
  - Left side: A thin, bright light blue glossy curved line forming a hook shape
  - Center: An orange geometric faceted shape (diamond/pyramid-like) with multiple planes
  - Right side: A large dark blue curved shape resembling a water droplet or folded material with gradients
  - Base: A darker blue crescent-shaped element connecting the bottom parts
- **Text:** "nico.builds" in lowercase, sans-serif font below the graphic
- **Style:** Modern, sleek, polished aesthetic with smooth curves and sharp edges
- **Theme:** Represents fluidity, precision, and dynamic building/creation

## Logo Files

- `logo-primary.png` - Main logo file (PNG with transparent background, optimized)
- `nico.builds logo.jpg` - Original source file

## Processing Logo

To process a new logo file (removes white background, optimizes, and creates app-ready versions):

```bash
npm run logo:process [path-to-logo-file]
```

Or directly:
```bash
node scripts/processLogo.mjs [path-to-logo-file]
```

If no path is provided, it defaults to `brand-kit/logos/nico.builds logo.jpg`.

The script will:
- Remove white/light backgrounds and make them transparent
- Create optimized PNG versions for both brand-kit and app use
- Save to `brand-kit/logos/logo-primary.png` and `src/assets/generated-image.png`

## Logo Usage

### Do's ✅
- Use on dark backgrounds (#11172b, #0b1224)
- Maintain minimum clear space around logo
- Preserve aspect ratio
- Use at appropriate sizes for context

### Don'ts ❌
- Don't stretch or distort the logo
- Don't place on light backgrounds without adjustment
- Don't modify colors or effects
- Don't add effects that conflict with the glow

## Color Variations

The logo is designed for dark backgrounds. For light backgrounds, consider:
- Creating an inverted version
- Using a dark background container
- Applying appropriate contrast adjustments

## Recommended Sizes

- **Favicon:** 32x32px, 64x64px
- **Navigation:** 40-48px height
- **Hero/Banner:** 120-200px width
- **Social Media:** 512x512px (square format)

## Brand Colors in Logo

- **Primary Blue/Cyan:** #12f6ff (glow elements)
- **Secondary Blue:** #153b6d (internal shapes)
- **Orange Accent:** #ff906f (focal point)
- **Background:** Transparent or dark (#11172b)

