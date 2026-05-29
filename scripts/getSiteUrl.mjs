/**
 * Canonical site URL for meta tags, sitemap, and robots.txt.
 * Uses SITE_URL when set (e.g. custom domain on Vercel); otherwise the
 * stable production Vercel URL so social crawlers can fetch og-image.png.
 */
export function getSiteUrl() {
  const site = process.env.SITE_URL?.replace(/\/$/, '')
  if (site) return site
  return 'https://nicochikuji-portfolio.vercel.app'
}
