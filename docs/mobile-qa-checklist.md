# Mobile QA checklist

Use this for manual passes before shipping layout or responsive changes. Pair it with **Chrome DevTools device mode** for quick sweeps and **real devices** (or a cloud lab) for touch, safe areas, and embed behavior.

## Suggested device matrix

| Priority | Device / profile | Viewport (approx.) | Why |
|----------|------------------|--------------------|-----|
| P0 | iPhone SE (3rd gen) | 375 × 667 | Narrow width; catches grid overflow. |
| P0 | iPhone 14/15 | 390 × 844 | Notch / safe-area; common iOS Safari. |
| P0 | Small Android | 360 × 800 | Chrome; different font metrics. |
| P1 | iPhone 14 Pro Max | 430 × 932 | Large phone; spacing and tap targets. |
| P1 | iPad Mini (portrait) | 768 × 1024 | Tablet breakpoint; nav layout switch. |
| P2 | **Landscape** on any phone above | e.g. 844 × 390 | Short vertical space; hero and nav density. |

**Emulation in Chrome:** Device toolbar → pick device → rotate. Add a custom device **320 × 568** if you want to stress-test the narrowest common width.

## Cloud device labs (optional)

- [BrowserStack Live](https://www.browserstack.com/live) or [LambdaTest](https://www.lambdatest.com/) — useful for **Safari on iOS** and **Samsung Internet** without hardware.
- Run at least: **home page**, **Terms**, **Privacy**, and **The Blockchain Circus** (if you ship that route).

## Pass / fail checklist

### Global

- [ ] No **horizontal scroll** on home, legal pages, and circus page at 320px, 375px, and 390px widths.
- [ ] **Safe areas**: content not hidden under notch or home indicator (portrait and landscape).
- [ ] **Skip to main content** link appears on focus and is tappable.
- [ ] **Pull-to-refresh / overscroll** does not leave the page broken (iOS Safari).

### Navigation

- [ ] **Hamburger menu** opens/closes; **Escape** closes; body does not scroll behind the open menu.
- [ ] In-app anchor links (**Proof**, **Skills**, **Contact**) scroll to the right section and close the menu.
- [ ] **Book a build sprint** visible where intended (hidden only on the smallest breakpoint per design).
- [ ] **Audio toggle** still reachable and works where enabled.

### Content sections

- [ ] **Project cards**: thumbnails / video areas not clipped oddly; text readable.
- [ ] **GitHub activity** chart: can **scroll horizontally** if the full grid is wider than the screen.
- [ ] **Contact form**: labels, inputs, validation errors visible; **16px+ font on inputs** (avoids iOS zoom on focus).
- [ ] **Calendly** embed: loads; if the widget is wider than the viewport, **horizontal scroll** inside the card works; **Open Calendly in new tab** works.

### Orientation

- [ ] **Landscape** on a phone: hero headline and CTAs fit without excessive clipping; nav remains usable.
- [ ] Rotate **portrait ↔ landscape** with menu closed — no stuck overlay or wrong scroll position.

### Routes beyond `/`

- [ ] `/terms-of-service`, `/privacy-policy`: long lines wrap; comfortable reading width.
- [ ] `/the-blockchain-circus` (and subpages if used): same overflow and typography checks.

### PWA (if testing install)

- [ ] Add to Home Screen opens; **landscape allowed** (no forced portrait lock).
- [ ] Theme / background colors look acceptable on splash.

### Performance smoke (mobile network)

- [ ] **First paint** reasonable on **Fast 3G** throttling (hero text visible without waiting for heavy assets).
- [ ] No long **main-thread freeze** when scrolling past hero (decorations defer / disable on touch as designed).

---

**Tip:** For regressions after CSS changes, re-check **P0 devices** and **landscape** first; they catch most layout bugs fastest.
