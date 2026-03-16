import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function Root() {
  const [loadInsights, setLoadInsights] = useState(false)
  useEffect(() => {
    const id = requestIdleCallback(() => setLoadInsights(true), { timeout: 3500 })
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
