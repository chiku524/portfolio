# nico.builds Brand Kit

Complete brand assets and guidelines for the nico.builds portfolio brand.

## Directory structure (assets)

```
brand-kit/
├── colors/          # palette.css, palette.json, swatches.html
├── fonts/           # typography.css
├── logos/           # logo-primary.png, etc.
├── guidelines/      # (reference: see sections below)
├── examples/        # email-signature.html
└── templates/       # (reference: see sections below)
```

## Brand identity

- **Name:** nico.builds
- **Tagline:** Flow Beyond Limits
- **Owner:** Nico Chikuji
- **Theme:** Oceanic, modern, tech-focused

### Primary colors

- **Cyan Accent:** `#12f6ff` — Primary CTAs, links
- **Coral Accent:** `#ff906f` — Hover states, warmth
- **Teal Lagoon:** `#14c9c9` — Depth effects, gradients
- **Deep Ocean:** `#11172b` — Primary background
- **Midnight Depths:** `#0b1224` — Deepest backgrounds
- **Light Surface:** `#f4f8ff` — Primary text

### Quick reference (CSS variables)

```css
--brand-accent: #12f6ff;
--brand-accent-soft: #ff906f;
--brand-accent-deep: #14c9c9;
--brand-bg: #11172b;
--brand-midnight: #0b1224;
--brand-text-primary: #f4f8ff;
```

Import: `@import url('./brand-kit/colors/palette.css');`

---

## Typography

### Font: Comfortaa

- **Weights:** 300, 400, 500, 600, 700
- **Usage:** All headings, body, navigation, buttons

```html
<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Type scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | 2.75rem–4.5rem (clamp) | 700 | Hero titles |
| H2 | 2rem–3rem (clamp) | 700 | Section headers |
| H3 | 1.5rem–2rem (clamp) | 600 | Card titles |
| Body | 1rem | 400 | Paragraphs |
| Accent | 0.78rem | 500 | Uppercase labels |

### Letter spacing

- Tight: -0.025em (large headings)
- Wide: 0.05em (labels)
- Widest: 0.1em (uppercase, mantras)

---

## Brand guidelines

### Brand personality

- **Innovative** — Cutting-edge technology
- **Precise** — Attention to detail
- **Playful** — Light tone, professional
- **Community-First** — Collaboration, transparency
- **Oceanic** — Depth, flow, nautical theme

### Visual principles

1. **Depth & dimension** — Gradients, shadows, glow
2. **Fluid motion** — Smooth transitions, wave patterns
3. **Contrast & clarity** — Readability, hierarchy
4. **Modern minimalism** — Clean layouts, breathing room

### Usage do's and don'ts

**Do:** Use brand colors consistently; follow typography hierarchy; maintain oceanic theme subtly; keep voice professional yet approachable.

**Don't:** Modify logo colors/effects; use fonts outside the system; overuse oceanic metaphors; compromise accessibility.

---

## Brand voice

### Tone

- Professional yet approachable
- Technical but accessible
- Playful without being unprofessional
- Confident but collaborative

### Key phrases

- "Flow Beyond Limits"
- "Tide-tested precision"
- "Future internet habitats"
- "Live reefs" (projects)
- "Dive equipment" (skills)
- "Signal the crew" (contact)

### Oceanic metaphors (use sparingly)

- Navigation: "Chart the map", "Signal the crew"
- Depth: "Tide-tested precision", "Deep dive"
- Community: "Live reefs", "Crew on deck"
- Innovation: "Next wave", "Breaking the timeline"

### By context

- **Technical docs:** Clear, precise, structured
- **Project descriptions:** Enthusiastic, outcome-focused
- **Social:** Conversational, engaging
- **Client:** Professional, collaborative

---

## Logo

- **Files:** `brand-kit/logos/logo-primary.png`
- **Usage:** Dark backgrounds (#11172b, #0b1224); maintain clear space; preserve aspect ratio.
- **Processing:** `npm run logo:process [path-to-logo]` (removes white background, outputs to `brand-kit/logos/logo-primary.png` and `src/assets/generated-image.png`).

**Sizes:** Favicon 32–64px; Nav 40–48px; Hero 120–200px; Social 512px.

---

## Icons

- **Style:** Modern, minimal, geometric; stroke 1.5–2px; brand colors (#12f6ff, #ff906f, #14c9c9).
- **Sizes:** Small 16–20px; Medium 24–32px; Large 48–64px.
- **Libraries:** Heroicons, Lucide, Tabler (customize stroke and colors to match brand).
- **Accessibility:** Use `aria-label` and sufficient contrast.

---

## Social media templates

### Twitter/X

Short, punchy. Example:

```
🚢 Just shipped [project name] - [brief description]
Built with [tech stack]. Open for collabs! 🌊
#Web3 #FullStack #BuildInPublic
```

### LinkedIn

Professional, outcome-focused; 2–3 bullets; CTA for collaboration.

### Image sizes

- Twitter/X: 1200×675
- LinkedIn: 1200×627
- Instagram: 1080×1080 or 1080×1350
- GitHub social: 1200×630

Use brand colors and Comfortaa; dark backgrounds.

---

## Presentation template

### Colors

- Background: #11172b or #0b1224
- Primary text: #f4f8ff
- Accents: #12f6ff, #ff906f
- Secondary: #c5d8ff

### Slide types

- **Title:** Logo, title (Comfortaa Bold, #12f6ff), tagline "Flow Beyond Limits"
- **Section:** Large section number (#12f6ff), title 36px
- **Content:** Heading 32px, body 18px, bullets
- **Contact:** "Let's Build Together", email, website, CTA button

### Structure

Opening (3–5) → Main (10–15) → Closing (2–3). One idea per slide; 5–7 bullets max; high contrast.

---

## Resources

- **Portfolio:** https://nico.builds
- **Email:** nico.chikuji@gmail.com
- **Fonts:** [Comfortaa on Google Fonts](https://fonts.google.com/specimen/Comfortaa)

*Last updated: 2024 · nico.builds — Flow Beyond Limits*
