import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackPageView } from '../utils/analytics'
import { useSeo } from '../utils/useSeo'
import './LegalPages.css'

const CALENDLY = 'https://calendly.com/nico-chikuji/30min'

export default function ExecutiveSummary() {
  useSeo({
    title: 'Executive Summary | Nico Chikuji',
    description:
      'One-page overview: full-stack delivery across web3 and AI, signature products, operating principles, and how to connect.',
  })

  useEffect(() => {
    trackPageView('/executive-summary')
    // Portfolio leaves wheel/scroll-related body state; clear so this route scrolls normally
    document.body.classList.remove('past-hero', 'is-scrolling')
    document.body.style.overflow = ''
    delete document.body.dataset.depth
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-page__container">
        <header className="legal-page__header">
          <h1>Executive Summary</h1>
          <p className="legal-page__subtitle">Nico Chikuji · Full-Stack Developer · nico.builds</p>
          <p className="legal-page__last-updated">
            Personal reference · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </header>

        <div className="legal-page__content">
          <section>
            <h2>At a glance</h2>
            <p>
              I build and ship <strong>end-to-end products</strong> at the intersection of{' '}
              <strong>web3</strong>, <strong>media</strong>, and <strong>AI-assisted engineering</strong>. My
              default mode is founder-aligned: clear scope, fast feedback loops, design systems that feel
              premium without sacrificing velocity, and infrastructure that can survive real traffic and real
              users.
            </p>
            <p>
              I collaborate best with teams that value <strong>transparent roadmaps</strong>, async-friendly
              rituals, and honest trade-offs. I use AI copilots (Cursor-first) as force multipliers for
              ideation, implementation, QA, and documentation—not as a substitute for judgment, security, or
              product taste.
            </p>
          </section>

          <section>
            <h2>Core capabilities</h2>
            <ul>
              <li>
                <strong>Product engineering:</strong> React, Next.js, Supabase, Node; crisp UX flows; KPI-aware
                delivery; reliable release cadence.
              </li>
              <li>
                <strong>Web3 &amp; on-chain UX:</strong> Composable dApps, wallet experiences that feel familiar,
                dashboards and automation for analytics and reporting.
              </li>
              <li>
                <strong>AI amplification:</strong> Cursor-first workflow; structured prompting for briefs,
                narrative, growth experiments; tooling around smart contracts and creator pipelines.
              </li>
              <li>
                <strong>Platform &amp; integration:</strong> Vite, Cloudflare Workers, Workers AI, Notion API,
                GitHub API; SEO and PWA-minded shipping where it matters.
              </li>
              <li>
                <strong>Culture &amp; go-to-market:</strong> Community playbooks—lore, launch comms, retention
                loops—that keep serious craft from feeling corporate or sterile.
              </li>
            </ul>
          </section>

          <section>
            <h2>Signature work</h2>
            <p>
              Representative products and ecosystems I have brought (or helped bring) to market—each tuned for a
              different wedge of the same thesis: <strong>useful on-chain and AI-native experiences people
              actually return to</strong>.
            </p>
            <ul>
              <li>
                <strong>Blockchain Vibe</strong> — Media and data blend: automation, editorial pipelines, and
                on-chain analytics for the web3 conversation.{' '}
                <a href="https://blockchainvibe.news/" target="_blank" rel="noreferrer">
                  blockchainvibe.news
                </a>
              </li>
              <li>
                <strong>Micro Paywall</strong> — Blockchain-native monetization: multi-chain payments,
                low-friction widgets, operator dashboard.{' '}
                <a href="https://micropaywall.app/" target="_blank" rel="noreferrer">
                  micropaywall.app
                </a>
              </li>
              <li>
                <strong>Motion</strong> — Script-to-video with a procedural, self-contained engine—built for
                repeatability rather than one-off novelty.{' '}
                <a href="https://motion.productions/" target="_blank" rel="noreferrer">
                  motion.productions
                </a>
              </li>
              <li>
                <strong>Dice Express</strong> — Prediction markets connecting forecasters to real-world outcomes.{' '}
                <a href="https://dice.express/" target="_blank" rel="noreferrer">
                  dice.express
                </a>
              </li>
              <li>
                <strong>The Studio Circus</strong> — AI-forward educational series across tech, sports, global
                events, and blockchain storytelling.{' '}
                <a href="https://thestudiocircus.io/" target="_blank" rel="noreferrer">
                  thestudiocircus.io
                </a>
              </li>
              <li>
                <strong>BountyHub</strong> — Web3 growth and contributor flows: bounties, cred, and dashboards at
                startup pace.{' '}
                <a href="https://bountyhub.tech/" target="_blank" rel="noreferrer">
                  bountyhub.tech
                </a>
              </li>
              <li>
                <strong>VibeMiner</strong> — Accessible mining: minimal setup across multiple chains and
                environments.{' '}
                <a href="https://vibeminer.tech/" target="_blank" rel="noreferrer">
                  vibeminer.tech
                </a>
              </li>
              <li>
                <strong>Boing Network</strong> — L1 ecosystem vision: account abstraction, adaptive gas, and a
                cross-chain DeFi hub—network, wallet, explorer, and DeFi surfaces.{' '}
                <a href="https://boing.network/" target="_blank" rel="noreferrer">
                  boing.network
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2>Direction &amp; aspirations</h2>
            <p>
              <strong>Innovation × precision:</strong> I want every release to feel &quot;tide tested&quot;—fast
              to prototype, disciplined to validate, relentless on polish.
            </p>
            <p>
              <strong>Community-first collaboration:</strong> I seek partnerships with founders, DAOs, and
              creators where communication is open, expectations are explicit, and the roadmap is shared—not
              hoarded.
            </p>
            <p>
              <strong>Playful seriousness:</strong> Humor and lore are levers for trust and retention; they sit
              alongside sharp execution, not instead of it.
            </p>
            <p>
              Near term, I am most energized by teams building <strong>usable crypto interfaces</strong>,{' '}
              <strong>AI-native workflows that compound</strong>, and <strong>media or education products</strong>{' '}
              that make complex ideas legible without dumbing them down.
            </p>
          </section>

          <section>
            <h2>Connect</h2>
            <p>
              <a href="mailto:nico.builds@outlook.com">nico.builds@outlook.com</a>
              {' · '}
              <a href="https://www.linkedin.com/in/nico-chikuji/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              {' · '}
              <a href="https://github.com/chiku524" target="_blank" rel="noreferrer">
                GitHub
              </a>
              {' · '}
              <a href={CALENDLY} target="_blank" rel="noreferrer">
                Calendly (30 min)
              </a>
            </p>
          </section>
        </div>

        <footer className="legal-page__footer">
          <Link to="/" className="legal-page__back-link">
            ← Back to Portfolio
          </Link>
        </footer>
      </div>
    </div>
  )
}
