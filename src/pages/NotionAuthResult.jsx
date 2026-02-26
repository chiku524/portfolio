import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { trackPageView } from '../utils/analytics'
import { useSeo } from '../utils/useSeo'
import './LegalPages.css'

export default function NotionAuthResult() {
  const { status } = useParams()
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message')

  useSeo({
    title: status === 'success' ? 'Notion Connected | nico.builds' : 'Notion Auth | nico.builds',
    description: status === 'success' ? 'Notion integration connected successfully.' : 'Notion authorization result.',
  })

  useEffect(() => {
    trackPageView(`/auth/notion/${status || 'unknown'}`)
  }, [status])

  const isSuccess = status === 'success'

  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <header className="legal-page__header">
          <h1>{isSuccess ? 'Notion Connected' : 'Authorization Issue'}</h1>
          <p className="legal-page__subtitle">nico.builds — Notion Integration</p>
        </header>

        <div className="legal-page__content">
          {isSuccess ? (
            <section>
              <p>Your Notion workspace has been successfully connected.</p>
              <p>You can close this tab or return to the portfolio.</p>
            </section>
          ) : (
            <section>
              <p>Something went wrong during the Notion authorization flow.</p>
              {message && (
                <p style={{ color: 'var(--accent-soft)', fontSize: '0.9rem', marginTop: '1rem' }}>
                  {decodeURIComponent(message)}
                </p>
              )}
            </section>
          )}

          <p>
            <Link to="/">← Back to Portfolio</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
