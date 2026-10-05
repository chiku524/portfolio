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
- **Theme:** Steamboat Willie **ink stage** (B&W background) + colorful foreground UI

### Primary colors

- **Cyan Accent:** `#12f6ff` — CTAs, links, UI highlights
- **Coral Accent:** `#ff906f` — Hover states, warmth
- **Teal Lagoon:** `#14c9c9` — UI depth accents
- **Bluish Black:** `#07080b` — Stage background (Willie ink)
- **Near Black:** `#050608` — Deepest stage
- **Cream Paper:** `#f7f2e8` — Primary text

### Quick reference (CSS variables)

```css
--brand-accent: #12f6ff;
--brand-accent-soft: #ff906f;
--brand-accent-deep: #14c9c9;
--brand-bg: #07080b;
--brand-midnight: #050608;
--brand-text-primary: #f7f2e8;
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
- **Ink stage + color cast** — Willie B&W atmosphere behind colorful UI

### Visual principles

1. **Stage vs cast** — Background stays ink B&W; foreground keeps cyan/coral/teal
2. **Cream on ink** — Cream paper text for Willie balance
3. **Fluid motion** — Smooth transitions, wave patterns
4. **Contrast & clarity** — Readability, hierarchy

### Usage do's and don'ts

**Do:** Keep the stage near-black with cream text and grain; use cyan/coral/teal on UI chrome, logos, and cards.

**Don't:** Colorize the background atmosphere; wash out foreground accents to gray; compromise accessibility.

---

## Brand voice

### Tone

- Professional yet approachable
- Technical but accessible
- Playful without being unprofessional
- Confident but collaborative

### Key phrases

- "Flow Beyond Limits"
- "Stay Playful, Ship Serious."
- "Building digital products that perform with precision"
- "Selected Work"
- "Capabilities"
- "Contact"

### Stage vs cast (visual theme only)

The **stage** (page background / atmosphere) is Steamboat Willie ink B&W. The **cast** (UI, logos, cards,
accents) stays colorful. Copy stays professional and direct.

### By context

- **Technical docs:** Clear, precise, structured
- **Project descriptions:** Enthusiastic, outcome-focused
- **Social:** Conversational, engaging
- **Client:** Professional, collaborative

---

## Logo

- **Files:** `brand-kit/logos/logo-primary.png`
- **Usage:** Dark ink backgrounds (#07080b, #050608); maintain clear space; preserve aspect ratio. Keep logo colors.
- **Processing:** `npm run logo:process [path-to-logo]` (removes white background, outputs to `brand-kit/logos/logo-primary.png` and `src/assets/generated-image.png`).

**Sizes:** Favicon 32–64px; Nav 40–48px; Hero 120–200px; Social 512px.

---

## Icons

- **Style:** Modern, minimal, geometric; stroke 1.5–2px; brand colors (#e8e4d4, #b8a890, #7a7568).
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

- Background: #0a0b0e or #050608
- Primary text: #f0ebe0
- Accents: #e8e4d4, #b8a890
- Secondary: #c4bfb3

### Slide types

- **Title:** Logo, title (Comfortaa Bold, #e8e4d4), tagline "Flow Beyond Limits"
- **Section:** Large section number (#e8e4d4), title 36px
- **Content:** Heading 32px, body 18px, bullets
- **Contact:** "Let's Build Together", email, website, CTA button

### Structure

Opening (3–5) → Main (10–15) → Closing (2–3). One idea per slide; 5–7 bullets max; high contrast.

---

## Resources

- **Portfolio:** https://nicochikuji-portfolio.vercel.app
- **Email:** nico.chikuji@gmail.com
- **Fonts:** [Comfortaa on Google Fonts](https://fonts.google.com/specimen/Comfortaa)

*Last updated: 2024 · nico.builds — Flow Beyond Limits*
