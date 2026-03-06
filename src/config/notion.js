// Notion OAuth - client_id is public (used in auth URL)
// NOTION_CLIENT_SECRET must only be set in Vercel env vars (api/notion-callback.js)

const NOTION_CLIENT_ID = '313d872b-594c-8187-99c0-0037cb87c26a'
const REDIRECT_URI = encodeURIComponent('https://nicochikuji-portfolio.vercel.app/api/notion-callback')

export const NOTION_AUTH_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${REDIRECT_URI}`
