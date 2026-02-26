import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackPageView } from '../utils/analytics'
import { useSeo } from '../utils/useSeo'
import './LegalPages.css'

export default function PortfolioPrivacyPolicy() {
  useSeo({
    title: 'Privacy Policy | Nico Chikuji | nico.builds',
    description:
      'Privacy Policy for nico.builds portfolio. How I collect, use, and protect your information when you visit or contact me.',
  })
  useEffect(() => {
    trackPageView('/privacy-policy')
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <header className="legal-page__header">
          <h1>Privacy Policy</h1>
          <p className="legal-page__subtitle">nico.builds — Portfolio & Freelance Services</p>
          <p className="legal-page__last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="legal-page__content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy describes how Nico Chikuji ("I," "me," or "my") collects, uses, and protects information when you visit nico.builds or contact me regarding freelance or collaborative work. I am a freelancer always open to working with the right projects; I value my time and skills and never settle for less. Protecting your privacy is part of that commitment.
            </p>
          </section>

          <section>
            <h2>2. Information I Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <p>
              When you reach out via the contact form, email, Calendly, or other channels, you may provide:
            </p>
            <ul>
              <li>Name and email address</li>
              <li>Message content and project details</li>
              <li>Any other information you choose to share</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>
              When you visit this site, analytics and hosting services may collect:
            </p>
            <ul>
              <li>IP address, browser type, and device information</li>
              <li>Pages visited and time on site</li>
              <li>Referral sources</li>
            </ul>
            <p>
              This helps me understand how the site is used and improve it. I use Vercel Analytics and related tools that process data in line with their privacy policies.
            </p>
          </section>

          <section>
            <h2>3. How I Use Information</h2>
            <p>
              I use your information to:
            </p>
            <ul>
              <li>Respond to inquiries about freelance work or collaboration</li>
              <li>Evaluate project fit and communicate about engagement</li>
              <li>Improve this site and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              I do not sell, rent, or trade your personal information.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>
              This site uses:
            </p>
            <ul>
              <li><strong>Vercel</strong> — Hosting and analytics</li>
              <li><strong>FormSubmit</strong> — Contact form delivery</li>
              <li><strong>Calendly</strong> — Scheduling</li>
            </ul>
            <p>
              Each has its own privacy policy. I encourage you to review them.
            </p>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <p>
              I retain contact and project-related information only as long as needed to fulfill inquiries, manage engagements, or meet legal requirements.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or restrict processing of your data. To exercise these rights, contact me at <a href="mailto:nico.builds@outlook.com">nico.builds@outlook.com</a>.
            </p>
          </section>

          <section>
            <h2>7. Security</h2>
            <p>
              I use reasonable measures to protect your information. No transmission over the internet is fully secure; I cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>8. Changes</h2>
            <p>
              I may update this policy from time to time. The "Last Updated" date reflects the latest version. Continued use of the site or engagement with me after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              Questions about this Privacy Policy? Reach out at <a href="mailto:nico.builds@outlook.com">nico.builds@outlook.com</a>.
            </p>
          </section>
        </div>

        <footer className="legal-page__footer">
          <Link to="/" className="legal-page__back-link">← Back to Portfolio</Link>
        </footer>
      </div>
    </div>
  )
}
