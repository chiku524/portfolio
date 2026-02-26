import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackPageView } from '../utils/analytics'
import { useSeo } from '../utils/useSeo'
import './LegalPages.css'

export default function PortfolioTermsOfService() {
  useSeo({
    title: 'Terms of Service | Nico Chikuji | nico.builds',
    description:
      'Terms of Service for nico.builds portfolio. Freelance developer open to collaboration—I value my time and skills, and never settle for less.',
  })
  useEffect(() => {
    trackPageView('/terms-of-service')
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <header className="legal-page__header">
          <h1>Terms of Service</h1>
          <p className="legal-page__subtitle">nico.builds — Portfolio & Freelance Services</p>
          <p className="legal-page__last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="legal-page__content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to nico.builds. These Terms of Service ("Terms") govern your use of this portfolio website and any freelance, consulting, or collaborative services ("Services") provided by Nico Chikuji ("I," "me," or "my").
            </p>
            <p>
              I am a freelance full-stack developer always open to working and collaborating with the right projects. I value my time and skillsets and will never settle for less within the workspace. By engaging with this site or my services, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2>2. Use of This Website</h2>
            <p>
              This website serves as a portfolio showcasing my work, skills, and availability for freelance and collaborative projects. You may browse the site for informational purposes. You agree not to:
            </p>
            <ul>
              <li>Use the site for any unlawful purpose</li>
              <li>Attempt to interfere with, disrupt, or compromise the site or its infrastructure</li>
              <li>Copy, scrape, or repurpose content without permission</li>
              <li>Impersonate me or misrepresent your affiliation</li>
            </ul>
          </section>

          <section>
            <h2>3. Freelance & Collaborative Work</h2>
            <p>
              I am available for freelance engagements, consulting, and collaborations. Engagement terms—including scope, deliverables, compensation, timelines, and ownership—are agreed upon separately for each project. I reserve the right to:
            </p>
            <ul>
              <li>Decline projects that do not align with my values, expertise, or availability</li>
              <li>Set rates and terms that reflect the value of my time and skills</li>
              <li>Terminate or pause work if terms are breached or conditions change</li>
              <li>Choose the projects and clients I work with</li>
            </ul>
            <p>
              I do not settle for less within the workspace. Mutual respect, clear communication, and fair compensation are non‑negotiable for any collaboration.
            </p>
          </section>

          <section>
            <h2>4. Contact & Inquiries</h2>
            <p>
              Contact through this site (e.g., via the contact form or email) does not create a binding agreement. A formal engagement is established only when both parties agree in writing to a specific scope and terms.
            </p>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              All content on this site—including text, design, code, and project showcases—is owned by Nico Chikuji or respective rights holders. You may not reproduce or use this content for commercial purposes without permission. For commissioned work, intellectual property terms are defined in the project agreement.
            </p>
          </section>

          <section>
            <h2>6. Disclaimers</h2>
            <p>
              This site and any information provided are offered "as is." I do not warrant uninterrupted availability or error-free operation. Project outcomes depend on collaboration; I do not guarantee specific business results.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, I shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this site or any communication regarding potential work.
            </p>
          </section>

          <section>
            <h2>8. Changes</h2>
            <p>
              I may update these Terms from time to time. The "Last Updated" date above reflects the latest revision. Continued use of the site after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              Questions about these Terms? Reach out at <a href="mailto:nico.builds@outlook.com">nico.builds@outlook.com</a>.
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
