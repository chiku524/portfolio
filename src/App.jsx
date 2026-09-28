import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Routes, Route, Link } from 'react-router-dom'
import {
  Code2,
  Anchor,
  Wrench,
  Compass,
  Mail,
  Share2,
  MessageSquare,
  Calendar,
  Github,
  Linkedin,
  Youtube,
  MessageCircle,
  ExternalLink,
  LayoutDashboard,
  Bot,
  Globe,
  Target,
  Users,
  Smile,
  Sparkles,
  Zap,
  Layers,
  ArrowUp,
} from 'lucide-react'
import './App.css'
import logoMark from './assets/generated-image.png'
import { NOTION_AUTH_URL } from './config/notion'
import { initAnalytics, trackEvent, trackPageView } from './utils/analytics'
import { useSeo } from './utils/useSeo'
import { measureWebVitals } from './utils/webVitals'
import { scheduleWhenIdle } from './utils/scheduleIdle'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import PortfolioTermsOfService from './pages/PortfolioTermsOfService'
import PortfolioPrivacyPolicy from './pages/PortfolioPrivacyPolicy'
import NotionAuthResult from './pages/NotionAuthResult'
import TheBlockchainCircus from './pages/TheBlockchainCircus'
import TikTokCallback from './pages/TikTokCallback'
import ExecutiveSummary from './pages/ExecutiveSummary'
import GitHubActivityChart from './components/GitHubActivityChart'
import OceanBackground from './components/OceanBackground'
import HeroAtmosphere from './components/HeroAtmosphere'
import PointerAtmosphere from './components/PointerAtmosphere'
import { prefersFinePointer, prefersReducedMotion } from './utils/motion'

function Portfolio() {
  useSeo({
    title: 'Nico Chikuji | Full-Stack Developer | Flow Beyond Limits',
    description:
      'Full-stack developer building web3, AI, and product systems that perform and scale. Flow beyond limits. Stay Playful, Ship Serious.',
  })
  const backgroundCanvasRef = useRef(null)
  const videoRefs = useRef({})
  const audioRef = useRef(null)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const scrollProgressRef = useRef(null)
  const scrollProgressBarRef = useRef(null)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [deferHeavyDecorations, setDeferHeavyDecorations] = useState(true)

  useEffect(() => {
    const cancel = scheduleWhenIdle(() => setDeferHeavyDecorations(false), { timeout: 1800 })
    return cancel
  }, [])

  // Lazy-load Calendly script only when contact section is in view to reduce initial load and main-thread work
  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return
    if (document.querySelector('script[data-calendly]')) return

    let observer = null
    const loadCalendly = () => {
      const existing = document.querySelector('script[data-calendly]')
      if (existing) return
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.dataset.calendly = 'true'
      script.onerror = () => console.warn('Failed to load Calendly script')
      document.body.appendChild(script)
    }

    const contactEl = document.getElementById('contact')
    if (!contactEl) {
      loadCalendly()
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadCalendly()
          observer?.disconnect()
        }
      },
      { rootMargin: '120px 0px', threshold: 0 },
    )
    observer.observe(contactEl)
    return () => observer?.disconnect()
  }, [])

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal')
    if (!revealEls.length) return

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: show all elements immediately on mobile browsers without IntersectionObserver
      revealEls.forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    try {
      let revealRaf = null
      const pendingReveal = new Set()
      const flushReveal = () => {
        revealRaf = null
        pendingReveal.forEach((el) => {
          el.classList.add('is-visible')
          observer.unobserve(el)
        })
        pendingReveal.clear()
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) pendingReveal.add(entry.target)
          })
          if (pendingReveal.size && !revealRaf) revealRaf = requestAnimationFrame(flushReveal)
        },
        { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
      )

      const maxStep = 5
      revealEls.forEach((el, index) => {
        const customDelay = el.dataset.revealDelay
        if (customDelay) {
          el.style.setProperty('--reveal-delay', customDelay)
        } else {
          const parsedStep = Number(el.dataset.revealStep)
          const hasCustomStep = !Number.isNaN(parsedStep)
          const step = hasCustomStep ? parsedStep : Math.min(index, maxStep)
          const clampedStep = Math.max(0, Math.min(step, maxStep))
          el.style.setProperty('--reveal-delay', `${clampedStep * 40}ms`)
        }
        observer.observe(el)
      })

      return () => {
        if (revealRaf) cancelAnimationFrame(revealRaf)
        observer.disconnect()
      }
    } catch (error) {
      console.error('IntersectionObserver error:', error)
      // Fallback: show all elements immediately
      revealEls.forEach((el) => {
        el.classList.add('is-visible')
      })
    }
  }, [])

  useEffect(() => {
    const canvas = backgroundCanvasRef.current
    if (!canvas) return

    let isTouchDevice = false
    try {
      if (window.matchMedia) {
        isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      }
    } catch {
      isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }

    if (isTouchDevice) {
      canvas.style.display = 'none'
      return
    }

    let ctx
    try {
      ctx = canvas.getContext('2d', { alpha: true })
      if (!ctx) return
    } catch {
      canvas.style.display = 'none'
      return
    }

    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      drawStatic()
    }

    const drawStatic = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      if (typeof ctx.resetTransform === 'function') {
        ctx.resetTransform()
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }
      ctx.scale(dpr, dpr)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.55
      const r = Math.max(width, height) * 0.85
      const cx = width * 0.3
      const cy = height * 0.35
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      g1.addColorStop(0, 'rgba(56, 189, 248, 0.22)')
      g1.addColorStop(0.4, 'rgba(34, 211, 238, 0.1)')
      g1.addColorStop(0.7, 'rgba(34, 211, 238, 0.04)')
      g1.addColorStop(1, 'rgba(15, 23, 42, 0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, width, height)
      const cx2 = width * 0.75
      const cy2 = height * 0.2
      const r2 = Math.max(width, height) * 0.8
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2)
      g2.addColorStop(0, 'rgba(59, 130, 246, 0.16)')
      g2.addColorStop(0.5, 'rgba(34, 211, 238, 0.05)')
      g2.addColorStop(1, 'rgba(15, 23, 42, 0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, width, height)
      const cx3 = width * 0.5
      const cy3 = height * 0.7
      const r3 = Math.max(width, height) * 0.65
      const g3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, r3)
      g3.addColorStop(0, 'rgba(34, 211, 238, 0.1)')
      g3.addColorStop(0.6, 'rgba(34, 211, 238, 0.03)')
      g3.addColorStop(1, 'rgba(15, 23, 42, 0)')
      ctx.fillStyle = g3
      ctx.fillRect(0, 0, width, height)
    }

    drawStatic()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (ctx) {
        try {
          ctx.clearRect(0, 0, width, height)
        } catch { /* ignore */ }
      }
    }
  }, [])

  useEffect(() => {
    const container = scrollProgressRef.current
    const bar = scrollProgressBarRef.current
    if (!container || !bar) return

    let ticking = false
    let lastPastHero = false
    let cachedMaxScroll = 0
    let lastScrollHeight = 0

    const updateScrollProgress = () => {
      const vh = window.innerHeight
      const scrollY = window.scrollY
      const needRefresh = lastScrollHeight === 0 || scrollY > cachedMaxScroll * 0.95
      if (needRefresh) {
        const sh = document.body.scrollHeight
        if (sh !== lastScrollHeight) {
          lastScrollHeight = sh
          cachedMaxScroll = Math.max(0, sh - vh)
        }
      }
      const progress = cachedMaxScroll > 0 ? Math.min(scrollY / cachedMaxScroll, 1) : 0
      const pastHero = scrollY > 0.8 * vh
      if (pastHero !== lastPastHero) {
        lastPastHero = pastHero
        if (pastHero) document.body.classList.add('past-hero')
        else document.body.classList.remove('past-hero')
      }
      document.documentElement.style.setProperty('--scroll-progress', String(progress))
      const roundedPercent = Math.round(progress * 100)
      if (roundedPercent !== Number(container.getAttribute('aria-valuenow'))) {
        container.setAttribute('aria-valuenow', roundedPercent)
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateScrollProgress)
      }
    }

    const onResize = () => {
      lastScrollHeight = 0
      updateScrollProgress()
    }

    updateScrollProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Section-based wheel scroll (desktop / fine pointer only — avoids fighting native touch scroll)
  useEffect(() => {
    let isCoarseTouch = false
    try {
      isCoarseTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    } catch {
      isCoarseTouch = 'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0
    }
    if (isCoarseTouch) return

    const getStops = () => {
      const sections = document.querySelectorAll('[data-snappable="true"]')
      if (!sections.length) return []
      const vh = window.innerHeight
      const navEl = document.querySelector('.nav-wrapper')
      const navHeight = navEl ? navEl.offsetHeight : 72
      const offset = navHeight
      const stops = []

      const collectRowTops = (section, selector) => {
        const tops = []
        section.querySelectorAll(selector).forEach((item) => {
          const y = item.getBoundingClientRect().top + window.scrollY
          if (!tops.some((existing) => Math.abs(existing - y) < 40)) {
            tops.push(y)
          }
        })
        return tops.sort((a, b) => a - b)
      }

      sections.forEach((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY
        const height = el.offsetHeight
        const rowSelector = el.getAttribute('data-snap-rows')
        if (rowSelector) {
          stops.push(Math.max(0, Math.round(top - offset)))
          collectRowTops(el, rowSelector).forEach((y, index) => {
            if (index === 0) return
            stops.push(Math.max(0, Math.round(y - offset)))
          })
          return
        }
        if (height <= vh * 1.2) {
          stops.push(Math.max(0, Math.round(top - offset)))
        } else {
          let y = top
          const step = Math.max(vh * 0.85, 1)
          while (y < top + height - vh * 0.3) {
            stops.push(Math.max(0, Math.round(y - offset)))
            y += step
          }
          stops.push(Math.max(0, Math.round(top + height - vh - offset)))
        }
      })
      const maxScroll = document.documentElement.scrollHeight - vh
      stops.push(maxScroll)
      return [...new Set(stops)].map((s) => Math.max(0, Math.min(s, maxScroll))).sort((a, b) => a - b)
    }

    let stops = getStops()
    let scrollAccum = 0
    const TICK_THRESHOLD = 120

    const handleWheel = (e) => {
      try {
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return
      } catch { /* ignore */ }

      const target = e.target
      if (target.closest('textarea, [contenteditable="true"], input, select, iframe')) return

      stops = getStops()
      // No section snap targets (e.g. alternate routes): never hijack wheel — native scroll must work
      if (!stops.length) return

      e.preventDefault()
      scrollAccum += e.deltaY

      const scrollY = window.scrollY

      if (scrollAccum >= TICK_THRESHOLD) {
        const nextIdx = stops.findIndex((s) => s > scrollY + 15)
        const fromIdx = nextIdx >= 0 ? nextIdx : stops.length - 1
        const maxSteps = stops.length - fromIdx
        const steps = Math.min(Math.floor(scrollAccum / TICK_THRESHOLD), maxSteps)
        scrollAccum -= steps * TICK_THRESHOLD
        if (steps > 0) {
          const nextStop = stops[Math.min(fromIdx + steps - 1, stops.length - 1)]
          window.scrollTo({ top: nextStop, behavior: 'smooth' })
        }
      } else if (scrollAccum <= -TICK_THRESHOLD) {
        const prevStopVal = [...stops].reverse().find((s) => s < scrollY - 15)
        const prevIdx = prevStopVal != null ? stops.indexOf(prevStopVal) : 0
        const maxSteps = prevIdx + 1
        const steps = Math.min(Math.floor(-scrollAccum / TICK_THRESHOLD), maxSteps)
        scrollAccum += steps * TICK_THRESHOLD
        if (steps > 0) {
          const prevStop = stops[Math.max(prevIdx - steps + 1, 0)]
          window.scrollTo({ top: prevStop, behavior: 'smooth' })
        }
      }
    }

    const onResize = () => { stops = getStops() }
    window.addEventListener('resize', onResize)
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [])

  // Pause full-experience animations while user is scrolling to prevent lag
  useEffect(() => {
    let scrollEndTimer = null
    const SCROLL_END_MS = 140

    const markScrolling = () => {
      document.body.classList.add('is-scrolling')
      if (scrollEndTimer) clearTimeout(scrollEndTimer)
      scrollEndTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling')
        scrollEndTimer = null
      }, SCROLL_END_MS)
    }

    const handleScrollKey = (e) => {
      if (['Space', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.code)) markScrolling()
    }
    window.addEventListener('scroll', markScrolling, { passive: true })
    window.addEventListener('wheel', markScrolling, { passive: true })
    window.addEventListener('touchmove', markScrolling, { passive: true })
    window.addEventListener('keydown', handleScrollKey)

    return () => {
      if (scrollEndTimer) clearTimeout(scrollEndTimer)
      document.body.classList.remove('is-scrolling')
      window.removeEventListener('scroll', markScrolling)
      window.removeEventListener('wheel', markScrolling)
      window.removeEventListener('touchmove', markScrolling)
      window.removeEventListener('keydown', handleScrollKey)
    }
  }, [])

  // Close mobile menu on Escape key and prevent body scroll when open (iOS-safe lock)
  useEffect(() => {
    const handleEscape = (event) => {
      if (isMobileMenuOpen && event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      const scrollY = window.scrollY
      const originalStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
      }

      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'

      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = originalStyle.overflow
        document.body.style.position = originalStyle.position
        document.body.style.top = originalStyle.top
        document.body.style.width = originalStyle.width
        window.scrollTo(0, scrollY)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isMobileMenuOpen])

  // Clear scroll-lock / animation state when leaving the portfolio route
  useEffect(() => {
    return () => {
      document.body.classList.remove('past-hero', 'is-scrolling')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      delete document.body.dataset.depth
    }
  }, [])

  const handleMenuToggle = (event) => {
    event.stopPropagation()
    // Allow default button behavior and just toggle state
    setIsMobileMenuOpen((prev) => !prev)
  }

  // Initialize analytics and web vitals
  useEffect(() => {
    try {
      initAnalytics()
      const cleanupWebVitals = measureWebVitals()

      // Track page view on mount
      if (typeof window !== 'undefined') {
        trackPageView(window.location.pathname)
      }
      
      return () => {
        try {
          if (cleanupWebVitals) cleanupWebVitals()
        } catch (error) {
          console.warn('Web vitals cleanup error:', error)
        }
      }
    } catch (error) {
      console.error('Analytics/Web Vitals initialization error:', error)
      return () => {}
    }
  }, [])

  // Track route changes for analytics
  useEffect(() => {
    const handleRouteChange = () => {
      trackPageView(window.location.pathname)
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  // Form validation
  const validateForm = (formData) => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.get('name') || formData.get('name').trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!formData.get('email') || !emailRegex.test(formData.get('email'))) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.get('message') || formData.get('message').trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }

    return errors
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setFormErrors({})
    setSubmitStatus(null)
    setIsSubmitting(true)

    const formData = new FormData(event.target)
    const errors = validateForm(formData)

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      trackEvent('form_validation_error', { errors: Object.keys(errors) })
      return
    }

    try {
      // Track form submission
      trackEvent('form_submit', {
        topic: formData.get('topic'),
        hasMessage: !!formData.get('message'),
      })

      // Let the form submit normally
      // In production, you might want to handle this with fetch/axios
      event.target.submit()
      
      setSubmitStatus('success')
      trackEvent('form_submit_success')
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      trackEvent('form_submit_error', { error: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const buildMediaPaths = (base) => {
    const safe = encodeURIComponent(base)
    return {
      base,
      thumbnail: `/media/thumbnails/${safe}.jpg`,
      mp4: `/media/mp4/${safe}-1080p.mp4`,
      webm: `/media/webm/${safe}-1080p.webm`,
      gif: `/media/gifs/${safe}-preview.gif`,
    }
  }

  const proofOfWork = useMemo(
    () => [
      {
        name: 'Blockchain Vibe',
        url: 'https://blockchainvibe.news/',
        badge: 'Media lab',
        description:
          'Content engine that blends data, culture, and alpha leaks. Automation, editorial pipelines, and on-chain analytics for the web3 zeitgeist.',
        highlight: 'Automation pipelines, AI content flows, analytics stack.',
        media: buildMediaPaths('BlockchainVibe News'),
      },
      {
        name: 'Micro Paywall',
        url: 'https://micropaywall.app/',
        badge: 'Blockchain payments',
        description:
          'Monetize content with instant blockchain payments. Multi-chain support, sub-second confirmations, near-zero fees, and seamless integration.',
        highlight: 'Solana, Ethereum, Polygon. Drop-in widgets, full dashboard.',
        media: null,
      },
      {
        name: 'Motion',
        url: 'https://motion.productions/',
        badge: 'Video generation',
        description:
          'Turn your script into video. One prompt, one video. Procedural engine—no external models. From prompt to production.',
        highlight: 'Procedural engine, self-built algorithms, learning system.',
        media: null,
      },
      {
        name: 'Dice Express',
        url: 'https://dice.express/',
        badge: 'Prediction markets',
        description:
          'Trade on real-world outcomes. Prediction markets that connect forecasters with meaningful events and opportunities.',
        highlight: 'Real-world outcomes, forecasting, decentralized trading.',
        media: null,
      },
      {
        name: 'TxLINE Predict',
        url: 'https://txline-predict.vercel.app/',
        badge: 'Verifiable markets',
        description:
          'World Cup prediction markets on Solana with live TxLINE match data, USDC escrow pools, and Merkle-proof settlement.',
        highlight: 'Anchor escrow, SSE live feed, trustless claim payouts.',
        media: null,
      },
      {
        name: 'The Studio Circus',
        url: 'https://thestudiocircus.io/',
        badge: 'AI education',
        description:
          'AI-powered educational video series that entertain, educate, and inspire. Exploring industries through creative storytelling.',
        highlight: 'AI Tech Circus, Sports, Global Events, Blockchain series.',
        media: null,
      },
      {
        name: 'Immersive Labs',
        url: 'https://immersivelabs.space/',
        badge: 'Game generation studio',
        description:
          'Text-to-Unity asset pipeline and studio UI—spec generation, ComfyUI textures, pack export, and a marketing site for the Video Game Generation Studio.',
        highlight: 'Vite studio UI, Python worker, Unity importer.',
        media: null,
      },
      {
        name: 'SnappyPie',
        url: 'https://snappypie.app/',
        badge: 'AI micro-tutor',
        description:
          'Snap a photo, get a structured visual lesson. Expo mobile + web with vision explanations, animated lessons, and a local knowledge timeline.',
        highlight: 'Camera input, OpenAI vision, animated lesson renderer.',
        media: null,
      },
      {
        name: 'BountyHub',
        url: 'https://bountyhub.tech/',
        badge: 'Decentralized bounties',
        description:
          'Web3 growth hub dispensing bounties, cred, and inside jokes. Product narrative and features shipping at startup pace.',
        highlight: 'Growth funnels, bounty flow, contributor dashboards.',
        media: buildMediaPaths('Bountyhub'),
      },
      {
        name: 'NFT Gallery',
        url: 'https://nft-gallery.vercel.app/',
        badge: 'NFT collections',
        description:
          'A house of on-chain collections—each drop with its own studio, traits, and launch path. Loopkins, Afterimages, and Inklings on OpenSea.',
        highlight: 'Layered APNG PFPs, 1:1 loops, ERC-721 on Robinhood Chain and Ink.',
        media: null,
      },
      {
        name: 'VibeMiner',
        url: 'https://vibeminer.tech/',
        badge: 'One-click mining',
        description:
          'Mine without the grind. No terminal, no config. Choose a blockchain, click start, and contribute hashrate—on desktop or web.',
        highlight: 'Boing testnet, Monero, Kaspa, Ergo. Web & desktop.',
        media: null,
      },
      {
        name: 'Albion Silver Helper',
        url: 'https://albion-silver-helper.vercel.app/',
        badge: 'Game economy tools',
        description:
          'Client-side Albion Online profit helper for market flips, refining, crafting, farms, and optional local price capture—no game automation.',
        highlight: 'Spread scanner, refining calc, capture library.',
        media: null,
      },
      {
        name: 'GW2 TP Profit',
        url: 'https://gw2-tp-profit.vercel.app/',
        badge: 'Trading tools',
        description:
          'Guild Wars 2 trading post helper with flip scanning, fee-aware profit math, open orders, delivery box, and crafting trees via the official API.',
        highlight: 'Live commerce data, P&L history, local API key.',
        media: null,
      },
      {
        name: 'Fab Products',
        url: 'https://github.com/chiku524/fab-products',
        badge: 'Unreal Engine plugins',
        description:
          'Epic Fab marketplace suite—Harbor Suite, Level Selection Sets, World Builder tools, Workflow Toolkit, and Immersive Labs UE bundles.',
        highlight: 'Editor plugins, starter kits, Fab packaging.',
        media: null,
      },
      {
        name: 'Schmiedeler & Associates',
        url: 'https://schmiedeler.com/',
        badge: 'Client website',
        description:
          'Institutional site for Schmiedeler & Associates Inc.—services, product lines, manufacturers, and contact flows on Cloudflare Pages.',
        highlight: 'Static site, contact API, admin portal.',
        media: null,
      },
      {
        name: 'The Blockchain Circus',
        url: '/the-blockchain-circus',
        badge: 'TikTok automation',
        description:
          'n8n + RunwayML pipeline that generates and publishes educational blockchain shorts to TikTok on a steady cadence.',
        highlight: 'AI video gen, TikTok API, automated publishing.',
        media: null,
      },
      {
        type: 'ecosystem',
        name: 'Boing Network',
        url: 'https://boing.network/',
        badge: 'L1 blockchain ecosystem',
        description:
          'Authentic. Decentralized. Optimal. Quality-assured. Native account abstraction, adaptive gas, cross-chain DeFi hub—built from first principles.',
        highlight: 'Network · Wallet · Explorer · DeFi',
        media: null,
        ecosystem: [
          { name: 'Boing Network', url: 'https://boing.network/', label: 'Network' },
          { name: 'Boing Express', url: 'https://boing.express/', label: 'Wallet' },
          { name: 'Boing Observer', url: 'https://boing.observer/', label: 'Explorer' },
          { name: 'Boing Finance', url: 'https://boing.finance/', label: 'DeFi' },
        ],
      },
    ],
    [],
  )

  const aiToolkit = ['Cursor', 'Copilot', 'Pisces', 'CapCut', 'Canva', 'ChatGPT', 'OpenAI API']
  const calendlyLink = 'https://calendly.com/nico-chikuji/30min'

  const socialLinks = [
    {
      label: 'X (Twitter)',
      handle: '@NChikuji',
      url: 'https://x.com/NChikuji',
      tone: 'Product updates, shipping notes, and current work.',
    },
    {
      label: 'LinkedIn',
      handle: 'nicholas-chikuji',
      url: 'https://www.linkedin.com/in/nico-chikuji/',
      tone: 'Background, collaboration, and professional inquiries.',
    },
    {
      label: 'GitHub',
      handle: 'chiku524',
      url: 'https://github.com/chiku524',
      tone: 'Source, experiments, and ongoing development.',
    },
    {
      label: 'Reddit',
      handle: 'u/nicopico524',
      url: 'https://www.reddit.com/user/nicopico524/',
      tone: 'Community discussion and technical threads.',
    },
    {
      label: 'YouTube',
      handle: '@nicochikuji',
      url: 'https://www.youtube.com/@nicochikuji',
      tone: 'Walkthroughs and behind-the-scenes build videos.',
    },
    {
      label: 'Discord',
      handle: 'nkc6469',
      url: 'https://discord.com/users/nkc6469',
      tone: 'Direct messages for demos, questions, or collaboration.',
      isUserHandle: true,
    },
  ]

  const ensureVideoLoaded = useCallback((name) => {
    const video = videoRefs.current[name]
    if (video && !video.dataset.loaded) {
      const sources = Array.from(video.querySelectorAll('source[data-src]'))
      sources.forEach((source) => {
        const dataSrc = source.getAttribute('data-src')
        if (dataSrc) {
          source.setAttribute('src', dataSrc)
        }
      })
      video.dataset.loaded = 'true'
      video.load()
    }
  }, [])

  const handlePreviewEnter = (name) => {
    ensureVideoLoaded(name)
    const video = videoRefs.current[name]
    if (video) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* autoplay prevented */
        })
      }
    }
  }

  const handlePreviewLeave = (name) => {
    const video = videoRefs.current[name]
    if (video) {
      video.pause()
    }
  }

  useEffect(() => {
    const cards = document.querySelectorAll('[data-project-name]')
    if (!cards.length) return

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: load all videos immediately
      cards.forEach((card) => {
        const name = card.getAttribute('data-project-name')
        if (name) {
          ensureVideoLoaded(name)
        }
      })
      return
    }

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const name = entry.target.getAttribute('data-project-name')
              if (name) {
                ensureVideoLoaded(name)
              }
            }
          })
        },
        { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
      )

      cards.forEach((card) => observer.observe(card))

      return () => observer.disconnect()
    } catch (error) {
      console.error('Video IntersectionObserver error:', error)
      // Fallback: load all videos immediately
      cards.forEach((card) => {
        const name = card.getAttribute('data-project-name')
        if (name) {
          ensureVideoLoaded(name)
        }
      })
    }
  }, [ensureVideoLoaded, proofOfWork])

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-depth]'))
    if (!nodes.length) {
      document.body.dataset.depth = 'surface'
      return () => { delete document.body.dataset.depth }
    }

    const setDepth = () => {
      const vh = window.innerHeight
      let best = 'surface'
      let bestVisible = 0
      nodes.forEach((el) => {
        const r = el.getBoundingClientRect()
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0)
        if (visible > bestVisible) {
          bestVisible = visible
          best = el.dataset.depth || 'surface'
        }
      })
      if (document.body.dataset.depth !== best) {
        document.body.dataset.depth = best
      }
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setDepth()
        ticking = false
      })
    }

    document.body.dataset.depth = 'surface'
    setDepth()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      delete document.body.dataset.depth
    }
  }, [])

  useEffect(() => {
    if (!prefersFinePointer() || prefersReducedMotion()) return
    const hero = document.querySelector('.hero')
    if (!hero) return

    let rafId = null
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const tick = () => {
      currentX += (targetX - currentX) * 0.07
      currentY += (targetY - currentY) * 0.07
      hero.style.setProperty('--px', currentX.toFixed(3))
      hero.style.setProperty('--py', currentY.toFixed(3))
      if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    const onMove = (event) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      targetX = (event.clientX / w - 0.5) * 2
      targetY = (event.clientY / h - 0.5) * 2
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
      hero.style.removeProperty('--px')
      hero.style.removeProperty('--py')
    }
  }, [])

  useEffect(() => {
    if (!prefersFinePointer() || prefersReducedMotion()) return
    const grid = document.querySelector('.project-grid')
    if (!grid) return

    let lastCard = null
    const reset = (card) => {
      card.style.setProperty('--tilt-x', '0deg')
      card.style.setProperty('--tilt-y', '0deg')
      card.style.setProperty('--glare-x', '50%')
      card.style.setProperty('--glare-y', '50%')
    }

    const onMove = (event) => {
      const card = event.target.closest('.project-card')
      if (lastCard && lastCard !== card) reset(lastCard)
      lastCard = card
      if (!card || !grid.contains(card)) return
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1)
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1)
      card.style.setProperty('--tilt-x', `${((0.5 - y) * 6).toFixed(2)}deg`)
      card.style.setProperty('--tilt-y', `${((x - 0.5) * 8).toFixed(2)}deg`)
      card.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`)
      card.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`)
    }

    const onLeave = () => {
      if (lastCard) reset(lastCard)
      lastCard = null
    }

    grid.addEventListener('pointermove', onMove, { passive: true })
    grid.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      grid.removeEventListener('pointermove', onMove)
      grid.removeEventListener('pointerleave', onLeave)
    }
  }, [proofOfWork])

  useEffect(() => {
    const snappables = Array.from(document.querySelectorAll('[data-snappable="true"]'))
      .filter((el) => !el.classList.contains('section--contact'))
    if (!snappables.length) return

    const getCurrentIndex = () => {
      const vh = window.innerHeight
      let bestIdx = 0
      let bestArea = 0
      snappables.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const top = Math.max(0, r.top)
        const bottom = Math.min(vh, r.bottom)
        const area = Math.max(0, bottom - top) * Math.min(r.width, window.innerWidth)
        if (area > bestArea) {
          bestArea = area
          bestIdx = i
        }
      })
      return bestIdx
    }

    const handleKeydown = (e) => {
      const forward = ['ArrowDown', 'PageDown', 'Space']
      const backward = ['ArrowUp', 'PageUp']
      if (!forward.includes(e.code) && !backward.includes(e.code)) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      e.preventDefault()
      const idx = getCurrentIndex()
      const delta = e.code === 'Space' && e.shiftKey ? -1 : forward.includes(e.code) ? 1 : -1
      const next = Math.max(0, Math.min(idx + delta, snappables.length - 1))
      if (next !== idx) snappables[next].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.addEventListener('keydown', handleKeydown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl) return
    audioEl.volume = 0.2
    setIsAudioOn(!audioEl.paused)
    const handlePlay = () => setIsAudioOn(true)
    const handlePause = () => setIsAudioOn(false)
    audioEl.addEventListener('play', handlePlay)
    audioEl.addEventListener('pause', handlePause)
    return () => {
      audioEl.removeEventListener('play', handlePlay)
      audioEl.removeEventListener('pause', handlePause)
    }
  }, [])

  const handleToggleAudio = useCallback(() => {
    const audioEl = audioRef.current
    if (!audioEl) return
    if (audioEl.paused) {
      audioEl.currentTime = 0
      audioEl.play().catch(() => {
        setIsAudioOn(false)
      })
    } else {
      audioEl.pause()
      audioEl.currentTime = 0
    }
  }, [])

  // Safety check - ensure we're in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return <div>Loading...</div>
  }

  const oceanLayers = (
    <div className="ocean-layers-wrapper" aria-hidden="true">
      <div className="ocean-orbs" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <OceanBackground />
      <div className="depth-overlay" aria-hidden="true" />
    </div>
  )

  try {
    return (
      <div className="app">
        {/* Ocean layers portaled to body so they use viewport as containing block (avoids auto x auto when parent has transform) */}
        {typeof document !== 'undefined' && document.body && createPortal(oceanLayers, document.body)}
        {!deferHeavyDecorations && (
          <>
            <canvas ref={backgroundCanvasRef} className="background-canvas" aria-hidden="true" />
          </>
        )}
        <div className="app__content">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Scroll Progress Indicator - updated via ref to avoid re-renders during scroll */}
        <div ref={scrollProgressRef} className="scroll-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Page scroll progress">
          <div ref={scrollProgressBarRef} className="scroll-progress__bar" />
        </div>
        <header className="nav-wrapper">
          <nav className="nav page-shell">
            <a className="nav__brand" href="#top" aria-label="Nico Chikuji portfolio homepage">
              <img className="nav__logo" src={logoMark} alt="nico.builds logo" loading="eager" fetchPriority="high" />
              <span className="nav__brand-text">
                <span className="nav__brand-title">nico.builds</span>
                <span className="nav__brand-tagline">Flow Beyond Limits</span>
              </span>
            </a>
            <button
              type="button"
              className="nav__menu-toggle"
              onClick={handleMenuToggle}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              aria-controls="nav-menu"
            >
              <span className="nav__menu-icon">
                <span className={`nav__menu-line nav__menu-line--1 ${isMobileMenuOpen ? 'nav__menu-line--open' : ''}`} />
                <span className={`nav__menu-line nav__menu-line--2 ${isMobileMenuOpen ? 'nav__menu-line--open' : ''}`} />
                <span className={`nav__menu-line nav__menu-line--3 ${isMobileMenuOpen ? 'nav__menu-line--open' : ''}`} />
              </span>
            </button>
            <div 
              className={`nav__links ${isMobileMenuOpen ? 'nav__links--open' : ''}`} 
              id="nav-menu"
              aria-hidden={!isMobileMenuOpen}
            >
              <a 
                href="#proof" 
                aria-label="View selected work" 
                onClick={() => {
                  trackEvent('nav_click', { link: 'proof' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Anchor className="nav__link-icon" size={14} aria-hidden />
                Work
              </a>
              <a 
                href="#skills" 
                aria-label="View skills" 
                onClick={() => {
                  trackEvent('nav_click', { link: 'skills' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Wrench className="nav__link-icon" size={14} aria-hidden />
                Skills
              </a>
              <a 
                href="#aspirations" 
                aria-label="View approach" 
                onClick={() => {
                  trackEvent('nav_click', { link: 'aspirations' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Compass className="nav__link-icon" size={14} aria-hidden />
                Approach
              </a>
              <a 
                href="#contact" 
                aria-label="View contact information" 
                onClick={() => {
                  trackEvent('nav_click', { link: 'contact' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Mail className="nav__link-icon" size={14} aria-hidden />
                Contact
              </a>
              <a
                className="nav__cta nav__cta--menu"
                href={calendlyLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Book a call on Calendly"
                onClick={() => {
                  trackEvent('nav_click', { link: 'book_sprint_menu' })
                  setIsMobileMenuOpen(false)
                }}
              >
                Book a call
              </a>
            </div>
            <div className="nav__actions">
              <a className="nav__cta nav__cta--header" href={calendlyLink} target="_blank" rel="noreferrer" aria-label="Book a call on Calendly">
                Book a call
              </a>
              <button
                type="button"
                className="nav__audio"
                onClick={handleToggleAudio}
                aria-pressed={isAudioOn}
                aria-label={isAudioOn ? 'Turn ambient ocean audio off' : 'Turn ambient ocean audio on'}
              >
                {isAudioOn ? '🔊' : '🔈'}
              </button>
            </div>
          </nav>
        </header>

        <header className="hero" id="top" data-snappable="true" data-depth="surface">
          <HeroAtmosphere />
          <div className="hero__inner page-shell">
            <div className="hero__content">
              <div className="hero__eyebrow hero-enter" style={{ '--enter-delay': '40ms' }}>
                <Code2 className="hero__eyebrow-icon" size={16} aria-hidden />
                <span className="dot dot--cyan" />
                full-stack developer
              </div>
              <h1 className="hero-enter" style={{ '--enter-delay': '120ms' }}>
                Building digital products <span>that perform with precision.</span>
              </h1>
              <p className="hero__mantra hero-enter" style={{ '--enter-delay': '220ms' }}>
                Flow beyond limits. Stay Playful, Ship Serious.
              </p>
              <p className="hero__tagline hero-enter" style={{ '--enter-delay': '300ms' }}>
                I work across web3, AI, and the modern web—shipping products that are reliable, considered,
                and built for the people who use them.
              </p>
              <div className="hero__actions hero-enter" style={{ '--enter-delay': '400ms' }}>
                <a className="button button--primary" href="#proof">
                  View selected work
                  <ExternalLink className="button__icon-svg" size={16} aria-hidden />
                </a>
                <a className="button button--ghost" href={calendlyLink} target="_blank" rel="noreferrer">
                  Book a call
                  <Calendar className="button__icon-svg" size={16} aria-hidden />
                </a>
              </div>
              <div className="hero__meta hero-enter" style={{ '--enter-delay': '500ms' }}>
                <span>
                  Currently collaborating with founders, operators, and AI-assisted teams on new product work.
                </span>
              </div>
              <div className="hero__values hero-enter" style={{ '--enter-delay': '580ms' }}>
                <span className="value-chip"><Zap className="value-chip__icon" size={14} aria-hidden /> Innovation × Precision</span>
                <span className="value-chip"><Users className="value-chip__icon" size={14} aria-hidden /> Community-First Collaboration</span>
                <span className="value-chip"><Smile className="value-chip__icon" size={14} aria-hidden /> Playful Seriousness</span>
                <span className="value-chip"><Layers className="value-chip__icon" size={14} aria-hidden /> Adaptive Ecosystem Design</span>
              </div>
            </div>
          </div>
          <div className="hero__divider" aria-hidden="true">
            <span className="hero__wave hero__wave--left" />
            <span className="hero__wave hero__wave--right" />
          </div>
        </header>

        <main id="main-content">
          <section className="section section--proof page-shell" id="proof" data-snappable="true" data-depth="reef" data-snap-rows=".project-card">
            <div className="section__header reveal">
              <h2>
                <Anchor className="section__header-icon" size={28} aria-hidden />
                Selected Work
              </h2>
              <p>Products in production, from web3 and AI to client platforms.</p>
            </div>
            <div className="project-grid">
              {proofOfWork.map((project, index) => {
                const isEcosystem = project.type === 'ecosystem'
                const isInternalLink = !isEcosystem && project.url.startsWith('/')
                const PreviewLink = isInternalLink ? Link : 'a'
                const previewProps = isInternalLink
                  ? { to: project.url }
                  : { href: project.url, target: '_blank', rel: 'noreferrer' }
                const MetaLink = isInternalLink ? Link : 'a'
                const metaProps = isInternalLink
                  ? { to: project.url }
                  : { href: project.url, target: '_blank', rel: 'noreferrer' }

                const hasMedia = !!project.media?.thumbnail
                const showFallback = !hasMedia && !isEcosystem
                const gradientStyle = !hasMedia && !isEcosystem && {
                  background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.92) 0%, rgba(8, 47, 73, 0.88) 40%, rgba(15, 23, 42, 0.9) 70%, rgba(6, 28, 50, 0.9) 100%)',
                  backgroundImage: 'radial-gradient(circle at 25% 35%, rgba(18, 246, 255, 0.18) 0%, transparent 50%), radial-gradient(circle at 75% 65%, rgba(59, 130, 246, 0.12) 0%, transparent 45%)',
                }
                const initial = showFallback ? project.name.charAt(0) : null

                return (
                  <article
                    key={project.name}
                    className={`project-card reveal ${isEcosystem ? 'project-card--ecosystem' : ''}`}
                    data-project-name={project.name}
                    data-reveal-step={index % 6}
                  >
                    <PreviewLink
                      className={`project-card__preview ${showFallback ? 'project-card__preview--fallback' : ''}`}
                      data-initial={initial}
                      {...previewProps}
                      style={
                        project.media?.thumbnail
                          ? { '--project-thumb': `url(${project.media.thumbnail})` }
                          : showFallback
                            ? undefined
                            : gradientStyle || undefined
                      }
                      onMouseEnter={() => !isEcosystem && handlePreviewEnter(project.name)}
                      onMouseLeave={() => !isEcosystem && handlePreviewLeave(project.name)}
                      onFocus={() => !isEcosystem && handlePreviewEnter(project.name)}
                      onBlur={() => !isEcosystem && handlePreviewLeave(project.name)}
                      onTouchStart={() => !isEcosystem && handlePreviewEnter(project.name)}
                      onTouchEnd={() => !isEcosystem && handlePreviewLeave(project.name)}
                      onTouchCancel={() => !isEcosystem && handlePreviewLeave(project.name)}
                    >
                      {!isEcosystem && (project.media?.webm || project.media?.mp4) && (
                        <video
                          ref={(node) => {
                            if (node) {
                              videoRefs.current[project.name] = node
                            }
                          }}
                          className="project-card__video"
                          playsInline
                          muted
                          loop
                          preload="none"
                          poster={project.media.thumbnail}
                        >
                          {project.media.webm && <source data-src={project.media.webm} type="video/webm" />}
                          {project.media.mp4 && <source data-src={project.media.mp4} type="video/mp4" />}
                        </video>
                      )}
                      {isEcosystem && (
                        <div className="project-card__ecosystem-preview" aria-hidden="true">
                          <span className="project-card__ecosystem-icon">⬡</span>
                          <span className="project-card__ecosystem-text">Boing Network</span>
                        </div>
                      )}
                      <div className="project-card__overlay">
                        <span><ExternalLink className="project-card__overlay-icon" size={18} aria-hidden /> {isInternalLink ? 'View project' : 'Visit site'}</span>
                      </div>
                      <div className="project-card__caustic" aria-hidden="true" />
                      <div className="project-card__shimmer" aria-hidden="true" />
                    </PreviewLink>
                    <div className="project-card__body">
                      <span className="card__badge">{project.badge}</span>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      {isEcosystem && project.ecosystem && (
                        <div className="project-card__ecosystem">
                          <span className="project-card__ecosystem-label">Explore ecosystem</span>
                          <div className="project-card__ecosystem-links">
                            {project.ecosystem.map((item) => (
                              <a
                                key={item.url}
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="project-card__ecosystem-link"
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="project-card__meta">
                        <span>{project.highlight}</span>
                        <MetaLink {...metaProps}>
                          {isInternalLink ? 'View project →' : 'Open project ↗'}
                        </MetaLink>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
          <section className="section section--skills page-shell" id="skills" data-snappable="true" data-depth="mid">
            <div className="section__header reveal">
              <h2>
                <Wrench className="section__header-icon" size={28} aria-hidden />
                Capabilities
              </h2>
              <p>The tools and practices I use to ship quickly without sacrificing quality.</p>
            </div>
            <div className="columns columns--stagger">
              <div className="card card--column reveal" data-reveal-step="0">
                <h3><LayoutDashboard className="card__title-icon" size={20} aria-hidden /> Product Engineering</h3>
                <ul>
                  <li>Full-stack delivery with React, Next.js, Supabase, Node, and reliable infrastructure.</li>
                  <li>Design systems that balance polish, clear UX, and measurable outcomes.</li>
                  <li>A steady release cadence—async collaboration, pairing, and transparent roadmaps.</li>
                </ul>
              </div>
              <div className="card card--column reveal" data-reveal-step="1">
                <h3><Bot className="card__title-icon" size={20} aria-hidden /> AI Amplification</h3>
                <ul>
                  <li>Cursor-first workflow for rapid ideation, refactors, automated QA, and docs.</li>
                  <li>Custom prompting for briefs, narrative design, growth experiments, and analytics.</li>
                  <li>Copilots powering smart contracts, operational tooling, and creator pipelines.</li>
                </ul>
              </div>
              <div className="card card--column reveal" data-reveal-step="2">
                <h3><Globe className="card__title-icon" size={20} aria-hidden /> Web3 & Community</h3>
                <ul>
                  <li>Composable dApps with wallet UX that feels familiar, safe, and easy to use.</li>
                  <li>On-chain insights—dashboards, bots, and reporting—supported by AI analysis.</li>
                  <li>Community playbooks covering launches, communication, and retention.</li>
                </ul>
              </div>
            </div>
            <div className="toolkit reveal">
              <h4><Sparkles className="toolkit__title-icon" size={20} aria-hidden /> Creative Toolkit</h4>
              <div className="toolkit__chips">
                {aiToolkit.map((tool) => (
                  <span key={tool} className="chip">
                    {tool}
                  </span>
                ))}
              </div>
              <p className="toolkit__note">
                Cursor is my primary environment. Other tools—Pisces, CapCut, Canva, custom GPTs—come in
                when they improve the outcome.
              </p>
              <GitHubActivityChart username="chiku524" className="reveal" />
            </div>
          </section>
          <section className="section section--currents page-shell" id="aspirations" data-snappable="true" data-depth="deep">
            <div className="section__header reveal">
              <h2>
                <Compass className="section__header-icon" size={28} aria-hidden />
                Approach
              </h2>
              <p>How I like to work, and the teams I do my best work with.</p>
            </div>
            <div className="aspirations">
              <div className="aspirations__card reveal" data-reveal-step="0">
                <Target className="aspirations__card-icon" size={24} aria-hidden />
                <span className="aspirations__label">01</span>
                <h3>Innovation × Precision</h3>
                <p>
                  Strong products need engineering rigor. I prototype quickly, validate with data, and polish
                  until every release is ready for production.
                </p>
              </div>
              <div className="aspirations__card reveal" data-reveal-step="1">
                <Users className="aspirations__card-icon" size={24} aria-hidden />
                <span className="aspirations__label">02</span>
                <h3>Community-First Collaboration</h3>
                <p>
                  I do my best work alongside founders, DAOs, and creators—open communication, async rituals,
                  and transparent roadmaps so everyone stays aligned.
                </p>
              </div>
              <div className="aspirations__card reveal" data-reveal-step="2">
                <Smile className="aspirations__card-icon" size={24} aria-hidden />
                <span className="aspirations__label">03</span>
                <h3>Playful Seriousness</h3>
                <p>
                  Tone can stay light while the craft stays sharp. Humor and trust belong in the process so teams
                  stay energized without losing the standard.
                </p>
              </div>
            </div>
          </section>
          <section className="section section--contact page-shell" id="contact" data-snappable="true" data-depth="trench">
            <div className="section__header reveal" data-reveal-step="0">
              <h2>
                <Mail className="section__header-icon" size={28} aria-hidden />
                Contact
              </h2>
              <p>
                Have a product, engagement, or collaboration in mind? Reach out and we can talk through it.
              </p>
            </div>
            <div className="contact-grid">
              <div className="card card--contact reveal" data-reveal-step="1">
                <span className="card__badge card__badge--signal">Direct line</span>
                <h3><Mail className="card__title-icon" size={20} aria-hidden /> Email</h3>
                <a className="contact-email" href="mailto:nico.builds@outlook.com">
                  nico.builds@outlook.com
                </a>
                <p>Share the brief, the constraint, or the question. I typically reply within a day or two.</p>
              </div>
              <div className="card card--contact reveal" data-reveal-step="2">
                <span className="card__badge card__badge--orbit">Social</span>
                <h3><Share2 className="card__title-icon" size={20} aria-hidden /> Social channels</h3>
                <ul className="contact-socials">
                  {socialLinks.map((link) => {
                  const Icon = link.label === 'GitHub' ? Github : link.label === 'LinkedIn' ? Linkedin : link.label === 'YouTube' ? Youtube : link.label === 'Discord' ? MessageCircle : ExternalLink
                  return (
                    <li key={link.label}>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        <Icon className="contact-social-icon" size={18} aria-hidden />
                        <span className="contact-label">{link.label}</span>
                        {link.isUserHandle ? (
                          <span className="contact-handle">{link.handle}</span>
                        ) : (
                          <span className="contact-handle">@{link.handle.replace(/^@?/, '')}</span>
                        )}
                        <span className="contact-tone">{link.tone}</span>
                      </a>
                    </li>
                  )
                })}
                </ul>
              </div>
              <div className="card card--contact reveal" data-reveal-step="3">
                <span className="card__badge card__badge--signal">Message</span>
                <h3><MessageSquare className="card__title-icon" size={20} aria-hidden /> Send a message</h3>
                <form
                  className="contact-form"
                  action="https://formsubmit.co/nico.builds@outlook.com"
                  method="POST"
                  onSubmit={handleFormSubmit}
                  noValidate
                >
                  <input type="hidden" name="_captcha" value="false" />
                  <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Avery Finley"
                      autoComplete="name"
                      required
                      aria-invalid={formErrors.name ? 'true' : 'false'}
                      aria-describedby={formErrors.name ? 'name-error' : undefined}
                    />
                    {formErrors.name && (
                      <span className="form-error" id="name-error" role="alert">
                        {formErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                      aria-invalid={formErrors.email ? 'true' : 'false'}
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                    />
                    {formErrors.email && (
                      <span className="form-error" id="email-error" role="alert">
                        {formErrors.email}
                      </span>
                    )}
                  </div>
                  <div className="form-field">
                    <label htmlFor="topic">Inquiry type</label>
                    <select id="topic" name="topic" defaultValue="collab" autoComplete="off">
                      <option value="collab">Product or feature work</option>
                      <option value="consult">Consulting / advisory</option>
                      <option value="content">Content and media</option>
                      <option value="speaking">Workshop / speaking</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="How can I help?"
                      rows={4}
                      autoComplete="off"
                      required
                      aria-invalid={formErrors.message ? 'true' : 'false'}
                      aria-describedby={formErrors.message ? 'message-error' : undefined}
                    />
                    {formErrors.message && (
                      <span className="form-error" id="message-error" role="alert">
                        {formErrors.message}
                      </span>
                    )}
                  </div>
                  {submitStatus === 'success' && (
                    <div className="form-success" role="alert">
                      Message sent successfully! I'll get back to you soon.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="form-error" role="alert">
                      Something went wrong. Please try again or email directly.
                    </div>
                  )}
                  <button
                    className="button button--primary form-submit"
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </button>
                  <p className="form-footnote">
                    Powered by FormSubmit for now—happy to sync via Matrix, Warpcast, or Discord if you prefer.{' '}
                    <a href={NOTION_AUTH_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent('notion_connect_click')}>
                      Connect your Notion workspace
                    </a>
                  </p>
                </form>
              </div>
              <div className="card card--contact card--calendly reveal">
                <span className="card__badge card__badge--spark">Book time</span>
                <h3><Calendar className="card__title-icon" size={20} aria-hidden /> Intro call</h3>
                <ul className="contact-next">
                  <li>Align on objectives, milestones, and responsibilities in 30 focused minutes.</li>
                  <li>Share docs, decks, and context so we can move quickly if we work together.</li>
                  <li>Leave with next steps, resource needs, and a clear summary.</li>
                </ul>
                <a className="button button--primary contact-cta" href={calendlyLink} target="_blank" rel="noreferrer">
                  Schedule a call
                </a>
                <div className="calendar-inline">
                  <div
                    className="calendly-inline-widget calendly-inline-widget--embed"
                    data-url={calendlyLink}
                  />
                </div>
                <a className="calendly-direct" href={calendlyLink} target="_blank" rel="noreferrer">
                  Open Calendly in new tab ↗
                </a>
              </div>
            </div>
          </section>
      </main>

        <footer className="footer">
          <div className="footer__inner page-shell reveal" data-reveal-step="0">
            <div className="footer__brand">
              <img className="footer__logo" src={logoMark} alt="nico.builds logo" loading="lazy" />
              <div className="footer__brand-copy">
                <span className="footer__brand-title">Flow Beyond Limits</span>
                <span className="footer__brand-motto">Full-stack developer for considered, high-quality builds.</span>
              </div>
            </div>
            <h2>Let’s build something worth shipping.</h2>
            <p>
              Reach out directly or through any of the projects above. I work with founders, operators,
              and designers who care about quality and follow-through.
            </p>
            <div className="footer__actions">
              <a className="button button--primary" href={calendlyLink} target="_blank" rel="noreferrer">
                <Calendar className="button__icon-svg" size={16} aria-hidden />
                Start a project
              </a>
              <a className="button button--ghost" href="#top">
                <ArrowUp className="button__icon-svg" size={16} aria-hidden />
                Back to top
              </a>
            </div>
            <span className="footer__note">
              © {new Date().getFullYear()} nico.builds — built with care and modern tooling.
              {' '}
              <Link to="/terms-of-service">Terms</Link>
              {' · '}
              <Link to="/privacy-policy">Privacy</Link>
            </span>
          </div>
        </footer>
      </div>
      <audio
        ref={audioRef}
        src="/audio/waves-crashing-on-rock-beach.mp3"
        playsInline
        loop
        preload="auto"
      />
      </div>
    )
  } catch (error) {
    console.error('Portfolio component render error:', error)
    return (
      <div className="app" style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Unable to load the portfolio</h1>
        <p>Please refresh the page or try again later.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>Error: {error.message}</p>
      </div>
    )
  }
}

function App() {
  return (
    <>
      <PointerAtmosphere />
      <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/terms-of-service" element={<PortfolioTermsOfService />} />
      <Route path="/privacy-policy" element={<PortfolioPrivacyPolicy />} />
      <Route path="/auth/notion/:status" element={<NotionAuthResult />} />
      <Route path="/the-blockchain-circus" element={<TheBlockchainCircus />} />
      <Route path="/the-blockchain-circus/terms-of-service" element={<TermsOfService />} />
      <Route path="/the-blockchain-circus/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/tiktok-callback" element={<TikTokCallback />} />
      <Route path="/executive-summary" element={<ExecutiveSummary />} />
    </Routes>
    </>
  )
}

export default App
