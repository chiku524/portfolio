import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useStandalonePage } from '../utils/useStandalonePage'

export default function TikTokCallback() {
  const [searchParams] = useSearchParams()
  useStandalonePage()

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
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a0b0e 0%, #141518 100%)',
        color: '#e8e4d4',
        fontFamily: 'system-ui, sans-serif',
        padding:
          'env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(232, 228, 212, 0.3)',
            borderTopColor: '#e8e4d4',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p>Processing TikTok OAuth callback...</p>
        <p style={{ fontSize: '0.9rem', color: '#8a8578', marginTop: '0.5rem' }}>
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
