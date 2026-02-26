import { useEffect } from 'react'

/**
 * Updates document title and meta description for SEO.
 * Used by page components to set route-specific meta tags.
 * Note: Social crawlers (Facebook, Twitter, etc.) typically don't execute JS,
 * so OG/Twitter tags remain from index.html. This helps search engines like Google.
 *
 * @param {Object} options
 * @param {string} options.title - Document title
 * @param {string} [options.description] - Meta description (optional)
 */
export function useSeo({ title, description }) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    if (title) {
      document.title = title
    }

    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) {
        meta.setAttribute('content', description)
      }
    }
  }, [title, description])
}
