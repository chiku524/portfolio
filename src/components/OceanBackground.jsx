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

/* ----- Coral reef floor: layered silhouettes anchored to the seabed ----- */
function BrainCoralSVG({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id={`rc-brain-${style?.['--coral-id'] || 0}`} cx="0.4" cy="0.25" r="0.85">
          <stop stopColor="rgba(170, 168, 155, 0.45)" />
          <stop offset="1" stopColor="rgba(90, 88, 80, 0.35)" />
        </radialGradient>
      </defs>
      <path
        d="M4 80 Q0 42 28 30 Q42 6 70 14 Q100 4 116 32 Q122 56 98 70 Q68 86 40 78 Q16 84 4 80 Z"
        fill={`url(#rc-brain-${style?.['--coral-id'] || 0})`}
      />
      <path d="M16 62 Q30 46 44 58 Q58 42 74 56 Q90 44 104 56" stroke="rgba(70, 68, 60, 0.4)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M22 48 Q34 34 48 44 Q62 30 78 42 Q92 32 102 42" stroke="rgba(70, 68, 60, 0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 68 Q44 58 56 68 Q70 56 86 66" stroke="rgba(70, 68, 60, 0.3)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function StaghornCoralSVG({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`rc-stag-${style?.['--coral-id'] || 0}`} x1="0.3" y1="1" x2="0.6" y2="0">
          <stop stopColor="rgba(184, 168, 144, 0.55)" />
          <stop offset="1" stopColor="rgba(200, 190, 170, 0.3)" />
        </linearGradient>
      </defs>
      <g className="ocean-bg__coral-sway">
        <path d="M50 140 C 46 112 34 98 22 82 C 12 70 8 54 14 38" stroke={`url(#rc-stag-${style?.['--coral-id'] || 0})`} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M14 38 C 10 30 12 20 20 12" stroke={`url(#rc-stag-${style?.['--coral-id'] || 0})`} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M22 82 C 16 76 8 74 2 78" stroke={`url(#rc-stag-${style?.['--coral-id'] || 0})`} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M50 140 C 50 106 50 84 50 58 C 50 42 54 30 62 20" stroke={`url(#rc-stag-${style?.['--coral-id'] || 0})`} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M62 20 C 66 12 74 8 82 10" stroke={`url(#rc-stag-${style?.['--coral-id'] || 0})`} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M50 140 C 54 110 66 96 78 80 C 88 68 92 52 86 36" stroke={`url(#rc-stag-${style?.['--coral-id'] || 0})`} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M86 36 C 90 28 98 24 100 16" stroke={`url(#rc-stag-${style?.['--coral-id'] || 0})`} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function FanCoralSVG({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`rc-fan-${style?.['--coral-id'] || 0}`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop stopColor="rgba(150, 145, 135, 0.5)" />
          <stop offset="1" stopColor="rgba(160, 155, 145, 0.18)" />
        </linearGradient>
      </defs>
      <g className="ocean-bg__coral-fan">
        <path
          d="M50 90 C 22 84 4 56 10 18 C 26 38 40 54 50 90 Z"
          fill={`url(#rc-fan-${style?.['--coral-id'] || 0})`}
        />
        <path
          d="M50 90 C 78 84 96 56 90 18 C 74 38 60 54 50 90 Z"
          fill={`url(#rc-fan-${style?.['--coral-id'] || 0})`}
        />
        <path d="M50 90 L18 28" stroke="rgba(220, 215, 200, 0.3)" strokeWidth="1.2" />
        <path d="M50 90 L30 20" stroke="rgba(220, 215, 200, 0.28)" strokeWidth="1.2" />
        <path d="M50 90 L44 16" stroke="rgba(220, 215, 200, 0.26)" strokeWidth="1.2" />
        <path d="M50 90 L56 16" stroke="rgba(220, 215, 200, 0.26)" strokeWidth="1.2" />
        <path d="M50 90 L70 20" stroke="rgba(220, 215, 200, 0.28)" strokeWidth="1.2" />
        <path d="M50 90 L82 28" stroke="rgba(220, 215, 200, 0.3)" strokeWidth="1.2" />
      </g>
    </svg>
  )
}

function AnemoneSVG({ className, style }) {
  const tentacles = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg className={className} style={style} viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id={`rc-anem-${style?.['--coral-id'] || 0}`} cx="0.5" cy="1" r="0.9">
          <stop stopColor="rgba(160, 155, 145, 0.5)" />
          <stop offset="1" stopColor="rgba(130, 125, 118, 0.25)" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="66" rx="32" ry="6" fill={`url(#rc-anem-${style?.['--coral-id'] || 0})`} />
      {tentacles.map((i) => {
        const x = 10 + i * 10
        const sway = (i % 3) - 1
        return (
          <path
            key={i}
            className="ocean-bg__anemone-tentacle"
            style={{ '--tentacle-delay': `${i * 0.28}s`, '--tentacle-sway': `${sway}deg` }}
            d={`M${x} 64 Q ${x - 4} 40 ${x + 2} 20 Q ${x + 5} 10 ${x} 2`}
            stroke="rgba(210, 205, 190, 0.4)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

function SeaGrassSVG({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path className="ocean-bg__grass-blade ocean-bg__grass-blade--1" d="M10 100 Q4 62 16 24 Q19 12 22 2" stroke="rgba(160, 156, 140, 0.4)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path className="ocean-bg__grass-blade ocean-bg__grass-blade--2" d="M30 100 Q36 58 24 20 Q21 8 25 -4" stroke="rgba(122, 117, 104, 0.36)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path className="ocean-bg__grass-blade ocean-bg__grass-blade--3" d="M46 100 Q52 64 40 28 Q36 16 40 4" stroke="rgba(160, 156, 140, 0.32)" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function ReefBed() {
  return (
    <div className="ocean-bg__reef" aria-hidden>
      <div className="ocean-bg__reef-floor" />
      <div className="ocean-bg__reef-back">
        <BrainCoralSVG className="ocean-bg__coral ocean-bg__coral--brain-back" style={{ left: '4%', '--coral-id': 'bb1' }} />
        <StaghornCoralSVG className="ocean-bg__coral ocean-bg__coral--staghorn-back" style={{ left: '34%', '--coral-id': 'sb1' }} />
        <FanCoralSVG className="ocean-bg__coral ocean-bg__coral--fan-back" style={{ left: '62%', '--coral-id': 'fb1' }} />
        <BrainCoralSVG className="ocean-bg__coral ocean-bg__coral--brain-back2" style={{ left: '86%', '--coral-id': 'bb2' }} />
      </div>
      <div className="ocean-bg__reef-front">
        <SeaGrassSVG className="ocean-bg__coral ocean-bg__coral--grass ocean-bg__coral--grass-1" style={{ left: '0%' }} />
        <StaghornCoralSVG className="ocean-bg__coral ocean-bg__coral--staghorn-1" style={{ left: '10%', '--coral-id': 's1' }} />
        <AnemoneSVG className="ocean-bg__coral ocean-bg__coral--anemone-1" style={{ left: '24%', '--coral-id': 'a1' }} />
        <FanCoralSVG className="ocean-bg__coral ocean-bg__coral--fan-1" style={{ left: '40%', '--coral-id': 'f1' }} />
        <BrainCoralSVG className="ocean-bg__coral ocean-bg__coral--brain-1" style={{ left: '54%', '--coral-id': 'b1' }} />
        <SeaGrassSVG className="ocean-bg__coral ocean-bg__coral--grass ocean-bg__coral--grass-2" style={{ left: '64%' }} />
        <StaghornCoralSVG className="ocean-bg__coral ocean-bg__coral--staghorn-2" style={{ left: '76%', '--coral-id': 's2' }} />
        <AnemoneSVG className="ocean-bg__coral ocean-bg__coral--anemone-2" style={{ left: '90%', '--coral-id': 'a2' }} />
      </div>
    </div>
  )
}

/* ----- Surface light shafts: god-rays filtering through the water column ----- */
function LightShafts() {
  return (
    <div className="ocean-bg__shafts" aria-hidden>
      <span className="ocean-bg__shaft ocean-bg__shaft--1" />
      <span className="ocean-bg__shaft ocean-bg__shaft--2" />
      <span className="ocean-bg__shaft ocean-bg__shaft--3" />
      <span className="ocean-bg__shaft ocean-bg__shaft--4" />
    </div>
  )
}

function DriftFishSVG({ id, className }) {
  return (
    <svg className={className} viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`ob-drift-${id}`} x1="0.1" y1="0.2" x2="0.9" y2="0.85">
          <stop stopColor="rgba(220, 216, 200, 0.55)" />
          <stop offset="1" stopColor="rgba(110, 112, 120, 0.22)" />
        </linearGradient>
      </defs>
      <ellipse cx="46" cy="16" rx="24" ry="11" fill={`url(#ob-drift-${id})`} />
      <path d="M22 16 L2 5 L9 16 L2 27 Z" fill={`url(#ob-drift-${id})`} />
      <circle cx="60" cy="14" r="2" fill="rgba(22, 24, 30, 0.55)" />
    </svg>
  )
}

function DriftSchool() {
  return (
    <div className="ocean-bg__school" aria-hidden>
      <DriftFishSVG id="a" className="ocean-bg__drift-fish ocean-bg__drift-fish--1" />
      <DriftFishSVG id="b" className="ocean-bg__drift-fish ocean-bg__drift-fish--2" />
      <DriftFishSVG id="c" className="ocean-bg__drift-fish ocean-bg__drift-fish--3" />
    </div>
  )
}

/* ----- Optional: subtle creature accents (turtle + one jelly) ----- */
function SeaTurtleSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="ob-turtle-shell" x1="0.4" y1="0.15" x2="0.6" y2="0.9">
          <stop stopColor="rgba(140, 138, 128, 0.45)" />
          <stop offset="1" stopColor="rgba(70, 68, 62, 0.35)" />
        </linearGradient>
        <linearGradient id="ob-turtle-head" x1="0.2" y1="0.3" x2="0.8" y2="0.9">
          <stop stopColor="rgba(160, 158, 148, 0.45)" />
          <stop offset="1" stopColor="rgba(90, 88, 82, 0.3)" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="56" rx="54" ry="36" fill="url(#ob-turtle-shell)" />
      <ellipse cx="164" cy="52" rx="16" ry="12" fill="url(#ob-turtle-head)" />
      <circle cx="168" cy="50" r="3" fill="rgba(20, 20, 22, 0.65)" />
      <path d="M 50 86 Q 24 90 18 104 Q 28 96 48 90 Z" fill="rgba(110, 108, 100, 0.4)" />
      <path d="M 150 86 Q 176 90 182 104 Q 172 96 152 90 Z" fill="rgba(110, 108, 100, 0.4)" />
      <path d="M 52 40 Q 32 46 28 58 Q 36 50 50 44 Z" fill="rgba(110, 108, 100, 0.4)" />
      <path d="M 148 40 Q 168 46 172 58 Q 164 50 150 44 Z" fill="rgba(110, 108, 100, 0.4)" />
    </svg>
  )
}

function JellyfishSVG({ className, jellyId = '1' }) {
  return (
    <svg className={className} viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`ob-jelly-body-${jellyId}`} x1="0.4" y1="0.1" x2="0.6" y2="0.95">
          <stop stopColor="rgba(255,252,255,0.35)" />
          <stop offset="0.7" stopColor="rgba(190,186,174,0.2)" />
          <stop offset="1" stopColor="rgba(120,118,110,0.06)" />
        </linearGradient>
      </defs>
      <path className="ocean-bg__jelly-bell" d="M 40 8 Q 62 10 66 32 Q 68 48 40 52 Q 12 48 14 32 Q 18 10 40 8 Z" fill={`url(#ob-jelly-body-${jellyId})`} />
      <path className="ocean-bg__jelly-tentacle" d="M 20 50 Q 12 78 16 136" stroke="rgba(210,206,194,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="ocean-bg__jelly-tentacle ocean-bg__jelly-tentacle--2" d="M 40 52 Q 36 88 40 136" stroke="rgba(210,206,194,0.22)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path className="ocean-bg__jelly-tentacle ocean-bg__jelly-tentacle--3" d="M 60 50 Q 68 80 64 132" stroke="rgba(210,206,194,0.25)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function OceanBackground({ light = false }) {
  return (
    <div className="ocean-bg" aria-hidden="true" data-light={light ? 'true' : undefined}>
      <GradientMesh />
      <LightShafts />
      <SurfaceGlow />
      <ReefBed />
      <Bubbles />
      {!light && (
        <>
          <DriftSchool />
          <div className="ocean-bg__creature ocean-bg__turtle">
            <SeaTurtleSVG className="ocean-bg__svg ocean-bg__svg--turtle" />
          </div>
          <div className="ocean-bg__creature ocean-bg__jellyfish ocean-bg__jellyfish--1">
            <JellyfishSVG className="ocean-bg__svg ocean-bg__svg--jelly" jellyId="1" />
          </div>
          <div className="ocean-bg__creature ocean-bg__jellyfish ocean-bg__jellyfish--2">
            <JellyfishSVG className="ocean-bg__svg ocean-bg__svg--jelly" jellyId="2" />
          </div>
        </>
      )}
    </div>
  )
}

export default memo(OceanBackground)
