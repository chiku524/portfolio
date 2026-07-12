import { useEffect } from 'react'

/**
 * Marks the document as a standalone (non-portfolio) route:
 * clears portfolio scroll-lock leftovers and removes body padding
 * reserved for the fixed portfolio nav.
 */
export function useStandalonePage() {
  useEffect(() => {
    const { body } = document
    body.classList.add('route-standalone')
    body.classList.remove('past-hero', 'is-scrolling')
    body.style.overflow = ''
    body.style.position = ''
    body.style.top = ''
    body.style.width = ''
    delete body.dataset.depth

    return () => {
      body.classList.remove('route-standalone')
    }
  }, [])
}
