// Analytics utility functions
export const initAnalytics = () => {
  try {
    // Simple analytics implementation
    // Replace with your preferred analytics service (Google Analytics, Plausible, etc.)
    
    // Check if analytics is enabled (respects Do Not Track)
    if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
      return false
    }

    // Initialize analytics
    window.analytics = {
      track: (eventName, properties = {}) => {
        try {
          console.log('Analytics Event:', eventName, properties)
          // Add your analytics tracking code here
          // Example: gtag('event', eventName, properties)
        } catch (error) {
          console.warn('Analytics track error:', error)
        }
      },
      page: (pageName, properties = {}) => {
        try {
          console.log('Analytics Page View:', pageName, properties)
          // Add your page view tracking code here
        } catch (error) {
          console.warn('Analytics page error:', error)
        }
      },
    }

    // Track initial page view
    if (window.analytics && typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        window.analytics.page(window.location.pathname, {
          title: document.title,
          url: window.location.href,
        })
      } catch (error) {
        console.warn('Analytics initial page view error:', error)
      }
    }

    return true
  } catch (error) {
    console.warn('Analytics initialization error:', error)
    return false
  }
}

export const trackEvent = (eventName, properties = {}) => {
  try {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track(eventName, properties)
    }
  } catch (error) {
    console.warn('trackEvent error:', error)
  }
}

export const trackPageView = (pageName, properties = {}) => {
  try {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.page(pageName, properties)
    }
  } catch (error) {
    console.warn('trackPageView error:', error)
  }
}
