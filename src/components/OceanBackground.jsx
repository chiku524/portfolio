/**
 * Ocean-themed animated background: waves, kelp, sea creatures.
 * All SVG-based for detail and realism; animations are subtle and non-distracting.
 */
import './OceanBackground.css'

/* ----- Waves: layered rolling waves along the bottom ----- */
function WaveClusterSVG() {
  return (
    <svg
      className="ocean-bg__waves-svg"
      viewBox="0 0 1200 220"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-wave-far" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="rgba(59, 130, 246, 0.22)" />
          <stop offset="0.5" stopColor="rgba(56, 189, 248, 0.12)" />
          <stop offset="1" stopColor="rgba(12, 74, 110, 0)" />
        </linearGradient>
        <linearGradient id="ocean-bg-wave-mid" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="rgba(56, 189, 248, 0.32)" />
          <stop offset="0.6" stopColor="rgba(34, 211, 238, 0.15)" />
          <stop offset="1" stopColor="rgba(12, 74, 110, 0)" />
        </linearGradient>
        <linearGradient id="ocean-bg-wave-near" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="rgba(56, 189, 248, 0.4)" />
          <stop offset="0.5" stopColor="rgba(34, 211, 238, 0.2)" />
          <stop offset="1" stopColor="rgba(8, 47, 73, 0)" />
        </linearGradient>
        <filter id="ocean-bg-wave-blur-far" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
        <filter id="ocean-bg-wave-blur-mid" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>
        <filter id="ocean-bg-wave-blur-near" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>
      {/* Far layer */}
      <path
        className="ocean-bg__wave ocean-bg__wave--far"
        d="M-200 120 Q100 80 400 120 T1000 120 T1600 120 V220 H-200 Z"
        fill="url(#ocean-bg-wave-far)"
        filter="url(#ocean-bg-wave-blur-far)"
      />
      {/* Mid layer */}
      <path
        className="ocean-bg__wave ocean-bg__wave--mid"
        d="M-200 150 Q150 100 500 150 T1100 150 T1700 150 V220 H-200 Z"
        fill="url(#ocean-bg-wave-mid)"
        filter="url(#ocean-bg-wave-blur-mid)"
      />
      {/* Near layer */}
      <path
        className="ocean-bg__wave ocean-bg__wave--near"
        d="M-200 175 Q200 125 600 175 T1200 175 T1800 175 V220 H-200 Z"
        fill="url(#ocean-bg-wave-near)"
        filter="url(#ocean-bg-wave-blur-near)"
      />
    </svg>
  )
}

/* ----- Kelp: swaying fronds left and right ----- */
function KelpFrondSVG({ id }) {
  return (
    <svg
      className="ocean-bg__kelp-svg"
      viewBox="0 0 40 320"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={`ocean-bg-kelp-${id}`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop stopColor="rgba(14, 165, 233, 0.2)" />
          <stop offset="0.3" stopColor="rgba(34, 211, 238, 0.18)" />
          <stop offset="0.7" stopColor="rgba(34, 211, 238, 0.08)" />
          <stop offset="1" stopColor="rgba(34, 211, 238, 0.02)" />
        </linearGradient>
      </defs>
      <path
        className="ocean-bg__kelp-frond"
        d="M20 0 Q22 40 18 80 Q24 120 20 160 Q16 200 22 240 Q18 280 20 320 L24 320 Q22 280 26 240 Q30 200 24 160 Q28 120 24 80 Q26 40 20 0 Z"
        fill={`url(#ocean-bg-kelp-${id})`}
      />
    </svg>
  )
}

function KelpGroup({ side }) {
  return (
    <div className={`ocean-bg__kelp ocean-bg__kelp--${side}`} aria-hidden>
      <div className="ocean-bg__kelp-stem ocean-bg__kelp-stem--1">
        <KelpFrondSVG id="1" />
      </div>
      <div className="ocean-bg__kelp-stem ocean-bg__kelp-stem--2">
        <KelpFrondSVG id="2" />
      </div>
      <div className="ocean-bg__kelp-stem ocean-bg__kelp-stem--3">
        <KelpFrondSVG id="3" />
      </div>
    </div>
  )
}

/* ----- Sea turtle: detailed shell, head, flippers ----- */
function SeaTurtleSVG({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-turtle-shell" x1="0.35" y1="0.2" x2="0.65" y2="0.95">
          <stop stopColor="rgba(34, 197, 94, 0.85)" />
          <stop offset="0.4" stopColor="rgba(22, 163, 74, 0.75)" />
          <stop offset="0.7" stopColor="rgba(14, 116, 144, 0.6)" />
          <stop offset="1" stopColor="rgba(8, 47, 73, 0.5)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-scute" x1="0.4" y1="0.3" x2="0.6" y2="0.8">
          <stop stopColor="rgba(255, 255, 255, 0.25)" />
          <stop offset="1" stopColor="rgba(34, 197, 94, 0.15)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-head" x1="0.3" y1="0.3" x2="0.7" y2="0.8">
          <stop stopColor="rgba(165, 243, 252, 0.9)" />
          <stop offset="0.5" stopColor="rgba(34, 211, 238, 0.6)" />
          <stop offset="1" stopColor="rgba(14, 116, 144, 0.4)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-flipper" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop stopColor="rgba(20, 184, 166, 0.8)" />
          <stop offset="1" stopColor="rgba(6, 182, 212, 0.4)" />
        </linearGradient>
      </defs>
      {/* Back flippers */}
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--back-left"
        d="M 45 95 Q 25 100 20 115 Q 22 105 38 98 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--back-right"
        d="M 155 95 Q 175 100 180 115 Q 178 105 162 98 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      {/* Shell with scute pattern */}
      <ellipse cx="100" cy="62" rx="58" ry="38" fill="url(#ocean-bg-turtle-shell)" className="ocean-bg__turtle-shell" />
      <path
        d="M 65 45 L 100 38 L 135 45 L 130 75 L 100 82 L 70 75 Z"
        fill="url(#ocean-bg-turtle-scute)"
        opacity="0.9"
        className="ocean-bg__turtle-scute"
      />
      <path
        d="M 58 62 L 85 55 L 100 68 L 85 88 L 58 82 Z"
        fill="url(#ocean-bg-turtle-scute)"
        opacity="0.7"
        className="ocean-bg__turtle-scute"
      />
      <path
        d="M 142 62 L 115 55 L 100 68 L 115 88 L 142 82 Z"
        fill="url(#ocean-bg-turtle-scute)"
        opacity="0.7"
        className="ocean-bg__turtle-scute"
      />
      {/* Head */}
      <ellipse cx="165" cy="58" rx="18" ry="14" fill="url(#ocean-bg-turtle-head)" className="ocean-bg__turtle-head" />
      <circle cx="170" cy="55" r="3" fill="rgba(15, 23, 42, 0.6)" className="ocean-bg__turtle-eye" />
      {/* Front flippers */}
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--front-left"
        d="M 52 45 Q 35 50 30 65 Q 38 55 50 50 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--front-right"
        d="M 148 45 Q 165 50 170 65 Q 162 55 150 50 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
    </svg>
  )
}

/* ----- Jellyfish ----- */
function JellyfishSVG({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-jelly-body" x1="0.4" y1="0.2" x2="0.6" y2="0.9">
          <stop stopColor="rgba(248,250,252,0.7)" />
          <stop offset="0.6" stopColor="rgba(129,140,248,0.5)" />
          <stop offset="1" stopColor="rgba(34,211,238,0.25)" />
        </linearGradient>
        <linearGradient id="ocean-bg-jelly-tentacle" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop stopColor="rgba(236,72,153,0.4)" />
          <stop offset="1" stopColor="rgba(34,211,238,0)" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="35" rx="28" ry="22" fill="url(#ocean-bg-jelly-body)" className="ocean-bg-jelly-body" />
      <path d="M 20 55 Q 18 90 22 140" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2.5" fill="none" className="ocean-bg-tentacle" />
      <path d="M 40 58 Q 40 95 38 140" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2" fill="none" className="ocean-bg-tentacle ocean-bg-tentacle--2" />
      <path d="M 60 55 Q 62 90 58 140" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2.5" fill="none" className="ocean-bg-tentacle ocean-bg-tentacle--3" />
    </svg>
  )
}

function MantaSVG({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-manta-fill" x1="0.2" y1="0.3" x2="0.8" y2="0.8">
          <stop stopColor="rgba(165,180,252,0.5)" />
          <stop offset="0.6" stopColor="rgba(59,130,246,0.3)" />
          <stop offset="1" stopColor="rgba(30,64,175,0.2)" />
        </linearGradient>
      </defs>
      <path
        d="M 80 45 Q 20 20 0 45 Q 30 55 80 50 Q 130 55 160 45 Q 140 20 80 45 Z"
        fill="url(#ocean-bg-manta-fill)"
        className="ocean-bg-manta-body"
      />
      <path d="M 75 50 L 80 78 L 85 50" stroke="rgba(165,180,252,0.35)" strokeWidth="2" fill="none" className="ocean-bg-manta-tail" />
    </svg>
  )
}

function SeahorseSVG({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 50 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-seahorse-fill" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop stopColor="rgba(45,212,191,0.45)" />
          <stop offset="0.5" stopColor="rgba(20,184,166,0.35)" />
          <stop offset="1" stopColor="rgba(14,116,144,0.25)" />
        </linearGradient>
      </defs>
      <path
        d="M 25 8 Q 35 15 32 28 Q 30 35 25 40 Q 15 50 18 65 Q 20 78 25 88 L 28 85 Q 24 72 22 62 Q 20 50 28 42 Q 32 38 34 30 Q 36 18 25 12 Z"
        fill="url(#ocean-bg-seahorse-fill)"
        className="ocean-bg-seahorse-body"
      />
      <circle cx="28" cy="22" r="4" fill="rgba(248,250,252,0.4)" />
      <path d="M 25 12 Q 22 18 24 25" stroke="rgba(45,212,191,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function OceanBackground() {
  return (
    <div className="ocean-bg" aria-hidden="true">
      {/* Wave cluster: full-width at bottom */}
      <div className="ocean-bg__waves">
        <WaveClusterSVG />
      </div>

      {/* Kelp: left and right */}
      <KelpGroup side="left" />
      <KelpGroup side="right" />

      {/* Sea turtle */}
      <div className="ocean-bg__creature ocean-bg__turtle">
        <SeaTurtleSVG className="ocean-bg__svg ocean-bg__svg--turtle" />
      </div>

      {/* Jellyfish */}
      <div className="ocean-bg__creature ocean-bg__jellyfish ocean-bg__jellyfish--1">
        <JellyfishSVG className="ocean-bg__svg ocean-bg__svg--jelly" />
      </div>
      <div className="ocean-bg__creature ocean-bg__jellyfish ocean-bg__jellyfish--2">
        <JellyfishSVG className="ocean-bg__svg ocean-bg__svg--jelly" />
      </div>

      {/* Manta */}
      <div className="ocean-bg__creature ocean-bg__manta">
        <MantaSVG className="ocean-bg__svg ocean-bg__svg--manta" />
      </div>

      {/* Seahorses */}
      <div className="ocean-bg__creature ocean-bg__seahorse ocean-bg__seahorse--1">
        <SeahorseSVG className="ocean-bg__svg ocean-bg__svg--seahorse" />
      </div>
      <div className="ocean-bg__creature ocean-bg__seahorse ocean-bg__seahorse--2">
        <SeahorseSVG className="ocean-bg__svg ocean-bg__svg--seahorse" />
      </div>
    </div>
  )
}
