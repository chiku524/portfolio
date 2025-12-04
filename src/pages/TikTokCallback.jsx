import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function TikTokCallback() {
  const [searchParams] = useSearchParams()
  
  useEffect(() => {
    // Extract code and state from URL query parameters
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    if (code && state) {
      // Forward to n8n OAuth callback
      const n8nCallbackUrl = `https://oauth.n8n.cloud/oauth2/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
      
      // Immediately redirect to n8n
      window.location.href = n8nCallbackUrl
    } else {
      // If code or state is missing, redirect to TBC page with error
      console.error('TikTok OAuth callback missing code or state parameter')
      window.location.href = '/the-blockchain-circus?oauth_error=missing_params'
    }
  }, [searchParams])

  // Show loading state while redirecting
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(18, 246, 255, 0.3)',
          borderTopColor: '#12f6ff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p>Processing TikTok OAuth callback...</p>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Redirecting to n8n...
        </p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

