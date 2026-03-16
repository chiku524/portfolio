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
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
        <filter id="ocean-bg-wave-blur-mid" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <filter id="ocean-bg-wave-blur-near" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
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

/* ----- Kelp: asymmetric fronds, natural taper, slight bulb at top ----- */
function KelpFrondSVG({ id }) {
  return (
    <svg
      className="ocean-bg__kelp-svg"
      viewBox="0 0 36 300"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={`ocean-bg-kelp-${id}`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop stopColor="rgba(18, 85, 72, 0.28)" />
          <stop offset="0.25" stopColor="rgba(20, 115, 95, 0.22)" />
          <stop offset="0.6" stopColor="rgba(24, 130, 108, 0.12)" />
          <stop offset="1" stopColor="rgba(30, 145, 120, 0.04)" />
        </linearGradient>
      </defs>
      {/* Asymmetric frond: uneven width, natural curve */}
      <path
        className="ocean-bg__kelp-frond"
        d="M18 0 Q20 35 16 72 Q22 110 18 148 Q14 188 20 225 Q16 262 18 300 L22 300 Q20 262 24 225 Q28 188 22 148 Q26 110 22 72 Q24 35 18 0 Z"
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

/* ----- Sea turtle: realistic proportions, olive/brown-green, accurate anatomy ----- */
function SeaTurtleSVG({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-turtle-shell" x1="0.4" y1="0.15" x2="0.6" y2="0.9">
          <stop stopColor="rgba(77, 124, 82, 0.82)" />
          <stop offset="0.35" stopColor="rgba(56, 94, 60, 0.78)" />
          <stop offset="0.65" stopColor="rgba(45, 80, 55, 0.72)" />
          <stop offset="1" stopColor="rgba(30, 58, 42, 0.55)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-scute" x1="0.45" y1="0.35" x2="0.55" y2="0.75">
          <stop stopColor="rgba(120, 140, 100, 0.35)" />
          <stop offset="1" stopColor="rgba(56, 94, 60, 0.2)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-head" x1="0.25" y1="0.4" x2="0.75" y2="0.85">
          <stop stopColor="rgba(140, 160, 130, 0.75)" />
          <stop offset="0.5" stopColor="rgba(100, 120, 95, 0.65)" />
          <stop offset="1" stopColor="rgba(60, 85, 65, 0.5)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-flipper" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop stopColor="rgba(77, 124, 82, 0.7)" />
          <stop offset="1" stopColor="rgba(45, 80, 55, 0.45)" />
        </linearGradient>
      </defs>
      {/* Back flippers: proportional, webbed */}
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--back-left"
        d="M 48 88 Q 28 92 22 108 Q 26 98 42 92 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--back-right"
        d="M 152 88 Q 172 92 178 108 Q 174 98 158 92 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      {/* Carapace: oval, slightly flatter than before; 5 central scutes + marginals */}
      <ellipse cx="100" cy="58" rx="52" ry="34" fill="url(#ocean-bg-turtle-shell)" className="ocean-bg__turtle-shell" />
      <path d="M 72 42 L 100 36 L 128 42 L 124 68 L 100 74 L 76 68 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.85" className="ocean-bg__turtle-scute" />
      <path d="M 66 58 L 88 52 L 100 62 L 88 78 L 66 72 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.7" className="ocean-bg__turtle-scute" />
      <path d="M 134 58 L 112 52 L 100 62 L 112 78 L 134 72 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.7" className="ocean-bg__turtle-scute" />
      <path d="M 78 52 L 100 48 L 122 52 L 118 62 L 100 66 L 82 62 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.6" className="ocean-bg__turtle-scute" />
      {/* Head: smaller, ~1/5 shell width */}
      <ellipse cx="162" cy="54" rx="14" ry="11" fill="url(#ocean-bg-turtle-head)" className="ocean-bg__turtle-head" />
      <circle cx="165" cy="52" r="2.5" fill="rgba(20, 28, 22, 0.75)" className="ocean-bg__turtle-eye" />
      {/* Front flippers: proportional placement */}
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--front-left"
        d="M 54 42 Q 38 46 34 58 Q 40 50 52 46 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--front-right"
        d="M 146 42 Q 162 46 166 58 Q 160 50 148 46 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
    </svg>
  )
}

/* ----- Jellyfish: translucent bell, irregular form, varied tentacles ----- */
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
        <linearGradient id="ocean-bg-jelly-body" x1="0.4" y1="0.15" x2="0.6" y2="0.9">
          <stop stopColor="rgba(248,252,252,0.45)" />
          <stop offset="0.5" stopColor="rgba(200,220,230,0.35)" />
          <stop offset="1" stopColor="rgba(120,160,180,0.15)" />
        </linearGradient>
        <linearGradient id="ocean-bg-jelly-tentacle" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop stopColor="rgba(180,200,210,0.38)" />
          <stop offset="0.6" stopColor="rgba(100,140,160,0.2)" />
          <stop offset="1" stopColor="rgba(60,100,120,0)" />
        </linearGradient>
      </defs>
      {/* Bell: slightly irregular oval (not perfect ellipse) */}
      <path
        d="M 40 12 C 58 14 68 28 68 42 C 66 52 58 58 40 58 C 22 58 14 52 12 42 C 12 28 22 14 40 12 Z"
        fill="url(#ocean-bg-jelly-body)"
        className="ocean-bg-jelly-body"
      />
      {/* Tentacles: varying length and curve */}
      <path d="M 22 56 Q 18 85 20 138" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2" fill="none" className="ocean-bg-tentacle" />
      <path d="M 40 58 Q 38 92 40 138" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="1.8" fill="none" className="ocean-bg-tentacle ocean-bg-tentacle--2" />
      <path d="M 58 56 Q 62 88 60 132" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2" fill="none" className="ocean-bg-tentacle ocean-bg-tentacle--3" />
    </svg>
  )
}

/* ----- Manta: proportional disc, wingspan, natural grey tones ----- */
function MantaSVG({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-manta-fill" x1="0.2" y1="0.25" x2="0.8" y2="0.85">
          <stop stopColor="rgba(100,115,130,0.55)" />
          <stop offset="0.4" stopColor="rgba(70,90,105,0.48)" />
          <stop offset="0.7" stopColor="rgba(55,75,90,0.38)" />
          <stop offset="1" stopColor="rgba(40,55,70,0.25)" />
        </linearGradient>
      </defs>
      {/* Disc: wide wingspan, pointed wing tips */}
      <path
        d="M 90 48 Q 25 22 5 48 Q 28 58 90 52 Q 152 58 175 48 Q 155 22 90 48 Z"
        fill="url(#ocean-bg-manta-fill)"
        className="ocean-bg-manta-body"
      />
      <path d="M 82 52 L 88 82 L 94 52" stroke="rgba(70,90,105,0.4)" strokeWidth="1.8" fill="none" className="ocean-bg-manta-tail" />
    </svg>
  )
}

/* ----- Seahorse: proportional body, crown, snout, muted teal/brown ----- */
function SeahorseSVG({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ocean-bg-seahorse-fill" x1="0.35" y1="0" x2="0.65" y2="1">
          <stop stopColor="rgba(55,115,105,0.5)" />
          <stop offset="0.45" stopColor="rgba(45,95,88,0.42)" />
          <stop offset="1" stopColor="rgba(35,75,70,0.28)" />
        </linearGradient>
      </defs>
      {/* Body: segmented curve, crown at top, snout */}
      <path
        d="M 24 6 Q 32 10 30 22 Q 28 32 24 38 Q 14 48 16 62 Q 18 74 24 84 L 26 82 Q 22 70 20 58 Q 18 46 24 40 Q 28 34 30 24 Q 32 14 24 10 Q 22 8 24 6 Z"
        fill="url(#ocean-bg-seahorse-fill)"
        className="ocean-bg-seahorse-body"
      />
      <circle cx="27" cy="20" r="3" fill="rgba(220,235,225,0.5)" />
      <path d="M 24 10 Q 20 16 22 22" stroke="rgba(55,115,105,0.45)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
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
