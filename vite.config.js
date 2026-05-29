import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getSiteUrl } from './scripts/getSiteUrl.mjs'

const siteUrl = getSiteUrl()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-site-url',
      transformIndexHtml(html) {
        return html.replaceAll('__SITE_URL__', siteUrl)
      },
    },
  ],
  // Ensure client-side routing works in production
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // For development server - handle SPA routing
  server: {
    historyApiFallback: true,
  },
})
