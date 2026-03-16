import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Only load Vercel insights when storage is available (avoids Datadog "No storage available" when blocked)
function isStorageAvailable() {
  try {
    const key = '__storage_test__'
    window.localStorage.setItem(key, key)
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

function Root() {
  const [loadInsights, setLoadInsights] = useState(false)
  useEffect(() => {
    const id = requestIdleCallback(() => {
      if (isStorageAvailable()) setLoadInsights(true)
    }, { timeout: 3500 })
    return () => cancelIdleCallback(id)
  }, [])
  return (
    <>
      <App />
      {loadInsights && (
        <>
          <SpeedInsights />
          <Analytics />
        </>
      )}
    </>
  )
}

// Suppress third-party script load errors (e.g. blocked fbevents.js) so they don't bubble to React
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.target?.tagName === 'SCRIPT' && event.target?.src) {
      try {
        const url = new URL(event.target.src)
        const thirdParty = ['connect.facebook.net', 'facebook.com', 'doubleclick.net', 'googleadservices.com']
        if (thirdParty.some((host) => url.hostname.includes(host))) {
          event.stopImmediatePropagation()
          event.preventDefault()
          return true
        }
      } catch (_) { /* ignore */ }
    }
  }, true)
}

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <Root />
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  // Show a fallback message if rendering fails
  if (document.body) {
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; text-align: center;">
        <h1>Unable to load the application</h1>
        <p>Please refresh the page or try again later.</p>
        <p style="color: #666; font-size: 14px;">Error: ${error.message}</p>
      </div>
    `
  }
}

// Register service worker with update handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (typeof import.meta !== 'undefined' && !import.meta.env?.PROD) {
          console.log('SW registered: ', registration)
        }
        
        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, reload to activate
                window.location.reload()
              }
            })
          }
        })
      })
      .catch((registrationError) => {
        if (typeof import.meta !== 'undefined' && !import.meta.env?.PROD) {
          console.log('SW registration failed: ', registrationError)
        }
      })
    
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        if (registration.scope.includes(self.location.origin) && typeof import.meta !== 'undefined' && !import.meta.env?.PROD) {
          console.log('Service worker registered:', registration.scope)
        }
      })
    })
  })
}
