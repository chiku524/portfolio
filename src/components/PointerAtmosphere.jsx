import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { prefersFinePointer, prefersReducedMotion } from '../utils/motion'
import './PointerAtmosphere.css'

const CYAN = '18, 246, 255'
const TEAL = '20, 201, 201'
const CORAL = '255, 144, 111'
const TRAIL_MS = 820
const MAX_POINTS = 36
const MAX_SPARKS = 48
const MAX_RIPPLES = 6

/**
 * Bioluminescent pointer wake + click ripples.
 * Brand cyan / teal lagoon / coral, matching the ocean theme.
 * Fine pointers only; skipped when the user prefers reduced motion.
 */
export default function PointerAtmosphere() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!prefersFinePointer() || prefersReducedMotion()) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let viewW = window.innerWidth
    let viewH = window.innerHeight
    let dpr = 1
    let reduced = false

    const resize = () => {
      viewW = window.innerWidth
      viewH = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(viewW * dpr)
      canvas.height = Math.floor(viewH * dpr)
      canvas.style.width = `${viewW}px`
      canvas.style.height = `${viewH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const points = []
    const sparks = []
    const ripples = []
    const pointer = { x: 0, y: 0, active: false }
    const halo = { x: 0, y: 0, ready: false }
    let lastSample = 0
    let rafId = 0
    let running = false

    const spawnSpark = (x, y, now, opts = {}) => {
      if (sparks.length >= MAX_SPARKS) sparks.shift()
      sparks.push({
        x,
        y,
        t: now,
        life: opts.life ?? 640 + Math.random() * 480,
        r: opts.r ?? 0.7 + Math.random() * 1.5,
        alpha: opts.alpha ?? 0.35 + Math.random() * 0.4,
        rise: opts.rise ?? 0.08 + Math.random() * 0.22,
        phase: opts.phase ?? Math.random() * Math.PI * 2,
        coral: opts.coral ?? Math.random() < 0.3,
        vx: opts.vx ?? 0,
        vy: opts.vy ?? 0,
      })
    }

    const drawHalo = () => {
      const glow = ctx.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, 22)
      glow.addColorStop(0, 'rgba(244, 248, 255, 0.9)')
      glow.addColorStop(0.16, `rgba(${CYAN}, 0.72)`)
      glow.addColorStop(0.42, `rgba(${TEAL}, 0.18)`)
      glow.addColorStop(1, `rgba(${CYAN}, 0)`)
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(halo.x, halo.y, 22, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = `rgba(${CYAN}, 0.55)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(halo.x, halo.y, 7.5, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = `rgba(${CORAL}, 0.95)`
      ctx.beginPath()
      ctx.arc(halo.x, halo.y, 1.7, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = (now) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, viewW, viewH)

      if (reduced) {
        running = false
        return
      }

      while (points.length > 0 && now - points[0].t > TRAIL_MS) points.shift()

      if (points.length >= 2) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let pass = 0; pass < 2; pass++) {
          for (let i = 1; i < points.length; i++) {
            const p0 = points[i - 1]
            const p1 = points[i]
            const t = i / (points.length - 1)
            const fade = Math.max(0, 1 - (now - p1.t) / TRAIL_MS)
            const head = t > 0.82
            if (pass === 0) {
              ctx.strokeStyle = `rgba(${TEAL}, ${fade * (0.05 + t * 0.16)})`
              ctx.lineWidth = fade * (3 + t * 10)
            } else {
              const color = head ? CORAL : CYAN
              ctx.strokeStyle = `rgba(${color}, ${fade * (head ? 0.28 + t * 0.35 : 0.12 + t * 0.5)})`
              ctx.lineWidth = fade * (1.1 + t * 4.2)
            }
            ctx.beginPath()
            ctx.moveTo(p0.x, p0.y)
            ctx.lineTo(p1.x, p1.y)
            ctx.stroke()
          }
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]
        const age = (now - spark.t) / spark.life
        if (age >= 1) {
          sparks.splice(i, 1)
          continue
        }
        spark.x += spark.vx + Math.sin(now / 220 + spark.phase) * 0.12
        spark.y += spark.vy - spark.rise
        const alpha = (1 - age) * spark.alpha
        const radius = spark.r * (1 - age * 0.35)
        ctx.fillStyle = `rgba(${spark.coral ? CORAL : CYAN}, ${alpha})`
        ctx.beginPath()
        ctx.arc(spark.x, spark.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]
        const age = (now - ripple.t) / ripple.life
        if (age >= 1) {
          ripples.splice(i, 1)
          continue
        }
        const rings = [
          { color: CYAN, scale: 1, width: 1.35 },
          { color: TEAL, scale: 0.66, width: 1.1 },
          { color: CORAL, scale: 0.34, width: 1.5 },
        ]
        rings.forEach((ring, index) => {
          const delay = index * 0.07
          const local = Math.min(1, Math.max(0, (age - delay) / (1 - delay)))
          if (local <= 0) return
          const radius = 8 + local * (86 * ring.scale + 28)
          const alpha = (1 - local) * (0.62 - index * 0.1)
          ctx.strokeStyle = `rgba(${ring.color}, ${alpha})`
          ctx.lineWidth = ring.width
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2)
          ctx.stroke()
        })

        const bloom = 8 + age * 26
        const gradient = ctx.createRadialGradient(ripple.x, ripple.y, 0, ripple.x, ripple.y, bloom)
        gradient.addColorStop(0, `rgba(${CYAN}, ${(1 - age) * 0.32})`)
        gradient.addColorStop(0.5, `rgba(${CORAL}, ${(1 - age) * 0.12})`)
        gradient.addColorStop(1, `rgba(${CYAN}, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, bloom, 0, Math.PI * 2)
        ctx.fill()
      }

      if (pointer.active) {
        if (!halo.ready) {
          halo.x = pointer.x
          halo.y = pointer.y
          halo.ready = true
        } else {
          halo.x += (pointer.x - halo.x) * 0.28
          halo.y += (pointer.y - halo.y) * 0.28
        }
        drawHalo()
      }

      const settled =
        points.length === 0 &&
        sparks.length === 0 &&
        ripples.length === 0 &&
        (!pointer.active || (Math.abs(pointer.x - halo.x) < 0.35 && Math.abs(pointer.y - halo.y) < 0.35))

      if (settled) {
        running = false
        return
      }

      rafId = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      rafId = requestAnimationFrame(draw)
    }

    const onMove = (event) => {
      if (reduced || event.pointerType === 'touch') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
      const now = performance.now()
      if (now - lastSample >= 16) {
        lastSample = now
        points.push({ x: event.clientX, y: event.clientY, t: now })
        if (points.length > MAX_POINTS) points.shift()
        if (Math.random() < 0.42) {
          spawnSpark(
            event.clientX + (Math.random() - 0.5) * 10,
            event.clientY + (Math.random() - 0.5) * 10,
            now,
          )
        }
      }
      start()
    }

    const onDown = (event) => {
      if (reduced || event.pointerType === 'touch') return
      const now = performance.now()
      if (ripples.length >= MAX_RIPPLES) ripples.shift()
      ripples.push({ x: event.clientX, y: event.clientY, t: now, life: 980 })
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.2
        const speed = 0.55 + Math.random() * 0.7
        spawnSpark(event.clientX, event.clientY, now, {
          life: 720,
          r: 1.1 + Math.random() * 0.8,
          alpha: 0.75,
          rise: 0.15,
          phase: angle,
          coral: i % 2 === 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        })
      }
      start()
    }

    const onLeave = () => {
      pointer.active = false
      start()
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => {
      reduced = motionQuery.matches
      if (!reduced) return
      points.length = 0
      sparks.length = 0
      ripples.length = 0
      pointer.active = false
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, viewW, viewH)
      running = false
      if (rafId) cancelAnimationFrame(rafId)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('blur', onLeave)
    document.documentElement.addEventListener('pointerleave', onLeave)
    motionQuery.addEventListener?.('change', onMotion)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('blur', onLeave)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      motionQuery.removeEventListener?.('change', onMotion)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  if (typeof document === 'undefined') return null
  if (!prefersFinePointer() || prefersReducedMotion()) return null

  return createPortal(
    <canvas ref={canvasRef} className="pointer-atmosphere" aria-hidden="true" />,
    document.body,
  )
}
