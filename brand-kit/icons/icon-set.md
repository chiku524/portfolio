# Icon Set Guidelines - nico.builds

## Icon Style

Icons should follow the brand's oceanic, modern aesthetic:

### Visual Characteristics
- **Style:** Modern, minimal, geometric
- **Stroke:** 1.5-2px for line icons
- **Corners:** Slightly rounded (2-4px radius)
- **Colors:** Use brand accent colors (#12f6ff, #ff906f, #14c9c9)
- **Background:** Transparent or subtle glow effects

### Design Principles
1. **Clarity:** Icons should be instantly recognizable
2. **Consistency:** Maintain consistent stroke weight and style
3. **Simplicity:** Avoid unnecessary details
4. **Brand Alignment:** Reflect oceanic/tech theme when appropriate

## Recommended Icon Categories

### Navigation Icons
- Home/Portfolio
- Projects/Proof
- Skills/Equipment
- Contact/Signal
- About/Currents

### Social Icons
- Twitter/X
- LinkedIn
- GitHub
- Reddit
- YouTube
- Discord

### Action Icons
- Launch/Ship
- Explore/Dive
- Connect/Signal
- Build/Craft
- Collaborate/Chart

### Technology Icons
- React
- Next.js
- Supabase
- Node.js
- Web3/Blockchain
- AI/ML

### Status Icons
- Active/Live
- In Progress
- Completed
- Featured

## Icon Usage

### Sizes
- **Small:** 16x16px, 20x20px (inline, lists)
- **Medium:** 24x24px, 32x32px (buttons, cards)
- **Large:** 48x48px, 64x64px (featured, hero)
- **Extra Large:** 96x96px, 128x128px (illustrations)

### Colors
- **Default:** #12f6ff (Cyan Accent)
- **Hover:** #ff906f (Coral Accent)
- **Active:** #14c9c9 (Teal Lagoon)
- **Muted:** #9fb4d8 (Mist) for secondary icons

### Spacing
- Maintain minimum 8px padding around icons
- Use consistent spacing in icon groups
- Align icons with text baseline

## Icon Libraries

### Recommended Sources
- **Heroicons** (outline style)
- **Lucide Icons** (modern, consistent)
- **Tabler Icons** (comprehensive set)
- **Custom SVG** (for brand-specific icons)

### Customization
When using icon libraries:
- Adjust stroke weight to 1.5-2px
- Apply brand colors
- Add subtle glow effects for emphasis
- Ensure consistent sizing

## Brand-Specific Icons

### Logo Mark
- Use the main logo as an icon when appropriate
- Scale appropriately for context
- Maintain aspect ratio

### Oceanic Elements
- Wave patterns
- Compass/navigation
- Depth indicators
- Flow arrows

## Implementation

### SVG Format
- Prefer SVG for scalability
- Optimize file sizes
- Include proper viewBox
- Use currentColor for flexibility

### React Components
```jsx
// Example icon component
const Icon = ({ name, size = 24, color = '#12f6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Icon path */}
  </svg>
);
```

### CSS Classes
```css
.icon {
  width: 24px;
  height: 24px;
  color: var(--brand-accent);
  transition: color 0.2s ease;
}

.icon:hover {
  color: var(--brand-accent-soft);
}
```

## Accessibility

- Include descriptive `aria-label` attributes
- Use `role="img"` for decorative icons
- Ensure sufficient color contrast
- Provide text alternatives when icons convey meaning

## Examples

### Navigation Icon
- Style: Outline, 24x24px
- Color: #12f6ff
- Usage: Navigation menu items

### Social Icon
- Style: Filled or outline, 32x32px
- Color: #12f6ff, hover to #ff906f
- Usage: Social media links

### Action Icon
- Style: Outline with accent, 48x48px
- Color: #12f6ff with glow effect
- Usage: Call-to-action buttons

---

*Note: Create or source icons that align with the brand's modern, oceanic aesthetic while maintaining clarity and usability.*

