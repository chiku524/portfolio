// Analytics utility functions
export const initAnalytics = () => {
  // Simple analytics implementation
  // Replace with your preferred analytics service (Google Analytics, Plausible, etc.)
  
  // Check if analytics is enabled (respects Do Not Track)
  if (navigator.doNotTrack === '1') {
    return false
  }

  // Initialize analytics
  window.analytics = {
    track: (eventName, properties = {}) => {
      console.log('Analytics Event:', eventName, properties)
      // Add your analytics tracking code here
      // Example: gtag('event', eventName, properties)
    },
    page: (pageName, properties = {}) => {
      console.log('Analytics Page View:', pageName, properties)
      // Add your page view tracking code here
    },
  }

  // Track initial page view
  if (window.analytics) {
    window.analytics.page(window.location.pathname, {
      title: document.title,
      url: window.location.href,
    })
  }

  return true
}

export const trackEvent = (eventName, properties = {}) => {
  if (window.analytics) {
    window.analytics.track(eventName, properties)
  }
}

export const trackPageView = (pageName, properties = {}) => {
  if (window.analytics) {
    window.analytics.page(pageName, properties)
  }
}
