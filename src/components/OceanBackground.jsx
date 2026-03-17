/**
 * Revamped ocean-themed animated background: gradient mesh, floating bubbles, surface glow.
 * Optional subtle creatures (turtle, jellyfish). Memoized for performance.
 */
import { memo } from 'react'
import './OceanBackground.css'

/* ----- Gradient mesh: soft moving orbs for depth and atmosphere ----- */
function GradientMesh() {
  return (
    <div className="ocean-bg__mesh" aria-hidden>
      <div className="ocean-bg__mesh-orb ocean-bg__mesh-orb--1" />
      <div className="ocean-bg__mesh-orb ocean-bg__mesh-orb--2" />
      <div className="ocean-bg__mesh-orb ocean-bg__mesh-orb--3" />
      <div className="ocean-bg__mesh-orb ocean-bg__mesh-orb--4" />
      <div className="ocean-bg__mesh-orb ocean-bg__mesh-orb--5" />
    </div>
  )
}

/* ----- Floating bubbles: slow rise with slight horizontal drift ----- */
function Bubbles() {
  return (
    <div className="ocean-bg__bubbles" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="ocean-bg__bubble"
          style={{
            '--bubble-x': `${8 + (i * 5.5) % 84}%`,
            '--bubble-delay': `${(i * 1.8) % 12}s`,
            '--bubble-duration': `${18 + (i % 5)}s`,
            '--bubble-size': `${4 + (i % 4)}px`,
          }}
        />
      ))}
    </div>
  )
}

/* ----- Surface glow: soft gradient band along bottom (no wave shapes) ----- */
function SurfaceGlow() {
  return (
    <div className="ocean-bg__surface" aria-hidden>
      <div className="ocean-bg__surface-glow" />
    </div>
  )
}

/* ----- Optional: subtle creature accents (turtle + one jelly) ----- */
function SeaTurtleSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="ob-turtle-shell" x1="0.4" y1="0.15" x2="0.6" y2="0.9">
          <stop stopColor="rgba(90, 140, 95, 0.5)" />
          <stop offset="1" stopColor="rgba(45, 85, 52, 0.35)" />
        </linearGradient>
        <linearGradient id="ob-turtle-head" x1="0.2" y1="0.3" x2="0.8" y2="0.9">
          <stop stopColor="rgba(150, 175, 135, 0.5)" />
          <stop offset="1" stopColor="rgba(70, 95, 68, 0.3)" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="56" rx="54" ry="36" fill="url(#ob-turtle-shell)" />
      <ellipse cx="164" cy="52" rx="16" ry="12" fill="url(#ob-turtle-head)" />
      <circle cx="168" cy="50" r="3" fill="rgba(25, 35, 28, 0.6)" />
      <path d="M 50 86 Q 24 90 18 104 Q 28 96 48 90 Z" fill="rgba(90, 135, 88, 0.4)" />
      <path d="M 150 86 Q 176 90 182 104 Q 172 96 152 90 Z" fill="rgba(90, 135, 88, 0.4)" />
      <path d="M 52 40 Q 32 46 28 58 Q 36 50 50 44 Z" fill="rgba(90, 135, 88, 0.4)" />
      <path d="M 148 40 Q 168 46 172 58 Q 164 50 150 44 Z" fill="rgba(90, 135, 88, 0.4)" />
    </svg>
  )
}

function JellyfishSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="ob-jelly-body" x1="0.4" y1="0.1" x2="0.6" y2="0.95">
          <stop stopColor="rgba(255,252,255,0.35)" />
          <stop offset="0.7" stopColor="rgba(160,195,215,0.2)" />
          <stop offset="1" stopColor="rgba(100,150,180,0.06)" />
        </linearGradient>
      </defs>
      <path d="M 40 8 Q 62 10 66 32 Q 68 48 40 52 Q 12 48 14 32 Q 18 10 40 8 Z" fill="url(#ob-jelly-body)" />
      <path d="M 20 50 Q 12 78 16 136" stroke="rgba(200,220,235,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 40 52 Q 36 88 40 136" stroke="rgba(200,220,235,0.22)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 60 50 Q 68 80 64 132" stroke="rgba(200,220,235,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function OceanBackground({ light = false }) {
  return (
    <div className="ocean-bg" aria-hidden="true" data-light={light ? 'true' : undefined}>
      <GradientMesh />
      <Bubbles />
      <SurfaceGlow />
      {!light && (
        <>
          <div className="ocean-bg__creature ocean-bg__turtle">
            <SeaTurtleSVG className="ocean-bg__svg ocean-bg__svg--turtle" />
          </div>
          <div className="ocean-bg__creature ocean-bg__jellyfish ocean-bg__jellyfish--1">
            <JellyfishSVG className="ocean-bg__svg ocean-bg__svg--jelly" />
          </div>
        </>
      )}
    </div>
  )
}

export default memo(OceanBackground)
