/** Fine pointer + hover: desktop/trackpad, not phones. */
export function prefersFinePointer() {
  try {
    if (window.matchMedia) {
      return !window.matchMedia('(hover: none) and (pointer: coarse)').matches
    }
  } catch {
    /* ignore */
  }
  return !('ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0)
}

export function prefersReducedMotion() {
  try {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)
  } catch {
    return false
  }
}
