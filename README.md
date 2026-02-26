# nico.builds Portfolio

Full-stack developer portfolio showcasing projects, skills, and contact information.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Comfortaa** - Typography

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Scripts

- `npm run media:process` - Process media files for projects
- `npm run image:resize` - Resize images
- `npm run og:generate` - Generate `og-image.png` for social sharing (Python + Pillow)

## SEO

The site is optimized for search engines and social sharing:

- **robots.txt** & **sitemap.xml** – In `public/` for crawler discovery
- **JSON-LD** – Person and WebSite schemas in `index.html`
- **Per-route meta** – Title and description via `useSeo` on each page
- **Open Graph & Twitter** – Meta tags for social previews

**OG image:** Run `npm run og:generate` to regenerate `public/og-image.png` (requires Python + Pillow; see `scripts/requirements-og.txt`).

## License

Private project - All rights reserved
