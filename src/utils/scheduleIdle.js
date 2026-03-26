/**
 * Defer work until the browser is idle, with a max wait (timeout).
 * Falls back to setTimeout when requestIdleCallback is unavailable
 * (e.g. Safari on iOS, many in-app WebViews).
 */
export function scheduleWhenIdle(callback, options = {}) {
  const timeout = options.timeout ?? 2000
  const w = typeof globalThis !== 'undefined' ? globalThis : undefined

  if (w && typeof w.requestIdleCallback === 'function') {
    const id = w.requestIdleCallback(callback, { timeout })
    return () => {
      if (typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(id)
      }
    }
  }

  const run = () => {
    callback({
      didTimeout: true,
      timeRemaining: () => 0,
    })
  }

  const timerId =
    w && typeof w.setTimeout === 'function'
      ? w.setTimeout(run, 1)
      : setTimeout(run, 1)

  return () => {
    if (w && typeof w.clearTimeout === 'function') {
      w.clearTimeout(timerId)
    } else {
      clearTimeout(timerId)
    }
  }
}
