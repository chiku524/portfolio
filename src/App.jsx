import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import logoMark from './assets/generated-image.png'
import { initAnalytics, trackEvent, trackPageView } from './utils/analytics'
import { measureWebVitals } from './utils/webVitals'

function App() {
  const backgroundCanvasRef = useRef(null)
  const videoRefs = useRef({})
  const trailRef = useRef(null)
  const rippleLayerRef = useRef(null)
  const audioRef = useRef(null)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    const existingScript = document.querySelector('script[data-calendly]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.dataset.calendly = 'true'
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
    return undefined
  }, [])

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal')
    if (!revealEls.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -12% 0px',
      },
    )

    const maxStep = 6
    revealEls.forEach((el, index) => {
      const customDelay = el.dataset.revealDelay
      if (customDelay) {
        el.style.setProperty('--reveal-delay', customDelay)
      } else {
        const parsedStep = Number(el.dataset.revealStep)
        const hasCustomStep = !Number.isNaN(parsedStep)
        const step = hasCustomStep ? parsedStep : Math.min(index, maxStep)
        const clampedStep = Math.max(0, Math.min(step, maxStep))
        el.style.setProperty('--reveal-delay', `${clampedStep * 60}ms`)
      }
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = trailRef.current
    if (!container) return undefined
    
    // Disable cursor trail on mobile to save memory
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchDevice) {
      return undefined
    }

    let ticking = false
    const sparkPool = []
    const MAX_SPARKS = 20 // Limit active sparks to prevent memory buildup

    const createSpark = () => {
      const spark = document.createElement('span')
      spark.className = 'cursor-spark'
      return spark
    }

    const getSpark = () => {
      return sparkPool.pop() || createSpark()
    }

    const handlePointerMove = (event) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        // Limit number of active sparks
        const activeSparks = container.querySelectorAll('.cursor-spark').length
        if (activeSparks >= MAX_SPARKS) {
          ticking = false
          return
        }

        const spark = getSpark()
        spark.style.left = `${event.clientX}px`
        spark.style.top = `${event.clientY}px`
        container.appendChild(spark)
        
        setTimeout(() => {
          spark.remove()
          // Return to pool if pool is small
          if (sparkPool.length < 10) {
            sparkPool.push(spark)
          }
          ticking = false
        }, 650)
        ticking = false
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      // Clean up spark pool
      sparkPool.length = 0
      if (container) {
        const sparks = container.querySelectorAll('.cursor-spark')
        sparks.forEach((spark) => spark.remove())
      }
    }
  }, [])

  useEffect(() => {
    const layer = rippleLayerRef.current
    if (!layer) return undefined

    // Disable ripple on mobile to save memory
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchDevice) {
      return undefined
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
    if (!canvas) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const ctx = canvas.getContext('2d', { alpha: true })
    const colors = [
      'rgba(56, 189, 248, 0.35)',
      'rgba(34, 211, 238, 0.32)',
      'rgba(45, 212, 191, 0.3)',
      'rgba(59, 130, 246, 0.28)',
      'rgba(8, 145, 178, 0.26)',
    ]

    // Disable canvas entirely on mobile to prevent crashes
    if (isTouchDevice) {
      canvas.style.display = 'none'
      return undefined
    }

    // Reduce blob count on mobile for better performance
    const blobCount = prefersReducedMotion.matches ? 5 : 12
    const blobs = Array.from({ length: blobCount }).map((_, index) => ({
      baseX: Math.random(),
      baseY: Math.random(),
      radius: 0.28 + Math.random() * 0.32,
      amplitudeX: 0.06 + Math.random() * 0.15,
      amplitudeY: 0.05 + Math.random() * 0.12,
      speed: 0.18 + Math.random() * 0.2,
      wobble: 0.18 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
      color: colors[index % colors.length],
    }))
    // Reduce caustics on mobile
    const causticCount = prefersReducedMotion.matches ? 2 : isTouchDevice ? 3 : 5
    const caustics = Array.from({ length: causticCount }).map((_, index) => ({
      baseX: Math.random(),
      baseY: Math.random(),
      scale: 0.6 + Math.random() * 0.8,
      speed: 0.12 + Math.random() * 0.16,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      color: `rgba(126, 211, 255, ${0.04 + index * 0.01})`,
    }))
    // Reduce bubbles on mobile
    const bubbleCount = prefersReducedMotion.matches ? 16 : isTouchDevice ? 24 : 42
    const bubbles = Array.from({ length: bubbleCount }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.01 + Math.random() * 0.02,
      speed: 0.015 + Math.random() * 0.03,
      sway: 0.01 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.06 + Math.random() * 0.07,
    }))

    let width = window.innerWidth
    let height = window.innerHeight
    let motionFactor = prefersReducedMotion.matches ? 0.35 : isTouchDevice ? 0.6 : 1
    let isPageVisible = true
    let lastFrameTime = 0
    const targetFPS = isTouchDevice ? 30 : 60
    const frameInterval = 1000 / targetFPS

    const setCanvasOpacity = () => {
      if (prefersReducedMotion.matches) {
        canvas.style.opacity = '0.5'
      } else if (isTouchDevice) {
        canvas.style.opacity = '0.6'
      } else {
        canvas.style.opacity = '0.92'
      }
    }

    // Pause rendering when page is not visible
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
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
    }

    resize()
    setCanvasOpacity()
    window.addEventListener('resize', resize)

    const handleMotionChange = () => {
      const updatedIsTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      motionFactor = prefersReducedMotion.matches ? 0.35 : updatedIsTouch ? 0.6 : 1
      setCanvasOpacity()
    }

    prefersReducedMotion.addEventListener('change', handleMotionChange)

    // Check for touch device changes
    const touchMediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)')
    touchMediaQuery.addEventListener('change', handleMotionChange)

    const startTime = performance.now()

    const wrap = (value) => {
      if (value < -0.25) return value + 1
      if (value > 1.25) return value - 1
      return value
    }

    // Optimize: Create gradients outside render loop and reuse them
    const gradientCache = new Map()
    let frameSkipCount = 0
    const FRAME_SKIP = 1 // Render every 2nd frame for better performance

    let animationFrameId
    let isRendering = true
    
    const render = (currentTime) => {
      // Stop rendering loop if component unmounted
      if (!isRendering) return

      // Skip frame if page is not visible - don't even request next frame
      if (!isPageVisible) {
        // Check visibility periodically instead of constant loop
        setTimeout(() => {
          if (isRendering && isPageVisible) {
            animationFrameId = requestAnimationFrame(render)
          }
        }, 100)
        return
      }

      // Skip every Nth frame to reduce load
      frameSkipCount++
      if (frameSkipCount % (FRAME_SKIP + 1) !== 0) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Throttle frames
      if (currentTime - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(render)
        return
      }
      lastFrameTime = currentTime

      try {
        const elapsed = (performance.now() - startTime) / 1000
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'lighter'
        const alphaStrength = Math.max(0.16, 0.55 * motionFactor)
        ctx.globalAlpha = alphaStrength
        
        // Render caustics with optimized gradient creation
        caustics.forEach((wave, index) => {
          const drift = elapsed * wave.speed
          const offsetX = wrap(wave.baseX + Math.sin(drift + wave.phase + index) * 0.25)
          const offsetY = wrap(wave.baseY + Math.cos(drift * 0.75 + wave.phase) * 0.2)
          const size = Math.max(width, height) * (wave.scale * (prefersReducedMotion.matches ? 0.8 : 1.05))

          const x = offsetX * width
          const y = offsetY * height
          
          // Use simpler rendering on mobile - no complex gradients
          const cacheKey = `wave-${index}-${Math.floor(drift * 0.1)}`
          let gradient = gradientCache.get(cacheKey)
          
          if (!gradient) {
            gradient = ctx.createRadialGradient(x, y, size * 0.1, x, y, size)
            gradient.addColorStop(0, wave.color)
            gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.05)')
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)')
            // Cache for a short time, then clear old entries
            if (gradientCache.size > 10) {
              const firstKey = gradientCache.keys().next().value
              gradientCache.delete(firstKey)
            }
            gradientCache.set(cacheKey, gradient)
          }

          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(wave.rotation + Math.sin(drift) * 0.2)
          ctx.translate(-x, -y)
          ctx.fillStyle = gradient
          ctx.fillRect(x - size, y - size, size * 2, size * 2)
          ctx.restore()
        })

        ctx.globalAlpha = alphaStrength
        blobs.forEach((blob, index) => {
          const drift = elapsed * blob.speed
          const pulse = Math.sin(drift + blob.phase)
          const secondary = Math.cos(drift * 0.7 + blob.phase)

          const x = wrap(blob.baseX + Math.sin(drift * 2.2 + blob.phase + index) * blob.amplitudeX)
          const y = wrap(blob.baseY + Math.cos(drift * 1.8 + blob.phase * 1.2) * blob.amplitudeY)
          const wobbleRadius = blob.radius * (1 + pulse * blob.wobble * 0.35)

          // Simplified blob rendering
          const radius = Math.max(width, height) * wobbleRadius * (0.85 + secondary * 0.15) * (0.75 + motionFactor * 0.5)
          const cacheKey = `blob-${index}-${Math.floor(drift * 0.1)}`
          let gradient = gradientCache.get(cacheKey)
          
          if (!gradient) {
            gradient = ctx.createRadialGradient(
              x * width,
              y * height,
              0,
              x * width,
              y * height,
              radius,
            )
            gradient.addColorStop(0, blob.color)
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)')
            if (gradientCache.size > 20) {
              const firstKey = gradientCache.keys().next().value
              gradientCache.delete(firstKey)
            }
            gradientCache.set(cacheKey, gradient)
          }

          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)
        })

        // Simplified bubble rendering - reduce bubble count dynamically
        const activeBubbles = Math.min(bubbles.length, prefersReducedMotion.matches ? 10 : 20)
        ctx.globalAlpha = Math.max(0.12, 0.4 * motionFactor)
        ctx.globalCompositeOperation = 'lighter'
        bubbles.slice(0, activeBubbles).forEach((bubble) => {
          bubble.y -= bubble.speed * motionFactor * 0.6
          bubble.x += Math.cos(elapsed * bubble.speed * 8 + bubble.phase) * bubble.sway * 0.6
          if (bubble.y < -0.08) {
            bubble.y = 1.05
            bubble.x = Math.random()
            bubble.phase = Math.random() * Math.PI * 2
          }

          const bx = wrap(bubble.x) * width
          const by = bubble.y * height
          const radius = Math.max(width, height) * bubble.radius * (prefersReducedMotion.matches ? 0.8 : 1.1)
          
          // Use simpler bubble rendering - solid fill instead of gradient
          ctx.fillStyle = `rgba(255, 255, 255, ${bubble.alpha * 0.3})`
          ctx.beginPath()
          ctx.arc(bx, by, radius, 0, Math.PI * 2)
          ctx.fill()
        })
      } catch (error) {
        console.error('Canvas rendering error:', error)
        // Stop rendering on error to prevent crash loop
        isRendering = false
        canvas.style.display = 'none'
        return
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      isRendering = false
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('resize', resize)
      prefersReducedMotion.removeEventListener('change', handleMotionChange)
      touchMediaQuery.removeEventListener('change', handleMotionChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      // Clear gradient cache
      gradientCache.clear()
      // Clear canvas
      if (ctx) {
        ctx.clearRect(0, 0, width, height)
      }
    }
  }, [])

  useEffect(() => {
    let ticking = false
    const updateScrollProgress = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
      const progressPercent = progress * 100
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3))
      setScrollProgress(progressPercent)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    updateScrollProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside, on link, or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking the toggle button itself
      if (event.target.closest('.nav__menu-toggle')) {
        return
      }
      if (isMobileMenuOpen && !event.target.closest('.nav__links') && !event.target.closest('.nav__menu-toggle')) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleLinkClick = () => {
      setIsMobileMenuOpen(false)
    }

    const handleEscape = (event) => {
      if (isMobileMenuOpen && event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      // Use capture phase and delay to avoid immediate close
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true)
      }, 0)
      document.addEventListener('keydown', handleEscape)
      const navLinks = document.querySelectorAll('.nav__links a')
      navLinks.forEach((link) => link.addEventListener('click', handleLinkClick))
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
        document.removeEventListener('keydown', handleEscape)
        navLinks.forEach((link) => link.removeEventListener('click', handleLinkClick))
      }
    }
    return undefined
  }, [isMobileMenuOpen])

  const handleMenuToggle = (event) => {
    event.stopPropagation()
    // Don't preventDefault - allow button to work normally
    setIsMobileMenuOpen((prev) => !prev)
  }

  // Initialize analytics and web vitals
  useEffect(() => {
    initAnalytics()
    const cleanupWebVitals = measureWebVitals()

    // Track page view on mount
    trackPageView(window.location.pathname)
    
    return () => {
      if (cleanupWebVitals) cleanupWebVitals()
    }
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
        name: 'VentureVibe',
        url: 'https://venturevibe.created.app/',
        badge: 'SaaS launchpad',
        description:
          'Elevate SaaS. Gamify discovery. Predict the future. VentureVibe blends mobile-first SaaS discovery with SOL-powered prediction markets so founders and forecasters can spot the next unicorn together.',
        highlight: 'Gamified forecasts, SOL blockchain rails, real-time API analytics.',
        media: buildMediaPaths('VentureVibe'),
      },
      {
        name: 'BountyHub',
        url: 'https://bountyhub.tech/',
        badge: 'Live ecosystem',
        description:
          'Web3 growth hub dispensing bounties, cred, and inside jokes. I help maintain the product narrative while shipping features at startup pace.',
        highlight: 'Growth funnels, bounty flow, and contributor dashboards.',
        media: buildMediaPaths('Bountyhub'),
      },
      {
        name: 'Boing Finance',
        url: 'https://boing.finance/',
        badge: 'DeFi in motion',
        description:
          'Frontend experiments and backend tooling for a playful yet compliant DeFi launchpad. Think serious tokenomics with meme-ready energy.',
        highlight: 'Launchpad UX, token strategy dashboards, community drops.',
        media: buildMediaPaths('boing.finance'),
      },
      {
        name: 'Blockchain Vibe',
        url: 'https://blockchainvibe.news/',
        badge: 'Media lab',
        description:
          'Content engine that blends data, culture, and alpha leaks. I co-pilot automation, editorial pipelines, and on-chain analytics.',
        highlight: 'Automation pipelines, AI content flows, analytics stack.',
        media: buildMediaPaths('BlockchainVibe News'),
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
    if (!cards.length) return undefined

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
  }, [ensureVideoLoaded, proofOfWork])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-depth]'))
    if (!sections.length) return undefined

    document.body.dataset.depth = sections[0]?.dataset.depth || 'surface'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.body.dataset.depth = entry.target.dataset.depth || 'surface'
          }
        })
      },
      { threshold: 0.55 },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
      delete document.body.dataset.depth
    }
  }, [])

  useEffect(() => {
    const snappables = Array.from(document.querySelectorAll('[data-snappable="true"]'))
    if (!snappables.length) return undefined
    let isAnimating = false

    const composedPath = (event) => {
      if (typeof event.composedPath === 'function') {
        return event.composedPath()
      }
      const path = []
      let target = event.target
      while (target) {
        path.push(target)
        target = target.parentNode
      }
      path.push(window)
      return path
    }

    const getClosestSection = () => {
      const midpoint = window.scrollY + window.innerHeight / 2
      let closest = snappables[0]
      let minDist = Infinity
      snappables.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const center = rect.top + window.scrollY + rect.height / 2
        const dist = Math.abs(center - midpoint)
        if (dist < minDist) {
          minDist = dist
          closest = section
        }
      })
      return closest
    }

    const hasScrollableParent = (event) => {
      const path = composedPath(event)
      for (const node of path) {
        if (!(node instanceof HTMLElement)) continue
        if (node.dataset.snapLock === 'false') {
          return true
        }
        const style = window.getComputedStyle(node)
        const overflowY = style.overflowY
        const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1
        if (canScroll) {
          const atTop = node.scrollTop <= 0
          const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1
          if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) {
            return true
          }
        }
        if (node === document.body) break
      }
      return false
    }

    const scrollToIndex = (targetIndex) => {
      const clampedIndex = Math.max(0, Math.min(targetIndex, snappables.length - 1))
      const target = snappables[clampedIndex]
      if (!target) return
      isAnimating = true
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        isAnimating = false
      }, 900)
    }

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) < 25) return
      const active = getClosestSection()
      const currentIndex = snappables.indexOf(active)
      if (currentIndex === -1) return
      const rect = active.getBoundingClientRect()
      const hasOverflowBelow = rect.bottom > window.innerHeight + 6
      const hasOverflowAbove = rect.top < -6
      if ((event.deltaY > 0 && hasOverflowBelow) || (event.deltaY < 0 && hasOverflowAbove)) {
        return
      }
      if (hasScrollableParent(event)) {
        return
      }
      if (isAnimating) {
        event.preventDefault()
        return
      }

      const nextIndex = event.deltaY > 0 ? currentIndex + 1 : currentIndex - 1
      const clampedIndex = Math.max(0, Math.min(nextIndex, snappables.length - 1))
      if (clampedIndex === currentIndex) {
        return
      }
      event.preventDefault()
      scrollToIndex(clampedIndex)
    }

    const handleKeydown = (event) => {
      const forwardKeys = ['ArrowDown', 'PageDown', 'Space']
      const backwardKeys = ['ArrowUp', 'PageUp']
      if (!forwardKeys.includes(event.code) && !backwardKeys.includes(event.code)) return
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        return
      }
      const active = getClosestSection()
      const currentIndex = snappables.indexOf(active)
      if (currentIndex === -1) return

      let delta = forwardKeys.includes(event.code) ? 1 : -1
      if (event.code === 'Space' && event.shiftKey) {
        delta = -1
      }
      const targetIndex = Math.max(0, Math.min(currentIndex + delta, snappables.length - 1))
      if (targetIndex === currentIndex) {
        return
      }
      event.preventDefault()
      if (isAnimating) return
      scrollToIndex(targetIndex)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeydown, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl) return undefined
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

  return (
    <div className="app">
      <canvas ref={backgroundCanvasRef} className="background-canvas" aria-hidden="true" />
      <div className="depth-overlay" aria-hidden="true" />
      <div ref={rippleLayerRef} className="ripple-layer" aria-hidden="true" />
      <div ref={trailRef} className="cursor-trail" aria-hidden="true" />
      <div className="wave-cluster" aria-hidden="true">
        <span className="wave wave--far" />
        <span className="wave wave--mid" />
        <span className="wave wave--near" />
      </div>
      <div className="ocean-kelp ocean-kelp--left" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="ocean-kelp ocean-kelp--right" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="ocean-orbs" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="sea-turtle" aria-hidden="true">
        <span className="turtle-shell" />
        <span className="turtle-head" />
        <span className="turtle-fin turtle-fin--front-left" />
        <span className="turtle-fin turtle-fin--front-right" />
        <span className="turtle-fin turtle-fin--back-left" />
        <span className="turtle-fin turtle-fin--back-right" />
      </div>
      <div className="manta-ray" aria-hidden="true">
        <span className="manta-body" />
        <span className="manta-tail" />
      </div>
      <div className="jellyfish-field" aria-hidden="true">
        <div className="jellyfish jellyfish--one">
          <span className="jellyfish__body" />
          <span className="jellyfish__tentacle jellyfish__tentacle--one" />
          <span className="jellyfish__tentacle jellyfish__tentacle--two" />
          <span className="jellyfish__tentacle jellyfish__tentacle--three" />
          <span className="jellyfish__tentacle jellyfish__tentacle--four" />
        </div>
        <div className="jellyfish jellyfish--two">
          <span className="jellyfish__body" />
          <span className="jellyfish__tentacle jellyfish__tentacle--one" />
          <span className="jellyfish__tentacle jellyfish__tentacle--two" />
          <span className="jellyfish__tentacle jellyfish__tentacle--three" />
          <span className="jellyfish__tentacle jellyfish__tentacle--four" />
        </div>
        <div className="jellyfish jellyfish--three">
          <span className="jellyfish__body" />
          <span className="jellyfish__tentacle jellyfish__tentacle--one" />
          <span className="jellyfish__tentacle jellyfish__tentacle--two" />
          <span className="jellyfish__tentacle jellyfish__tentacle--three" />
          <span className="jellyfish__tentacle jellyfish__tentacle--four" />
        </div>
        <div className="jellyfish jellyfish--mini">
          <span className="jellyfish__body" />
          <span className="jellyfish__tentacle jellyfish__tentacle--one" />
          <span className="jellyfish__tentacle jellyfish__tentacle--three" />
        </div>
      </div>
      <div className="coastal-silhouette" aria-hidden="true">
        <span className="coastline" />
        <span className="lighthouse">
          <span className="lighthouse__tower" />
          <span className="lighthouse__cap" />
          <span className="lighthouse__light">
            <span className="lighthouse__beam lighthouse__beam--left" />
            <span className="lighthouse__beam lighthouse__beam--right" />
          </span>
        </span>
        <span className="palm palm--left">
          <span className="palm__trunk" />
          <span className="palm__leaf palm__leaf--one" />
          <span className="palm__leaf palm__leaf--two" />
          <span className="palm__leaf palm__leaf--three" />
        </span>
        <span className="palm palm--right">
          <span className="palm__trunk" />
          <span className="palm__leaf palm__leaf--one" />
          <span className="palm__leaf palm__leaf--two" />
          <span className="palm__leaf palm__leaf--three" />
        </span>
      </div>
      <div className="app__content">
        {/* Scroll Progress Indicator */}
        <div className="scroll-progress" role="progressbar" aria-valuenow={scrollProgress} aria-valuemin="0" aria-valuemax="100" aria-label="Page scroll progress">
          <div className="scroll-progress__bar" style={{ width: `${scrollProgress}%` }} />
        </div>
        <header className="nav-wrapper">
          <nav className="nav page-shell">
            <a className="nav__brand" href="#top" aria-label="Nico Chikuji portfolio homepage">
              <img className="nav__logo" src={logoMark} alt="Nico Chikuji oceanic logo" loading="eager" fetchPriority="high" />
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
            <div className={`nav__links ${isMobileMenuOpen ? 'nav__links--open' : ''}`} id="nav-menu">
              <a href="#proof" aria-label="View proof of work" onClick={() => trackEvent('nav_click', { link: 'proof' })}>Proof</a>
              <a href="#skills" aria-label="View skills" onClick={() => trackEvent('nav_click', { link: 'skills' })}>Skills</a>
              <a href="#aspirations" aria-label="View aspirations" onClick={() => trackEvent('nav_click', { link: 'aspirations' })}>Aspirations</a>
              <a href="#contact" aria-label="View contact information" onClick={() => trackEvent('nav_click', { link: 'contact' })}>Contact</a>
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
            <span />
            <span />
            <span />
            <span />
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
          <div className="hero__inner page-shell">
            <div className="hero__content reveal">
              <div className="hero__eyebrow">
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
                  <span className="button__icon">↗</span>
                </a>
                <a className="button button--ghost" href={calendlyLink} target="_blank" rel="noreferrer">
                  Launch a voyage
                  <span className="button__icon">≈</span>
                </a>
              </div>
              <div className="hero__meta">
                <span>
                  Currently collaborating with AI copilots, founders, and legendary crews on the next big wave.
                </span>
              </div>
              <div className="hero__values">
                <span className="value-chip">Innovation × Precision</span>
                <span className="value-chip">Community-First Collaboration</span>
                <span className="value-chip">Playful Seriousness</span>
                <span className="value-chip">Adaptive Ecosystem Design</span>
              </div>
            </div>
          </div>
          <div className="hero__divider" aria-hidden="true">
            <span className="hero__wave hero__wave--left" />
            <span className="hero__wave hero__wave--right" />
          </div>
        </header>

        <main>
          <section className="section section--proof page-shell" id="proof" data-snappable="true" data-depth="reef">
            <div className="section__header reveal">
              <h2>Live Reef Signals</h2>
              <p>Production ecosystems sailing today—dive in to see them operating in the wild.</p>
            </div>
            <div className="project-grid">
              {proofOfWork.map((project) => (
                <article key={project.name} className="project-card reveal" data-project-name={project.name}>
                  <a
                    className="project-card__preview"
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    style={
                      project.media?.thumbnail
                        ? { '--project-thumb': `url(${project.media.thumbnail})` }
                        : undefined
                    }
                    onMouseEnter={() => handlePreviewEnter(project.name)}
                    onMouseLeave={() => handlePreviewLeave(project.name)}
                    onFocus={() => handlePreviewEnter(project.name)}
                    onBlur={() => handlePreviewLeave(project.name)}
                    onTouchStart={() => handlePreviewEnter(project.name)}
                    onTouchEnd={() => handlePreviewLeave(project.name)}
                    onTouchCancel={() => handlePreviewLeave(project.name)}
                  >
                    {(project.media?.webm || project.media?.mp4) && (
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
                    <div className="project-card__overlay">
                      <span>Visit reef ↗</span>
                    </div>
                    <div className="project-card__shimmer" aria-hidden="true" />
                  </a>
                  <div className="project-card__body">
                    <span className="card__badge">{project.badge}</span>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-card__meta">
                      <span>{project.highlight}</span>
                      <a href={project.url} target="_blank" rel="noreferrer">
                        Open project ↗
        </a>
      </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <div className="wave-divider wave-divider--shallow" aria-hidden="true" />

          <section className="section section--skills page-shell" id="skills" data-snappable="true" data-depth="mid">
            <div className="section__header reveal">
              <h2>Dive Equipment</h2>
              <p>Capabilities tuned for fast shipping, resilient scaling, and community-first experiences.</p>
            </div>
            <div className="columns columns--stagger">
              <div className="card card--column reveal">
                <h3>Product Charter</h3>
                <ul>
                  <li>Full-stack delivery with React, Next.js, Supabase, Node, and resilient infra.</li>
                  <li>Design systems that balance premium polish, crisp UX flows, and measurable KPIs.</li>
                  <li>Reliable release cadence—async rituals, pair sessions, and transparent roadmaps.</li>
                </ul>
              </div>
              <div className="card card--column reveal">
                <h3>AI Amplification</h3>
                <ul>
                  <li>Cursor-first workflow for rapid ideation, refactors, automated QA, and docs.</li>
                  <li>Custom prompting for briefs, narrative design, growth experiments, and analytics.</li>
                  <li>Copilots powering smart contracts, operational tooling, and creator pipelines.</li>
                </ul>
              </div>
              <div className="card card--column reveal">
                <h3>Web3 & Culture</h3>
                <ul>
                  <li>Composable dApps with wallet UX that feels familiar, safe, and fun to click through.</li>
                  <li>On-chain insights—dashboards, bots, automated reporting—fueled by AI analysis.</li>
                  <li>Community playbooks across lore, memes, launch comms, and retention loops.</li>
                </ul>
              </div>
            </div>
            <div className="toolkit reveal">
              <h4>Creative Toolkit</h4>
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
            </div>
          </section>
          <div className="wave-divider wave-divider--mid" aria-hidden="true" />

          <section className="section section--currents page-shell" id="aspirations" data-snappable="true" data-depth="deep">
            <div className="section__header reveal">
              <h2>Future Currents</h2>
              <p>Always charting the next voyage—preferably with a co-captain on deck.</p>
            </div>
            <div className="aspirations">
              <div className="aspirations__card reveal">
                <span className="aspirations__label">01</span>
                <h3>Innovation × Precision</h3>
                <p>
                  Future habitats deserve engineering rigor. I prototype fast, validate with data, and polish
                  relentlessly so every release feels tide tested.
                </p>
              </div>
              <div className="aspirations__card reveal">
                <span className="aspirations__label">02</span>
                <h3>Community-First Collaboration</h3>
                <p>
                  Co-creating with founders, DAOs, and creators keeps the reef thriving—open comms, async rituals,
                  and transparent roadmaps invite everyone on deck.
                </p>
              </div>
              <div className="aspirations__card reveal">
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
              <h2>Signal the Crew</h2>
              <p>
                Plotting a stealth launch, growth sprint, or content wave? Drop a signal—we’ll chart the map
                together.
              </p>
            </div>
            <div className="contact-grid">
              <div className="card card--contact reveal" data-reveal-step="1">
                <span className="card__badge card__badge--signal">Direct line</span>
                <h3>Email</h3>
                <a className="contact-email" href="mailto:nico.chikuji@gmail.com">
                  nico.chikuji@gmail.com
                </a>
                <p>Send the plan, the problem, or the meme. I’ll respond faster than the tide changes.</p>
              </div>
              <div className="card card--contact reveal" data-reveal-step="2">
                <span className="card__badge card__badge--orbit">Signal buoys</span>
                <h3>Social channels</h3>
                <ul className="contact-socials">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        <span className="contact-label">{link.label}</span>
                        {link.isUserHandle ? (
                          <span className="contact-handle">{link.handle}</span>
                        ) : (
                          <span className="contact-handle">@{link.handle.replace(/^@?/, '')}</span>
                        )}
                        <span className="contact-tone">{link.tone}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card card--contact reveal" data-reveal-step="3">
                <span className="card__badge card__badge--signal">Message</span>
                <h3>Drop a message</h3>
                <form
                  className="contact-form"
                  action="https://formsubmit.co/nico.chikuji@gmail.com"
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
                    <select id="topic" name="topic" defaultValue="collab">
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
                    Powered by FormSubmit for now—happy to sync via Matrix, Warpcast, or Discord if you prefer.
                  </p>
                </form>
              </div>
              <div className="card card--contact card--calendly reveal">
                <span className="card__badge card__badge--spark">Book time</span>
                <h3>Discovery dive</h3>
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
              <img className="footer__logo" src={logoMark} alt="Nico builds wave logo" loading="lazy" />
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
                Start a collab
              </a>
              <a className="button button--ghost" href="#top">
                Back to top
              </a>
            </div>
            <span className="footer__note">
              © {new Date().getFullYear()} nico.builds — fueled by AI copilots and meme-grade imagination.
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
}

export default App
