// Core Web Vitals monitoring
export const measureWebVitals = () => {
  try {
    // Custom Web Vitals measurement
    const vitals = {
      cls: 0,
      fid: null,
      fcp: null,
      lcp: null,
      ttfb: null,
      inp: null,
    }

    const observers = []

    // Measure FCP (First Contentful Paint)
    if (typeof PerformanceObserver === 'undefined' || typeof performance === 'undefined') {
      return () => {} // Return empty cleanup function
    }
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = Math.round(entry.startTime)
            trackMetric('FCP', vitals.fcp)
            // Disconnect after first paint to save memory
            paintObserver.disconnect()
          }
        }
      })
      paintObserver.observe({ entryTypes: ['paint'] })
      observers.push(paintObserver)

      // Measure LCP (Largest Contentful Paint) - disconnect after measurement
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        vitals.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime)
        trackMetric('LCP', vitals.lcp)
        
        // Disconnect after 10 seconds to prevent memory buildup
        if (performance.now() > 10000) {
          lcpObserver.disconnect()
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      observers.push(lcpObserver)
      
      // Auto-disconnect LCP after page load
      const lcpLoadHandler = () => {
        setTimeout(() => {
          if (lcpObserver) lcpObserver.disconnect()
        }, 5000)
      }
      window.addEventListener('load', lcpLoadHandler, { once: true })

      // Measure CLS (Cumulative Layout Shift) - limit duration
      let clsValue = 0
      let clsStartTime = performance.now()
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0
            vitals.cls = clsValue
          }
        }
        trackMetric('CLS', vitals.cls)
        
        // Disconnect after 30 seconds to prevent memory buildup
        if (performance.now() - clsStartTime > 30000) {
          clsObserver.disconnect()
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      observers.push(clsObserver)

      // Measure TTFB (Time to First Byte) - disconnect immediately after
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry
            if (navEntry.responseStart && navEntry.requestStart) {
              vitals.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart)
              trackMetric('TTFB', vitals.ttfb)
              navigationObserver.disconnect()
            }
          }
        }
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
      observers.push(navigationObserver)
    } catch (error) {
      console.warn('Web Vitals measurement not fully supported:', error)
    }

    const isDev = typeof import.meta !== 'undefined' && !import.meta.env?.PROD
    const timeoutIds = []

    const loadHandler = () => {
      const id1 = setTimeout(() => {
        if (isDev) console.log('Web Vitals:', vitals)
        if (window.analytics) {
          window.analytics.track('web_vitals', vitals)
        }
        const id2 = setTimeout(() => {
          observers.forEach((observer) => {
            try {
              observer.disconnect()
            } catch (e) { /* already disconnected */ }
          })
          observers.length = 0
        }, 10000)
        timeoutIds.push(id2)
      }, 3000)
      timeoutIds.push(id1)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('load', loadHandler, { once: true })
    }

    return () => {
      try {
        if (typeof window !== 'undefined') {
          window.removeEventListener('load', loadHandler)
        }
        timeoutIds.forEach((id) => clearTimeout(id))
        timeoutIds.length = 0
        observers.forEach((observer) => {
          try {
            observer.disconnect()
          } catch (e) { /* ignore */ }
        })
        observers.length = 0
      } catch (error) {
        console.warn('Web Vitals cleanup error:', error)
      }
    }
  } catch (error) {
    console.warn('Web Vitals initialization error:', error)
    return () => {} // Return empty cleanup function
  }
}

const trackMetric = (metricName, value) => {
  if (window.analytics) {
    window.analytics.track('web_vital', {
      metric: metricName,
      value,
      rating: getRating(metricName, value),
    })
  }
}

const getRating = (metric, value) => {
  const thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
  }

  const threshold = thresholds[metric]
  if (!threshold) return 'unknown'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}
