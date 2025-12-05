# Typography Guide - nico.builds

## Font Families

### Comfortaa (All Text)
- **Weights Available:** 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Usage:** All headings (h1-h6), body text, navigation, buttons, accent text
- **Characteristics:** Modern, rounded, geometric, friendly, highly readable
- **Google Fonts Link:** `https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap`

## Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 2.75rem - 4.5rem (clamp) | 700 | 1.05 | Hero titles, main headings |
| H2 | 2rem - 3rem (clamp) | 700 | 1.1 | Section headers |
| H3 | 1.5rem - 2rem (clamp) | 600 | 1.2 | Subsection headers, card titles |
| H4 | 1.25rem (20px) | 600 | 1.3 | Small headings |
| H5 | 1.125rem (18px) | 600 | 1.4 | Minor headings |
| H6 | 1rem (16px) | 600 | 1.5 | Smallest headings |
| Body | 1rem (16px) | 400 | 1.6 | Paragraphs, body text |
| Small | 0.875rem (14px) | 400 | 1.5 | Captions, metadata |
| Accent | 0.78rem (12.5px) | 500 | 1.4 | Uppercase labels, mantras |

## Letter Spacing

- **Tight:** -0.025em (Large headings)
- **Normal:** 0 (Default)
- **Wide:** 0.025em (Buttons)
- **Wider:** 0.05em (Labels)
- **Widest:** 0.1em (Uppercase text, mantras)

## Usage Guidelines

### Headings
- Always use Comfortaa for headings
- Use weight 700 for h1 and h2
- Use weight 600 for h3-h6
- Maintain tight line-height (1.05-1.2) for headings

### Body Text
- Use Comfortaa for all body content
- Default weight: 400
- Use 500 or 600 for emphasis
- Maintain relaxed line-height (1.6) for readability

### Accent Text
- Use Comfortaa for accent text
- Apply uppercase transformation
- Use wider letter-spacing (0.26em)
- Smaller font size (0.78rem)

### Links
- Color: #12f6ff (Cyan Accent)
- Hover: #ff906f (Coral Accent)
- No underline by default
- Smooth color transition

## Responsive Typography

All heading sizes use `clamp()` for fluid scaling:
- Minimum size for mobile
- Preferred size based on viewport
- Maximum size for large screens

Example: `font-size: clamp(2.75rem, 4vw + 1rem, 4.5rem)`

## Accessibility

- Minimum font size: 16px for body text
- Line height: Minimum 1.5 for readability
- Color contrast: All text meets WCAG AA standards
- Font loading: Uses `display=swap` for performance

## Code Examples

### HTML Structure
```html
<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<h1>Main Heading</h1>
<h2>Section Heading</h2>
<p>Body text content goes here.</p>
<span class="accent-text">UPPERCASE LABEL</span>
```

### CSS Classes
```css
.text-heading { font-family: var(--font-heading); }
.text-body { font-family: var(--font-body); }
.text-accent { font-family: var(--font-accent); }
```

All use Comfortaa font family with different weights as needed.

