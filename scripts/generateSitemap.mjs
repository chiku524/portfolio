#!/usr/bin/env node
/**
 * Generate sitemap.xml and robots.txt with the correct base URL.
 * Uses VERCEL_URL at build time (set by Vercel), or SITE_URL env, or fallback.
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const baseUrl = (() => {
  const vercel = process.env.VERCEL_URL
  const site = process.env.SITE_URL
  if (vercel) return `https://${vercel}`
  if (site) return site.replace(/\/$/, '')
  return 'https://nicochikuji-portfolio.vercel.app' // fallback for local builds; Vercel sets VERCEL_URL
})()

const today = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms-of-service</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/the-blockchain-circus</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/the-blockchain-circus/terms-of-service</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/the-blockchain-circus/privacy-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>
`

const robots = `# Nico Chikuji Portfolio
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap.trim())
writeFileSync(join(publicDir, 'robots.txt'), robots.trim())

console.log(`Generated sitemap.xml and robots.txt with base URL: ${baseUrl}`)
