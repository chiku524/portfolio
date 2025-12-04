import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackPageView, trackEvent } from '../utils/analytics'
import profilePicture from '../assets/blockchain-circus/profile-1024x1024.png'
import './TheBlockchainCircus.css'

export default function TheBlockchainCircus() {
  useEffect(() => {
    document.title = 'The Blockchain Circus (TBC) | TikTok AI Automation | nico.builds'
    trackPageView('/the-blockchain-circus')
  }, [])

  const handleTikTokClick = () => {
    trackEvent('blockchain_circus_tiktok_click')
  }

  const handleTermsClick = () => {
    trackEvent('blockchain_circus_terms_click')
  }

  const handlePrivacyClick = () => {
    trackEvent('blockchain_circus_privacy_click')
  }

  return (
    <div className="blockchain-circus-page">
      <div className="blockchain-circus-page__container">
        <header className="blockchain-circus-page__header">
          <Link to="/" className="blockchain-circus-page__back-link">
            ← Back to Portfolio
          </Link>
          <div className="blockchain-circus-page__hero">
            <div className="blockchain-circus-page__profile-image">
              <img 
                src={profilePicture} 
                alt="The Blockchain Circus profile picture - cute pug mascot" 
                className="profile-picture"
              />
            </div>
            <h1>The Blockchain Circus</h1>
            <p className="blockchain-circus-page__tagline">
              Automated AI video generation & publishing for educational blockchain content
            </p>
            <div className="blockchain-circus-page__badges">
              <span className="badge badge--automation">n8n Automation</span>
              <span className="badge badge--ai">RunwayML Video Generation</span>
              <span className="badge badge--tiktok">TikTok Integration</span>
            </div>
          </div>
        </header>

        <main className="blockchain-circus-page__content">
          <section className="blockchain-circus-section">
            <h2>About The Blockchain Circus</h2>
            <p>
              The Blockchain Circus is an automated content creation and publishing system that generates educational 
              and entertaining videos about blockchain technology. Using AI-powered workflows and n8n automation, 
              the system creates, processes, and publishes content directly to the TikTok account 
              <a 
                href="https://www.tiktok.com/@TheBlockchainCircus" 
                target="_blank" 
                rel="noreferrer"
                onClick={handleTikTokClick}
                className="tiktok-link"
              >
                @TheBlockchainCircus
              </a>.
            </p>
            <p>
              This project demonstrates the intersection of AI automation, content creation, and blockchain education, 
              delivering consistent, high-quality content that makes complex blockchain concepts accessible and engaging.
            </p>
          </section>

          <section className="blockchain-circus-section">
            <h2>How It Works</h2>
            <div className="workflow-steps">
              <div className="workflow-step">
                <div className="workflow-step__number">01</div>
                <div className="workflow-step__content">
                  <h3>Content Generation</h3>
                  <p>
                    AI-powered systems analyze blockchain trends, news, and educational topics to generate 
                    video scripts and content concepts. The system pulls from various data sources to ensure 
                    content is current and relevant.
                  </p>
                </div>
              </div>
              <div className="workflow-step">
                <div className="workflow-step__number">02</div>
                <div className="workflow-step__content">
                  <h3>Video Production with RunwayML</h3>
                  <p>
                    RunwayML's AI video generation creates engaging visual content from the generated scripts. 
                    The system handles video creation, asset selection, and formatting optimized for TikTok's 
                    platform requirements, producing high-quality educational content automatically.
                  </p>
                </div>
              </div>
              <div className="workflow-step">
                <div className="workflow-step__number">03</div>
                <div className="workflow-step__content">
                  <h3>n8n Automation</h3>
                  <p>
                    n8n workflows orchestrate the entire process—from content ideation to final publishing. 
                    The automation handles scheduling, quality checks, and seamless integration with TikTok's API 
                    for automated posting.
                  </p>
                </div>
              </div>
              <div className="workflow-step">
                <div className="workflow-step__number">04</div>
                <div className="workflow-step__content">
                  <h3>TikTok Publishing</h3>
                  <p>
                    Content is automatically published to the TikTok account through the TikTok Developer API. 
                    The system ensures compliance with TikTok's community guidelines and terms of service while 
                    maintaining a consistent posting schedule.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="blockchain-circus-section">
            <h2>Technology Stack</h2>
            <div className="tech-grid">
              <div className="tech-card">
                <h3>n8n</h3>
                <p>Workflow automation platform that orchestrates the entire content pipeline</p>
              </div>
              <div className="tech-card">
                <h3>RunwayML</h3>
                <p>AI-powered video generation platform for creating engaging visual content from scripts and concepts</p>
              </div>
              <div className="tech-card">
                <h3>TikTok Developer API</h3>
                <p>Official TikTok API integration for automated content publishing and analytics</p>
              </div>
              <div className="tech-card">
                <h3>Content Management</h3>
                <p>Automated systems for content scheduling, quality assurance, and performance tracking</p>
              </div>
            </div>
          </section>

          <section className="blockchain-circus-section">
            <h2>Content Focus</h2>
            <p>
              The Blockchain Circus focuses on creating educational and entertaining content about:
            </p>
            <ul className="content-list">
              <li>Blockchain fundamentals and concepts</li>
              <li>Cryptocurrency trends and analysis</li>
              <li>Web3 ecosystem developments</li>
              <li>DeFi (Decentralized Finance) education</li>
              <li>NFT culture and technology</li>
              <li>On-chain analytics and insights</li>
              <li>Blockchain industry news and updates</li>
            </ul>
            <p className="disclaimer">
              <strong>Important:</strong> All content is for educational and entertainment purposes only. 
              The information provided does not constitute financial, investment, legal, or tax advice.
            </p>
          </section>

          <section className="blockchain-circus-section">
            <h2>Follow The Blockchain Circus</h2>
            <p>
              Experience automated blockchain education in action. Follow the TikTok account to see the 
              latest AI-generated content about blockchain technology.
            </p>
            <div className="cta-buttons">
              <a
                href="https://www.tiktok.com/@TheBlockchainCircus"
                target="_blank"
                rel="noreferrer"
                className="button button--primary"
                onClick={handleTikTokClick}
              >
                Visit TikTok Profile ↗
              </a>
            </div>
          </section>

          <section className="blockchain-circus-section blockchain-circus-section--legal">
            <h2>Legal & Privacy</h2>
            <p>
              The Blockchain Circus operates in compliance with TikTok's Terms of Service and Community Guidelines. 
              For detailed information about how the service operates and handles data, please review our legal documents.
            </p>
            <div className="legal-links">
              <Link 
                to="/the-blockchain-circus/terms-of-service" 
                className="legal-link"
                onClick={handleTermsClick}
              >
                Terms of Service
              </Link>
              <Link 
                to="/the-blockchain-circus/privacy-policy" 
                className="legal-link"
                onClick={handlePrivacyClick}
              >
                Privacy Policy
              </Link>
            </div>
          </section>

          <section className="blockchain-circus-section blockchain-circus-section--contact">
            <h2>Contact & Support</h2>
            <p>
              For questions, feedback, or inquiries about The Blockchain Circus automation system, please contact:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:nico.chikuji@gmail.com">nico.chikuji@gmail.com</a>
            </p>
            <p>
              <strong>Portfolio:</strong> <Link to="/">nico.builds</Link>
            </p>
          </section>
        </main>

        <footer className="blockchain-circus-page__footer">
          <p>
            The Blockchain Circus is an automated content generation system created by{' '}
            <Link to="/">Nico Chikuji</Link>.
          </p>
          <p className="footer-note">
            This project demonstrates the potential of AI automation in content creation and blockchain education.
          </p>
        </footer>
      </div>
    </div>
  )
}

