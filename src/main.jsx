import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
      <SpeedInsights />
      <Analytics />
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

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
