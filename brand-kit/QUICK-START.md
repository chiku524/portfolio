# Quick Start Guide - nico.builds Brand Kit

## 🚀 Get Started in 5 Minutes

### 1. Colors
**Copy these CSS variables:**
```css
--brand-accent: #12f6ff;        /* Primary cyan */
--brand-accent-soft: #ff906f;   /* Coral orange */
--brand-accent-deep: #14c9c9;   /* Teal lagoon */
--brand-bg: #11172b;            /* Deep ocean */
--brand-midnight: #0b1224;      /* Midnight depths */
--brand-text-primary: #f4f8ff;  /* Light surface */
```

**Or import the full palette:**
```css
@import url('./brand-kit/colors/palette.css');
```

### 2. Fonts
**Add to your HTML:**
```html
<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Use in CSS:**
```css
.heading { font-family: 'Comfortaa', sans-serif; font-weight: 700; }
.body { font-family: 'Comfortaa', sans-serif; font-weight: 400; }
```

### 3. Logo
**Location:** `brand-kit/logos/logo-primary.png`

**Usage:**
- Use on dark backgrounds (#11172b or darker)
- Maintain aspect ratio
- Minimum clear space: 20% of logo width

### 4. Brand Voice
**Key phrases:**
- "Flow Beyond Limits"
- "Tide-tested precision"
- "Future internet habitats"

**Tone:**
- Professional yet approachable
- Technical but accessible
- Playful without being unprofessional

### 5. Quick Reference

| Element | Value |
|---------|-------|
| **Primary Color** | #12f6ff (Cyan) |
| **Secondary Color** | #ff906f (Coral) |
| **Background** | #11172b (Deep Ocean) |
| **Heading Font** | Comfortaa (700) |
| **Body Font** | Comfortaa (400) |
| **Tagline** | Flow Beyond Limits |

## 📁 File Locations

- **Colors:** `brand-kit/colors/`
- **Fonts:** `brand-kit/fonts/`
- **Logos:** `brand-kit/logos/`
- **Guidelines:** `brand-kit/guidelines/`
- **Examples:** `brand-kit/examples/`
- **Templates:** `brand-kit/templates/`

## 🎨 Common Use Cases

### Button
```css
.button {
  background: linear-gradient(135deg, #12f6ff, #14c9c9);
  color: #0b1224;
  font-family: 'Comfortaa', sans-serif;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.85rem 1.8rem;
}
```

### Heading
```css
h1 {
  font-family: 'Comfortaa', sans-serif;
  font-weight: 700;
  font-size: clamp(2.75rem, 4vw + 1rem, 4.5rem);
  color: #12f6ff;
}
```

### Card Background
```css
.card {
  background: rgba(8, 47, 73, 0.78);
  border: 1px solid rgba(34, 211, 238, 0.18);
  border-radius: 28px;
}
```

## 📚 Next Steps

1. **Read:** `brand-kit/README.md` for overview
2. **Explore:** `brand-kit/guidelines/brand-guidelines.md` for details
3. **Check:** `brand-kit/examples/` for usage examples
4. **Use:** Templates in `brand-kit/templates/` for quick starts

## ❓ Need Help?

- **Email:** nico.chikuji@gmail.com
- **Website:** nico.builds
- **Full Docs:** See `brand-kit/README.md`

---

*Remember: Consistency is key. Use these assets to maintain brand identity across all touchpoints.*

