// Core Web Vitals monitoring
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(onPerfEntry)
      onFID(onPerfEntry)
      onFCP(onPerfEntry)
      onLCP(onPerfEntry)
      onTTFB(onPerfEntry)
      onINP(onPerfEntry)
    }).catch(() => {
      // web-vitals not available, skip
    })
  }
}

export const measureWebVitals = () => {
  // Custom Web Vitals measurement
  const vitals = {
    cls: 0,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    inp: null,
  }

  // Measure FCP (First Contentful Paint)
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = Math.round(entry.startTime)
            trackMetric('FCP', vitals.fcp)
          }
        }
      })
      paintObserver.observe({ entryTypes: ['paint'] })

      // Measure LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        vitals.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime)
        trackMetric('LCP', vitals.lcp)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Measure CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0
            vitals.cls = clsValue
          }
        }
        trackMetric('CLS', vitals.cls)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Measure TTFB (Time to First Byte)
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            vitals.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart)
            trackMetric('TTFB', vitals.ttfb)
          }
        }
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
    } catch (error) {
      console.warn('Web Vitals measurement not fully supported:', error)
    }
  }

  // Log metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('Web Vitals:', vitals)
      
      // Track to analytics if available
      if (window.analytics) {
        window.analytics.track('web_vitals', vitals)
      }
    }, 3000)
  })

  return vitals
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
