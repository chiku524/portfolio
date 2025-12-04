import { useEffect } from 'react'
import { trackPageView } from '../utils/analytics'
import './LegalPages.css'

export default function PrivacyPolicy() {
  useEffect(() => {
    trackPageView('/privacy-policy')
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <header className="legal-page__header">
          <h1>Privacy Policy</h1>
          <p className="legal-page__subtitle">The Blockchain Circus TikTok Automation</p>
          <p className="legal-page__last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="legal-page__content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy describes how Nico Chikuji ("we," "us," or "our") collects, uses, and protects information in connection with The Blockchain Circus TikTok automation service ("Service"). The Service operates the TikTok account "@TheBlockchainCircus" (or "The Blockchain Circus") and uses automated workflows to generate and publish educational content about blockchain technology.
            </p>
            <p>
              We are committed to protecting your privacy and being transparent about our data practices. This policy explains what information we collect, how we use it, and your rights regarding that information.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <p>
              We may collect information that you voluntarily provide when:
            </p>
            <ul>
              <li>Interacting with The Blockchain Circus content on TikTok</li>
              <li>Contacting us through email or social media</li>
              <li>Subscribing to or following The Blockchain Circus account</li>
            </ul>
            <p>
              This may include your TikTok username, comments, messages, and any other information you choose to share.
            </p>

            <h3>2.2 Automatically Collected Information</h3>
            <p>
              When you interact with The Blockchain Circus content on TikTok, we may automatically collect certain information through TikTok's platform, including:
            </p>
            <ul>
              <li>View counts and engagement metrics</li>
              <li>Public comments and interactions</li>
              <li>Demographic information provided by TikTok (if available through their API)</li>
              <li>Device information and IP addresses (collected by TikTok, not directly by us)</li>
            </ul>

            <h3>2.3 Content Generation Data</h3>
            <p>
              Our automation system (n8n workflows) may process:
            </p>
            <ul>
              <li>Public blockchain data and on-chain information</li>
              <li>Publicly available news and information about blockchain technology</li>
              <li>Analytics data from TikTok's API (subject to TikTok's terms and privacy policies)</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li><strong>Content Generation:</strong> Create educational and entertaining content about blockchain technology</li>
              <li><strong>Service Improvement:</strong> Analyze engagement metrics to improve content quality and relevance</li>
              <li><strong>Automation:</strong> Operate the automated publishing system that manages The Blockchain Circus account</li>
              <li><strong>Communication:</strong> Respond to inquiries, comments, and messages from users</li>
              <li><strong>Compliance:</strong> Ensure compliance with TikTok's Terms of Service and applicable laws</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2>4. TikTok Platform Integration</h2>
            <p>
              The Blockchain Circus operates through TikTok's platform and API. When you interact with our content on TikTok, your information is also subject to TikTok's Privacy Policy and Terms of Service. We encourage you to review TikTok's privacy practices at <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noreferrer">https://www.tiktok.com/legal/privacy-policy</a>.
            </p>
            <p>
              Information we access through TikTok's API is limited to what TikTok makes available to developers and is subject to TikTok's API Terms of Service and privacy policies.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Services</h2>
            <p>
              Our Service uses the following third-party services:
            </p>
            <ul>
              <li><strong>n8n:</strong> Automation workflow platform used to generate and publish content</li>
              <li><strong>TikTok API:</strong> For publishing content and accessing analytics</li>
              <li><strong>AI Services:</strong> For content generation (subject to the privacy policies of the AI service providers we use)</li>
            </ul>
            <p>
              These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of these third-party services.
            </p>
          </section>

          <section>
            <h2>6. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p>
              Security measures include:
            </p>
            <ul>
              <li>Secure API connections and authentication</li>
              <li>Encrypted data transmission</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Regular security reviews and updates</li>
            </ul>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>
              We retain information for as long as necessary to:
            </p>
            <ul>
              <li>Provide and improve the Service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p>
              Public engagement data (likes, comments, views) is retained in accordance with TikTok's data retention policies. We may retain aggregated, anonymized data indefinitely for analytics purposes.
            </p>
          </section>

          <section>
            <h2>8. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul>
              <li><strong>Access:</strong> Request access to personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, please contact us at <a href="mailto:nico.chikuji@gmail.com">nico.chikuji@gmail.com</a>.
            </p>
            <p>
              <strong>Note:</strong> Since our Service operates primarily through TikTok, you may also need to exercise your privacy rights directly through TikTok's platform settings and privacy controls.
            </p>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              The Blockchain Circus content is intended for general audiences. TikTok's platform requires users to be at least 13 years old (or the minimum age in their jurisdiction). We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2>10. International Data Transfers</h2>
            <p>
              The Service may process and store information in countries other than your country of residence. By using the Service, you consent to the transfer of your information to countries that may have different data protection laws than your country.
            </p>
            <p>
              We take steps to ensure that your information receives adequate protection in accordance with this Privacy Policy, regardless of where it is processed.
            </p>
          </section>

          <section>
            <h2>11. Cookies and Tracking Technologies</h2>
            <p>
              Our Service may use cookies and similar tracking technologies when you visit our website or interact with our content. These technologies help us:
            </p>
            <ul>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve user experience</li>
              <li>Provide personalized content</li>
            </ul>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our Service.
            </p>
            <p>
              TikTok also uses cookies and tracking technologies on their platform. Please refer to TikTok's Privacy Policy for information about their use of cookies.
            </p>
          </section>

          <section>
            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by:
            </p>
            <ul>
              <li>Updating the "Last Updated" date at the top of this page</li>
              <li>Posting a notice on The Blockchain Circus TikTok account (if significant changes occur)</li>
            </ul>
            <p>
              Your continued use of the Service after such changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2>13. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul>
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information held by businesses</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p>
              To exercise your California privacy rights, please contact us at <a href="mailto:nico.chikuji@gmail.com">nico.chikuji@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2>14. European Privacy Rights (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul>
              <li>Right of access to your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p>
              To exercise your GDPR rights, please contact us at <a href="mailto:nico.chikuji@gmail.com">nico.chikuji@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2>15. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:nico.chikuji@gmail.com">nico.chikuji@gmail.com</a>
            </p>
            <p>
              <strong>TikTok Account:</strong> <a href="https://www.tiktok.com/@TheBlockchainCircus" target="_blank" rel="noreferrer">@TheBlockchainCircus</a>
            </p>
            <p>
              We will respond to your inquiry within a reasonable timeframe.
            </p>
          </section>
        </div>

        <footer className="legal-page__footer">
          <a href="/" className="legal-page__back-link">← Back to Portfolio</a>
        </footer>
      </div>
    </div>
  )
}

