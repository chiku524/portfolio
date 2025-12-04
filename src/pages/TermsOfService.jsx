import { useEffect } from 'react'
import { trackPageView } from '../utils/analytics'
import './LegalPages.css'

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service | The Blockchain Circus (TBC) | nico.builds'
    trackPageView('/terms-of-service')
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <header className="legal-page__header">
          <h1>Terms of Service</h1>
          <p className="legal-page__subtitle">The Blockchain Circus (TBC) - TikTok Automation</p>
          <p className="legal-page__last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="legal-page__content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using The Blockchain Circus TikTok automation service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
            </p>
            <p>
              The Service is operated by Nico Chikuji ("we," "us," or "our") and is designed to automate the creation and publishing of educational and entertaining content related to blockchain technology on the TikTok account "@TheBlockchainCircus" (or "The Blockchain Circus").
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              The Blockchain Circus is an automated content generation and publishing system that:
            </p>
            <ul>
              <li>Generates educational and entertaining video content related to blockchain technology</li>
              <li>Automates the publishing process to TikTok</li>
              <li>Uses AI-powered workflows (n8n) to create and manage content</li>
            </ul>
            <p>
              The Service is intended for informational and educational purposes only. All content is generated and published automatically through our automation system.
            </p>
          </section>

          <section>
            <h2>3. User Responsibilities</h2>
            <p>
              As a user or viewer of The Blockchain Circus content:
            </p>
            <ul>
              <li>You acknowledge that all content is generated automatically and may contain errors or inaccuracies</li>
              <li>You understand that blockchain and cryptocurrency information is for educational purposes only and does not constitute financial advice</li>
              <li>You agree not to rely solely on the information provided for making financial or investment decisions</li>
              <li>You will not attempt to interfere with, disrupt, or harm the Service or its operations</li>
            </ul>
          </section>

          <section>
            <h2>4. Content and Intellectual Property</h2>
            <p>
              All content generated and published through The Blockchain Circus TikTok account, including but not limited to videos, text, graphics, and other materials, is the property of Nico Chikuji or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may view and share content from The Blockchain Circus for personal, non-commercial purposes, provided that you:
            </p>
            <ul>
              <li>Do not modify the content</li>
              <li>Provide proper attribution to The Blockchain Circus</li>
              <li>Do not use the content for commercial purposes without explicit written permission</li>
            </ul>
          </section>

          <section>
            <h2>5. Disclaimers</h2>
            <h3>5.1 Educational Content Disclaimer</h3>
            <p>
              The content provided by The Blockchain Circus is for educational and entertainment purposes only. It does not constitute:
            </p>
            <ul>
              <li>Financial, investment, legal, or tax advice</li>
              <li>Recommendations to buy, sell, or hold any cryptocurrency or blockchain asset</li>
              <li>Endorsements of any specific projects, platforms, or services</li>
            </ul>

            <h3>5.2 No Warranty</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3>5.3 Accuracy Disclaimer</h3>
            <p>
              While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or timeliness of any content generated through the Service. Blockchain technology and the cryptocurrency space evolve rapidly, and information may become outdated quickly.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NICO CHIKUJI AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul>
              <li>Your use or inability to use the Service</li>
              <li>Any content generated or published through the Service</li>
              <li>Any errors or omissions in the content</li>
              <li>Any unauthorized access to or use of our systems</li>
            </ul>
          </section>

          <section>
            <h2>7. TikTok Platform Compliance</h2>
            <p>
              The Blockchain Circus operates in compliance with TikTok's Terms of Service and Community Guidelines. We are committed to:
            </p>
            <ul>
              <li>Creating original, educational content</li>
              <li>Respecting intellectual property rights</li>
              <li>Maintaining community standards</li>
              <li>Following TikTok's automation and API usage policies</li>
            </ul>
            <p>
              If TikTok determines that any content violates their policies, we reserve the right to remove such content and take appropriate action.
            </p>
          </section>

          <section>
            <h2>8. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service, or any part thereof, at any time with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the "Last Updated" date at the top of this page. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Nico Chikuji operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:nico.chikuji@gmail.com">nico.chikuji@gmail.com</a>
            </p>
            <p>
              <strong>TikTok Account:</strong> <a href="https://www.tiktok.com/@TheBlockchainCircus" target="_blank" rel="noreferrer">@TheBlockchainCircus</a>
            </p>
          </section>

          <section>
            <h2>13. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2>14. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and Nico Chikuji regarding the use of The Blockchain Circus Service and supersede all prior agreements and understandings.
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

