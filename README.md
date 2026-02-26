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

- **robots.txt** & **sitemap.xml** – Generated at build time with the deployment URL (Vercel sets `VERCEL_URL`; use `SITE_URL` to override, e.g. for custom domain)
- **JSON-LD** – Person and WebSite schemas in `index.html`
- **Per-route meta** – Title and description via `useSeo` on each page
- **Open Graph & Twitter** – Meta tags for social previews

**OG image:** Run `npm run og:generate` to regenerate `public/og-image.png` (requires Python + Pillow; see `scripts/requirements-og.txt`).

## Notion Integration

OAuth callback for Notion public integrations is at `/api/notion-callback`. In Vercel, set:

- `NOTION_CLIENT_ID` – OAuth client ID from Notion integration settings  
- `NOTION_CLIENT_SECRET` – OAuth client secret

Redirect URI to use in Notion: `https://nicochikuji-portfolio.vercel.app/api/notion-callback`

## License

Private project - All rights reserved
