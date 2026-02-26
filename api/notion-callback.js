// Vercel Serverless Function for Notion OAuth callback
// Exchanges authorization code for access token and redirects to result page

const REDIRECT_URI = 'https://nicochikuji-portfolio.vercel.app/api/notion-callback'
const TOKEN_URL = 'https://api.notion.com/v1/oauth/token'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, error: notionError, error_description } = req.query

  if (notionError) {
    const msg = encodeURIComponent(error_description || notionError)
    return res.redirect(`/auth/notion/error?message=${msg}`)
  }

  if (!code) {
    return res.redirect('/auth/notion/error?message=missing_code')
  }

  const clientId = process.env.NOTION_CLIENT_ID
  const clientSecret = process.env.NOTION_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return res.redirect('/auth/notion/error?message=config_missing')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const msg = encodeURIComponent(data.error_description || data.error || 'Token exchange failed')
      return res.redirect(`/auth/notion/error?message=${msg}`)
    }

    // Store or forward tokens as needed for your workflow.
    // For now, redirect to success. Extend this handler to persist
    // data.access_token, data.bot_id, data.workspace_id, etc.
    return res.redirect('/auth/notion/success')
  } catch (err) {
    const msg = encodeURIComponent(err.message || 'Exchange failed')
    return res.redirect(`/auth/notion/error?message=${msg}`)
  }
}
