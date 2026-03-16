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
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import PortfolioTermsOfService from './pages/PortfolioTermsOfService'
import PortfolioPrivacyPolicy from './pages/PortfolioPrivacyPolicy'
import NotionAuthResult from './pages/NotionAuthResult'
import TheBlockchainCircus from './pages/TheBlockchainCircus'
import TikTokCallback from './pages/TikTokCallback'
import GitHubActivityChart from './components/GitHubActivityChart'
import OceanBackground from './components/OceanBackground'

function Portfolio() {
  useSeo({
    title: 'Nico Chikuji | Full-Stack Developer | Flow Beyond Limits',
    description:
      'Full-stack developer crafting future internet habitats with tide-tested precision. From web3 reefs to AI-powered currents, building products that perform, delight, and echo community culture.',
  })
  const backgroundCanvasRef = useRef(null)
  const videoRefs = useRef({})
  const trailRef = useRef(null)
  const trailCanvasRef = useRef(null)
  const rippleLayerRef = useRef(null)
  const audioRef = useRef(null)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const scrollProgressRef = useRef(null)
  const scrollProgressBarRef = useRef(null)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [perfMode, setPerfMode] = useState(() => {
    try {
      if (typeof sessionStorage === 'undefined') return true
      return sessionStorage.getItem('portfolio-full-animations') !== '1'
    } catch {
      return true
    }
  })
  const [deferHeavyDecorations, setDeferHeavyDecorations] = useState(true)

  useEffect(() => {
    if (perfMode) return
    const id = requestIdleCallback(
      () => setDeferHeavyDecorations(false),
      { timeout: 1800 }
    )
    return () => cancelIdleCallback(id)
  }, [perfMode])

  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return
    if (perfMode) {
      document.body.classList.add('perf-mode')
    } else {
      document.body.classList.remove('perf-mode')
    }
    return () => document.body.classList.remove('perf-mode')
  }, [perfMode])

  const enableFullAnimations = useCallback(() => {
    try {
      sessionStorage.setItem('portfolio-full-animations', '1')
      sessionStorage.removeItem('portfolio-reduce-animations')
      setPerfMode(false)
    } catch {}
  }, [])

  const reduceAnimations = useCallback(() => {
    try {
      sessionStorage.setItem('portfolio-reduce-animations', '1')
      sessionStorage.removeItem('portfolio-full-animations')
      setPerfMode(true)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (typeof document === 'undefined' || !document.body) {
        return
      }
      
      const existingScript = document.querySelector('script[data-calendly]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://assets.calendly.com/assets/external/widget.js'
        script.async = true
        script.dataset.calendly = 'true'
        script.onerror = () => {
          console.warn('Failed to load Calendly script')
        }
        document.body.appendChild(script)
        return () => {
          try {
            if (document.body && script.parentNode) {
              document.body.removeChild(script)
            }
          } catch (error) {
            console.warn('Error removing Calendly script:', error)
          }
        }
      }
    } catch (error) {
      console.warn('Calendly script loading error:', error)
    }
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
    const canvas = trailCanvasRef.current
    const container = trailRef.current
    if (!canvas || !container) return

    let isTouchDevice = false
    try {
      if (window.matchMedia) {
        isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      }
    } catch (error) {
      isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }

    if (isTouchDevice) return

    const MAX_POINTS = 55
    const THROTTLE_MS = 16
    const points = []
    let lastAddTime = 0
    let rafId = null
    let loopRunning = false

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    const TRAIL_MS = 260

    const draw = () => {
      const ctx = canvas.getContext('2d')
      const now = Date.now()

      while (points.length > 0 && now - points[0].t > TRAIL_MS) {
        points.shift()
      }

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      if (points.length < 2) {
        loopRunning = false
        return
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1]
        const p1 = points[i]
        const age1 = now - p1.t
        const t = i / points.length
        const fade = Math.max(0, 1 - (age1 / TRAIL_MS) * 0.85)
        const alpha = (0.2 + t * 0.5) * fade
        const width = 2 + t * 2.5
        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
      }

      rafId = requestAnimationFrame(draw)
    }

    const handlePointerMove = (event) => {
      const now = Date.now()
      if (now - lastAddTime < THROTTLE_MS) return
      lastAddTime = now
      points.push({ x: event.clientX, y: event.clientY, t: now })
      if (points.length > MAX_POINTS) points.shift()
      if (points.length >= 2 && !loopRunning) {
        loopRunning = true
        rafId = requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const layer = rippleLayerRef.current
    if (!layer) return

    // Disable ripple on mobile to save memory
    let isTouchDevice = false
    try {
      if (window.matchMedia) {
        isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      }
    } catch (error) {
      // Fallback: assume touch device if matchMedia fails
      isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }
    
    if (isTouchDevice) {
      return
    }

    const ripplePool = []
    const MAX_RIPPLES = 10 // Limit active ripples

    const createRipple = () => {
      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      return ripple
    }

    const getRipple = () => {
      return ripplePool.pop() || createRipple()
    }

    const spawnRipple = (event) => {
      // Limit number of active ripples
      const activeRipples = layer.querySelectorAll('.ripple').length
      if (activeRipples >= MAX_RIPPLES) {
        return
      }

      const ripple = getRipple()
      ripple.style.left = `${event.clientX}px`
      ripple.style.top = `${event.clientY}px`
      layer.appendChild(ripple)
      
      const timeoutId = setTimeout(() => {
        ripple.remove()
        // Return to pool if pool is small
        if (ripplePool.length < 5) {
          ripplePool.push(ripple)
        }
      }, 1200)
      
      // Store timeout ID for cleanup
      ripple.dataset.timeoutId = timeoutId
    }

    const handlePointerDown = (event) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        spawnRipple(event)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      // Clean up all ripples and timeouts
      if (layer) {
        const ripples = layer.querySelectorAll('.ripple')
        ripples.forEach((ripple) => {
          const timeoutId = ripple.dataset.timeoutId
          if (timeoutId) clearTimeout(parseInt(timeoutId, 10))
          ripple.remove()
        })
      }
      ripplePool.length = 0
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
    } catch (error) {
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
    } catch (error) {
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
      ctx.globalAlpha = 0.5
      const cx = width * 0.3
      const cy = height * 0.35
      const r = Math.max(width, height) * 0.7
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      g1.addColorStop(0, 'rgba(56, 189, 248, 0.28)')
      g1.addColorStop(0.6, 'rgba(34, 211, 238, 0.08)')
      g1.addColorStop(1, 'rgba(15, 23, 42, 0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, width, height)
      const cx2 = width * 0.75
      const cy2 = height * 0.2
      const r2 = Math.max(width, height) * 0.6
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2)
      g2.addColorStop(0, 'rgba(59, 130, 246, 0.2)')
      g2.addColorStop(0.7, 'rgba(34, 211, 238, 0.06)')
      g2.addColorStop(1, 'rgba(15, 23, 42, 0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, width, height)
      const cx3 = width * 0.5
      const cy3 = height * 0.7
      const r3 = Math.max(width, height) * 0.5
      const g3 = ctx.createRadialGradient(cx3, cy3, 0, cx3, cy3, r3)
      g3.addColorStop(0, 'rgba(34, 211, 238, 0.12)')
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
        } catch (e) { /* ignore */ }
      }
    }
  }, [])

  useEffect(() => {
    const container = scrollProgressRef.current
    const bar = scrollProgressBarRef.current
    if (!container || !bar) return

    let ticking = false
    let lastCssVarUpdate = 0
    let lastRoundedProgress = -1
    let lastPastHero = false
    let cachedMaxScroll = 0
    let lastScrollHeight = 0
    const SCROLL_PROGRESS_THROTTLE_MS = 200
    const PROGRESS_STEPS = 15

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
      const now = Date.now()
      const rounded = Math.round(progress * PROGRESS_STEPS) / PROGRESS_STEPS
      if (now - lastCssVarUpdate >= SCROLL_PROGRESS_THROTTLE_MS || rounded !== lastRoundedProgress) {
        lastCssVarUpdate = now
        lastRoundedProgress = rounded
        document.documentElement.style.setProperty('--scroll-progress', String(rounded))
        const roundedPercent = Math.round(progress * 100)
        if (roundedPercent !== Number(container.getAttribute('aria-valuenow'))) {
          container.setAttribute('aria-valuenow', roundedPercent)
        }
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

  // Close mobile menu on Escape key and prevent body scroll when open
  useEffect(() => {
    const handleEscape = (event) => {
      if (isMobileMenuOpen && event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      // Prevent body scroll when menu is open
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      
      // Listen for Escape key
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        // Restore body scroll when menu closes
        document.body.style.overflow = originalStyle
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isMobileMenuOpen])

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
        name: 'The Studio Circus',
        url: 'https://thestudiocircus.io/',
        badge: 'AI education',
        description:
          'AI-powered educational video series that entertain, educate, and inspire. Exploring industries through creative storytelling.',
        highlight: 'AI Tech Circus, Sports, Global Events, Blockchain series.',
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
        name: 'VibeMiner',
        url: 'https://vibeminer.tech/',
        badge: 'One-click mining',
        description:
          'Mine without the grind. No terminal, no config. Choose a blockchain, click start, and contribute hashrate—on desktop or web.',
        highlight: 'Boing testnet, Monero, Kaspa, Ergo. Web & desktop.',
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
      tone: 'Daily alpha, ship logs, and NFT-sidequest energy.',
    },
    {
      label: 'LinkedIn',
      handle: 'nicholas-chikuji',
      url: 'https://www.linkedin.com/in/nico-chikuji/',
      tone: 'Professional storyline, collab invites, and growth ops.',
    },
    {
      label: 'GitHub',
      handle: 'chiku524',
      url: 'https://github.com/chiku524',
      tone: 'Repos, experiments, and proof that the commits keep flowing.',
    },
    {
      label: 'Reddit',
      handle: 'u/nicopico524',
      url: 'https://www.reddit.com/user/nicopico524/',
      tone: 'Community dives, AMAs, and meme-encoded research.',
    },
    {
      label: 'YouTube',
      handle: '@nicochikuji',
      url: 'https://www.youtube.com/@nicochikuji',
      tone: 'Visual drops, walkthroughs, and behind-the-scenes builds.',
    },
    {
      label: 'Discord',
      handle: 'nkc6469',
      url: 'https://discord.com/users/nkc6469',
      tone: 'Real-time scheming. DM for invites, demos, or chaos.',
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
    if (perfMode) return
    const sections = Array.from(document.querySelectorAll('[data-depth]'))
    if (!sections.length) return

    let lastDepth = sections[0]?.dataset.depth || 'surface'
    document.body.dataset.depth = lastDepth
    let lastDepthUpdateTime = 0
    const DEPTH_UPDATE_THROTTLE_MS = 400

    if (typeof IntersectionObserver === 'undefined') {
      return () => {
        delete document.body.dataset.depth
      }
    }

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          let best = null
          let bestRatio = 0
          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i]
            if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio
              best = entry.target.dataset.depth || 'surface'
            }
          }
          if (!best || best === lastDepth) return
          const now = Date.now()
          if (now - lastDepthUpdateTime < DEPTH_UPDATE_THROTTLE_MS) return
          lastDepthUpdateTime = now
          lastDepth = best
          document.body.dataset.depth = lastDepth
        },
        { threshold: [0.25, 0.55, 0.85] },
      )

      sections.forEach((section) => observer.observe(section))

      return () => {
        observer.disconnect()
        delete document.body.dataset.depth
      }
    } catch (error) {
      console.error('Depth IntersectionObserver error:', error)
      return () => {
        delete document.body.dataset.depth
      }
    }
  }, [perfMode])

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
    <>
      <div className="ocean-orbs" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <OceanBackground />
      <div className="depth-overlay" aria-hidden="true" />
    </>
  )

  try {
    return (
      <div className="app">
        {/* Ocean layers portaled to body so they use viewport as containing block (avoids auto x auto when parent has transform) */}
        {typeof document !== 'undefined' && document.body && createPortal(oceanLayers, document.body)}
        {!perfMode && (
          <>
            {!deferHeavyDecorations && (
              <>
                <canvas ref={backgroundCanvasRef} className="background-canvas" aria-hidden="true" />
                <div ref={rippleLayerRef} className="ripple-layer" aria-hidden="true" />
                <div ref={trailRef} className="cursor-trail" aria-hidden="true">
                  <canvas ref={trailCanvasRef} className="cursor-trail__canvas" />
                </div>
              </>
            )}
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
                aria-label="View proof of work" 
                onClick={(e) => {
                  trackEvent('nav_click', { link: 'proof' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Anchor className="nav__link-icon" size={14} aria-hidden />
                Proof
              </a>
              <a 
                href="#skills" 
                aria-label="View skills" 
                onClick={(e) => {
                  trackEvent('nav_click', { link: 'skills' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Wrench className="nav__link-icon" size={14} aria-hidden />
                Skills
              </a>
              <a 
                href="#aspirations" 
                aria-label="View aspirations" 
                onClick={(e) => {
                  trackEvent('nav_click', { link: 'aspirations' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Compass className="nav__link-icon" size={14} aria-hidden />
                Aspirations
              </a>
              <a 
                href="#contact" 
                aria-label="View contact information" 
                onClick={(e) => {
                  trackEvent('nav_click', { link: 'contact' })
                  setIsMobileMenuOpen(false)
                }}
              >
                <Mail className="nav__link-icon" size={14} aria-hidden />
                Contact
              </a>
            </div>
            <div className="nav__actions">
              <a className="nav__cta" href={calendlyLink} target="_blank" rel="noreferrer" aria-label="Book a build sprint on Calendly">
                Book a build sprint
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
          {!perfMode && (
            <>
              <div className="hero__aurora hero__aurora--one" />
              <div className="hero__aurora hero__aurora--two" />
              <div className="hero__aurora hero__aurora--three" />
              <div className="hero__ripples hero__ripples--one" />
              <div className="hero__ripples hero__ripples--two" />
              <div className="hero__spray" aria-hidden="true">
                <span className="hero__spray-line hero__spray-line--one" />
                <span className="hero__spray-line hero__spray-line--two" />
                <span className="hero__spray-line hero__spray-line--three" />
              </div>
              <div className="hero__sparkles" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
              <div className="hero__bubbles" aria-hidden="true">
                <span className="hero__bubble hero__bubble--one" />
                <span className="hero__bubble hero__bubble--two" />
                <span className="hero__bubble hero__bubble--three" />
              </div>
              <div className="hero__fish-squad" aria-hidden="true">
                <div className="fish fish--one" />
                <div className="fish fish--two" />
                <div className="fish fish--three" />
                <div className="fish fish--four" />
                <div className="fish fish--five" />
                <div className="fish fish--six" />
              </div>
            </>
          )}
          <div className="hero__inner page-shell">
            <div className="hero__content reveal">
              <div className="hero__eyebrow">
                <Code2 className="hero__eyebrow-icon" size={16} aria-hidden />
                <span className="dot dot--cyan" />
                full-stack developer
              </div>
              <h1>
                Designing future internet habitats <span>with tide-tested precision.</span>
              </h1>
              <p className="hero__mantra">Flow beyond limits. Stay playful, ship serious.</p>
              <p className="hero__tagline">
                From web3 reefs to AI-powered currents, I craft products that perform, delight, and echo
                community culture. Every launch: charted, memorable, seaworthy.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#proof">
                  Explore live reefs
                  <ExternalLink className="button__icon-svg" size={16} aria-hidden />
                </a>
                <a className="button button--ghost" href={calendlyLink} target="_blank" rel="noreferrer">
                  Launch a voyage
                  <Calendar className="button__icon-svg" size={16} aria-hidden />
                </a>
              </div>
              <div className="hero__meta">
                <span>
                  Currently collaborating with AI copilots, founders, and legendary crews on the next big wave.
                </span>
              </div>
              <div className="hero__values">
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
          <section className="section section--proof page-shell" id="proof" data-snappable="true" data-depth="reef">
            <div className="section__header reveal">
              <h2>
                <Anchor className="section__header-icon" size={28} aria-hidden />
                Live Reef Signals
              </h2>
              <p>Production ecosystems sailing today—dive in to see them operating in the wild.</p>
            </div>
            <div className="project-grid">
              {proofOfWork.map((project) => {
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
                        <span><ExternalLink className="project-card__overlay-icon" size={18} aria-hidden /> {isInternalLink ? 'View project' : 'Visit reef'}</span>
                      </div>
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
          <div className="wave-divider wave-divider--shallow" aria-hidden="true" />

          <section className="section section--skills page-shell" id="skills" data-snappable="true" data-depth="mid">
            <div className="section__header reveal">
              <h2>
                <Wrench className="section__header-icon" size={28} aria-hidden />
                Dive Equipment
              </h2>
              <p>Capabilities tuned for fast shipping, resilient scaling, and community-first experiences.</p>
            </div>
            <div className="columns columns--stagger">
              <div className="card card--column reveal">
                <h3><LayoutDashboard className="card__title-icon" size={20} aria-hidden /> Product Charter</h3>
                <ul>
                  <li>Full-stack delivery with React, Next.js, Supabase, Node, and resilient infra.</li>
                  <li>Design systems that balance premium polish, crisp UX flows, and measurable KPIs.</li>
                  <li>Reliable release cadence—async rituals, pair sessions, and transparent roadmaps.</li>
                </ul>
              </div>
              <div className="card card--column reveal">
                <h3><Bot className="card__title-icon" size={20} aria-hidden /> AI Amplification</h3>
                <ul>
                  <li>Cursor-first workflow for rapid ideation, refactors, automated QA, and docs.</li>
                  <li>Custom prompting for briefs, narrative design, growth experiments, and analytics.</li>
                  <li>Copilots powering smart contracts, operational tooling, and creator pipelines.</li>
                </ul>
              </div>
              <div className="card card--column reveal">
                <h3><Globe className="card__title-icon" size={20} aria-hidden /> Web3 & Culture</h3>
                <ul>
                  <li>Composable dApps with wallet UX that feels familiar, safe, and fun to click through.</li>
                  <li>On-chain insights—dashboards, bots, automated reporting—fueled by AI analysis.</li>
                  <li>Community playbooks across lore, memes, launch comms, and retention loops.</li>
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
                Cursor stays glued to my right hand. Everything else—Pisces, CapCut, Canva, custom GPTs—slides in
                when it amplifies output.
              </p>
              <GitHubActivityChart username="chiku524" className="reveal" />
            </div>
          </section>
          <div className="wave-divider wave-divider--mid" aria-hidden="true" />

          <section className="section section--currents page-shell" id="aspirations" data-snappable="true" data-depth="deep">
            <div className="section__header reveal">
              <h2>
                <Compass className="section__header-icon" size={28} aria-hidden />
                Future Currents
              </h2>
              <p>Always charting the next voyage—preferably with a co-captain on deck.</p>
            </div>
            <div className="aspirations">
              <div className="aspirations__card reveal">
                <Target className="aspirations__card-icon" size={24} aria-hidden />
                <span className="aspirations__label">01</span>
                <h3>Innovation × Precision</h3>
                <p>
                  Future habitats deserve engineering rigor. I prototype fast, validate with data, and polish
                  relentlessly so every release feels tide tested.
                </p>
              </div>
              <div className="aspirations__card reveal">
                <Users className="aspirations__card-icon" size={24} aria-hidden />
                <span className="aspirations__label">02</span>
                <h3>Community-First Collaboration</h3>
                <p>
                  Co-creating with founders, DAOs, and creators keeps the reef thriving—open comms, async rituals,
                  and transparent roadmaps invite everyone on deck.
                </p>
              </div>
              <div className="aspirations__card reveal">
                <Smile className="aspirations__card-icon" size={24} aria-hidden />
                <span className="aspirations__label">03</span>
                <h3>Playful Seriousness</h3>
                <p>
                  Tone stays light, craft stays sharp. Humor, lore, and trust weave into every ship date so teams
                  feel energized to chase the next wave together.
                </p>
              </div>
            </div>
          </section>
          <div className="wave-divider wave-divider--deep" aria-hidden="true" />

          <section className="section section--contact page-shell" id="contact" data-snappable="true" data-depth="trench">
            <div className="section__header reveal" data-reveal-step="0">
              <h2>
                <Mail className="section__header-icon" size={28} aria-hidden />
                Signal the Crew
              </h2>
              <p>
                Plotting a stealth launch, growth sprint, or content wave? Drop a signal—we’ll chart the map
                together.
              </p>
            </div>
            <div className="contact-grid">
              <div className="card card--contact reveal" data-reveal-step="1">
                <span className="card__badge card__badge--signal">Direct line</span>
                <h3><Mail className="card__title-icon" size={20} aria-hidden /> Email</h3>
                <a className="contact-email" href="mailto:nico.builds@outlook.com">
                  nico.builds@outlook.com
                </a>
                <p>Send the plan, the problem, or the meme. I’ll respond faster than the tide changes.</p>
              </div>
              <div className="card card--contact reveal" data-reveal-step="2">
                <span className="card__badge card__badge--orbit">Signal buoys</span>
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
                <h3><MessageSquare className="card__title-icon" size={20} aria-hidden /> Drop a message</h3>
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
                      placeholder="you@crew.xyz"
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
                    <label htmlFor="topic">Mission type</label>
                    <select id="topic" name="topic" defaultValue="collab" autoComplete="off">
                      <option value="collab">Product or feature sprint</option>
                      <option value="consult">Consulting / advisory</option>
                      <option value="content">Content & media wave</option>
                      <option value="speaking">Workshop / speaking</option>
                      <option value="other">Something unexpected</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="What waters are we charting together?"
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
                    {isSubmitting ? 'Sending...' : 'Send the signal'}
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
                <h3><Calendar className="card__title-icon" size={20} aria-hidden /> Discovery dive</h3>
                <ul className="contact-next">
                  <li>Align on mission objectives, milestones, and crew roles in 30 focused minutes.</li>
                  <li>Swap docs, decks, and dashboards to accelerate our first sprint.</li>
                  <li>Leave with next steps, resource needs, and a vibe-check summary.</li>
                </ul>
                <a className="button button--primary contact-cta" href={calendlyLink} target="_blank" rel="noreferrer">
                  Reserve a dive slot
                </a>
                <div className="calendar-inline">
                  <div
                    className="calendly-inline-widget"
                    data-url={calendlyLink}
                    style={{ minWidth: '320px', height: '480px' }}
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
          <div className="footer__inner reveal" data-reveal-step="0">
            <div className="footer__brand">
              <img className="footer__logo" src={logoMark} alt="nico.builds logo" loading="lazy" />
              <div className="footer__brand-copy">
                <span className="footer__brand-title">Flow Beyond Limits</span>
                <span className="footer__brand-motto">Full-stack developer for playful, precision builds.</span>
              </div>
            </div>
            <h2>Let’s build something that breaks the timeline.</h2>
            <p>
              Slide into my DMs or drop a line via any project above. I love teaming up with curious builders,
              founders, and designers who want to remix the future with transparency and trust.
            </p>
            <div className="footer__actions">
              <a className="button button--primary" href={calendlyLink} target="_blank" rel="noreferrer">
                <Calendar className="button__icon-svg" size={16} aria-hidden />
                Start a collab
              </a>
              <a className="button button--ghost" href="#top">
                <ArrowUp className="button__icon-svg" size={16} aria-hidden />
                Back to top
              </a>
            </div>
            <span className="footer__note">
              © {new Date().getFullYear()} nico.builds — fueled by AI copilots and meme-grade imagination.
              {' '}
              <Link to="/terms-of-service">Terms</Link>
              {' · '}
              <Link to="/privacy-policy">Privacy</Link>
              {perfMode ? (
                <>
                  {' · '}
                  <button type="button" className="footer__perf-toggle" onClick={enableFullAnimations}>
                    Enable full experience
                  </button>
                </>
              ) : (
                <>
                  {' · '}
                  <button type="button" className="footer__perf-toggle" onClick={reduceAnimations}>
                    Reduce animations
                  </button>
                </>
              )}
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
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/terms-of-service" element={<PortfolioTermsOfService />} />
      <Route path="/privacy-policy" element={<PortfolioPrivacyPolicy />} />
      <Route path="/auth/notion/:status" element={<NotionAuthResult />} />
      <Route path="/the-blockchain-circus" element={<TheBlockchainCircus />} />
      <Route path="/the-blockchain-circus/terms-of-service" element={<TermsOfService />} />
      <Route path="/the-blockchain-circus/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/tiktok-callback" element={<TikTokCallback />} />
    </Routes>
  )
}

export default App
