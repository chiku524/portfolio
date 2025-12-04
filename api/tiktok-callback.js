// Vercel Serverless Function for TikTok OAuth Callback
// This provides a server-side handler as a backup to the client-side component

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Extract code and state from query parameters
  const { code, state } = req.query

  if (!code || !state) {
    // Redirect to TBC page with error if parameters are missing
    return res.redirect('/the-blockchain-circus?oauth_error=missing_params')
  }

  // Forward to n8n OAuth callback
  const n8nCallbackUrl = `https://oauth.n8n.cloud/oauth2/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
  
  // Immediately redirect to n8n
  return res.redirect(n8nCallbackUrl)
}

