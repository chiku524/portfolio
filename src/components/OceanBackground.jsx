/**
 * Ocean-themed animated background: waves, kelp, sea creatures.
 * All SVG-based for detail and realism; animations are subtle and non-distracting.
 * Memoized to avoid re-renders when parent (App) state changes.
 */
import { memo } from 'react'
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
          <stop stopColor="rgba(59, 130, 246, 0.2)" />
          <stop offset="0.5" stopColor="rgba(56, 189, 248, 0.1)" />
          <stop offset="1" stopColor="rgba(12, 74, 110, 0)" />
        </linearGradient>
        <linearGradient id="ocean-bg-wave-mid" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="rgba(56, 189, 248, 0.28)" />
          <stop offset="0.6" stopColor="rgba(34, 211, 238, 0.12)" />
          <stop offset="1" stopColor="rgba(12, 74, 110, 0)" />
        </linearGradient>
        <linearGradient id="ocean-bg-wave-near" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="rgba(56, 189, 248, 0.36)" />
          <stop offset="0.5" stopColor="rgba(34, 211, 238, 0.18)" />
          <stop offset="1" stopColor="rgba(8, 47, 73, 0)" />
        </linearGradient>
      </defs>
      {/* Far layer - no SVG filter for performance */}
      <path
        className="ocean-bg__wave ocean-bg__wave--far"
        d="M-200 120 Q100 80 400 120 T1000 120 T1600 120 V220 H-200 Z"
        fill="url(#ocean-bg-wave-far)"
      />
      {/* Mid layer */}
      <path
        className="ocean-bg__wave ocean-bg__wave--mid"
        d="M-200 150 Q150 100 500 150 T1100 150 T1700 150 V220 H-200 Z"
        fill="url(#ocean-bg-wave-mid)"
      />
      {/* Near layer */}
      <path
        className="ocean-bg__wave ocean-bg__wave--near"
        d="M-200 175 Q200 125 600 175 T1200 175 T1800 175 V220 H-200 Z"
        fill="url(#ocean-bg-wave-near)"
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

/* ----- Sea turtle: cartoon style — rounded shell, scutes, friendly face, recognizable anatomy ----- */
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
          <stop stopColor="rgba(90, 140, 95, 0.88)" />
          <stop offset="0.4" stopColor="rgba(65, 110, 70, 0.82)" />
          <stop offset="1" stopColor="rgba(45, 85, 52, 0.65)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-scute" x1="0.45" y1="0.35" x2="0.55" y2="0.75">
          <stop stopColor="rgba(130, 155, 110, 0.5)" />
          <stop offset="1" stopColor="rgba(70, 100, 65, 0.28)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-head" x1="0.2" y1="0.3" x2="0.8" y2="0.9">
          <stop stopColor="rgba(150, 175, 135, 0.85)" />
          <stop offset="0.6" stopColor="rgba(100, 130, 95, 0.7)" />
          <stop offset="1" stopColor="rgba(70, 95, 68, 0.55)" />
        </linearGradient>
        <linearGradient id="ocean-bg-turtle-flipper" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop stopColor="rgba(90, 135, 88, 0.78)" />
          <stop offset="1" stopColor="rgba(55, 95, 58, 0.5)" />
        </linearGradient>
      </defs>
      {/* Back flippers: rounded cartoon paddles */}
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--back-left"
        d="M 50 86 Q 24 90 18 104 Q 28 96 48 90 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--back-right"
        d="M 150 86 Q 176 90 182 104 Q 172 96 152 90 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      {/* Carapace: rounded oval with cartoon scutes (hex-like patches) */}
      <ellipse cx="100" cy="56" rx="54" ry="36" fill="url(#ocean-bg-turtle-shell)" className="ocean-bg__turtle-shell" />
      <path d="M 74 38 Q 100 32 126 38 Q 122 64 100 70 Q 78 64 74 38 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.9" className="ocean-bg__turtle-scute" />
      <path d="M 68 56 Q 86 50 100 60 Q 86 76 68 70 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.75" className="ocean-bg__turtle-scute" />
      <path d="M 132 56 Q 114 50 100 60 Q 114 76 132 70 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.75" className="ocean-bg__turtle-scute" />
      <path d="M 80 50 Q 100 46 120 50 Q 116 62 100 66 Q 84 62 80 50 Z" fill="url(#ocean-bg-turtle-scute)" opacity="0.7" className="ocean-bg__turtle-scute" />
      {/* Head: rounded, with big cartoon eye and small smile */}
      <ellipse cx="164" cy="52" rx="16" ry="12" fill="url(#ocean-bg-turtle-head)" className="ocean-bg__turtle-head" />
      <circle cx="168" cy="50" r="4" fill="rgba(25, 35, 28, 0.9)" className="ocean-bg__turtle-eye" />
      <circle cx="169" cy="49" r="1.2" fill="rgba(255,255,255,0.6)" />
      <path d="M 158 58 Q 164 62 170 58" stroke="rgba(50,70,52,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Front flippers: rounded */}
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--front-left"
        d="M 52 40 Q 32 46 28 58 Q 36 50 50 44 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
      <path
        className="ocean-bg__turtle-fin ocean-bg__turtle-fin--front-right"
        d="M 148 40 Q 168 46 172 58 Q 164 50 150 44 Z"
        fill="url(#ocean-bg-turtle-flipper)"
      />
    </svg>
  )
}

/* ----- Jellyfish: cartoon style — round bell, wavy tentacles, recognizable silhouette ----- */
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
        <linearGradient id="ocean-bg-jelly-body" x1="0.4" y1="0.1" x2="0.6" y2="0.95">
          <stop stopColor="rgba(255,252,255,0.55)" />
          <stop offset="0.4" stopColor="rgba(220,235,245,0.42)" />
          <stop offset="0.7" stopColor="rgba(160,195,215,0.28)" />
          <stop offset="1" stopColor="rgba(100,150,180,0.12)" />
        </linearGradient>
        <linearGradient id="ocean-bg-jelly-tentacle" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop stopColor="rgba(200,220,235,0.45)" />
          <stop offset="0.5" stopColor="rgba(120,160,190,0.25)" />
          <stop offset="1" stopColor="rgba(70,110,140,0)" />
        </linearGradient>
      </defs>
      {/* Bell: cartoon dome shape (rounded mushroom cap) */}
      <path
        d="M 40 8 Q 62 10 66 32 Q 68 48 40 52 Q 12 48 14 32 Q 18 10 40 8 Z"
        fill="url(#ocean-bg-jelly-body)"
        className="ocean-bg-jelly-body"
      />
      {/* Two small cartoon eyes on the bell */}
      <ellipse cx="32" cy="28" rx="4" ry="5" fill="rgba(80,120,150,0.4)" />
      <ellipse cx="48" cy="28" rx="4" ry="5" fill="rgba(80,120,150,0.4)" />
      <circle cx="33" cy="27" r="1.5" fill="rgba(255,255,255,0.7)" />
      <circle cx="49" cy="27" r="1.5" fill="rgba(255,255,255,0.7)" />
      {/* Tentacles: wavy, varied lengths — clearly jellyfish */}
      <path d="M 20 50 Q 12 78 16 136" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2.2" fill="none" strokeLinecap="round" className="ocean-bg-tentacle" />
      <path d="M 40 52 Q 36 88 40 136" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2" fill="none" strokeLinecap="round" className="ocean-bg-tentacle ocean-bg-tentacle--2" />
      <path d="M 60 50 Q 68 80 64 132" stroke="url(#ocean-bg-jelly-tentacle)" strokeWidth="2.2" fill="none" strokeLinecap="round" className="ocean-bg-tentacle ocean-bg-tentacle--3" />
    </svg>
  )
}

/* ----- Manta: cartoon style — wide disc, cephalic fins, short tail; clearly a manta ray ----- */
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
        <linearGradient id="ocean-bg-manta-fill" x1="0.2" y1="0.2" x2="0.8" y2="0.9">
          <stop stopColor="rgba(115,130,148,0.65)" />
          <stop offset="0.4" stopColor="rgba(85,100,118,0.58)" />
          <stop offset="0.75" stopColor="rgba(65,82,98,0.45)" />
          <stop offset="1" stopColor="rgba(48,62,78,0.32)" />
        </linearGradient>
      </defs>
      {/* Wide disc with pointed wing tips — iconic manta shape */}
      <path
        d="M 90 44 Q 20 14 4 44 Q 22 56 90 50 Q 158 56 176 44 Q 160 14 90 44 Z"
        fill="url(#ocean-bg-manta-fill)"
        className="ocean-bg-manta-body"
      />
      {/* Cephalic fins (head "horns") — key for recognition */}
      <path d="M 72 42 Q 58 28 62 42 Q 58 38 72 42 Z" fill="rgba(75,92,108,0.5)" />
      <path d="M 108 42 Q 122 28 118 42 Q 122 38 108 42 Z" fill="rgba(75,92,108,0.5)" />
      {/* Small cartoon eyes */}
      <ellipse cx="78" cy="44" rx="5" ry="4" fill="rgba(40,52,62,0.6)" />
      <ellipse cx="102" cy="44" rx="5" ry="4" fill="rgba(40,52,62,0.6)" />
      <circle cx="79" cy="43" r="1.5" fill="rgba(255,255,255,0.5)" />
      <circle cx="103" cy="43" r="1.5" fill="rgba(255,255,255,0.5)" />
      {/* Short tail */}
      <path d="M 86 50 L 90 78 L 94 50" stroke="rgba(65,82,98,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" className="ocean-bg-manta-tail" />
    </svg>
  )
}

/* ----- Seahorse: cartoon style — crown, S-curve body, curled tail, snout; clearly recognizable ----- */
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
          <stop stopColor="rgba(65,135,120,0.62)" />
          <stop offset="0.4" stopColor="rgba(52,110,100,0.55)" />
          <stop offset="1" stopColor="rgba(38,85,78,0.4)" />
        </linearGradient>
      </defs>
      {/* Crown (coronet) — distinctive seahorse feature */}
      <path d="M 24 4 Q 30 6 32 12 Q 30 10 26 8 Q 24 6 22 8 Q 18 10 16 12 Q 18 6 24 4 Z" fill="url(#ocean-bg-seahorse-fill)" opacity="0.95" />
      {/* Body: S-curve with rounded segments, belly bulge, then curled tail */}
      <path
        d="M 24 14 Q 32 18 30 28 Q 28 36 24 42 Q 16 50 18 62 Q 20 72 24 80 Q 26 84 24 86 L 26 86 Q 28 82 26 78 Q 22 68 20 58 Q 18 48 24 44 Q 28 40 30 30 Q 32 20 24 16 Q 22 14 24 14 Z"
        fill="url(#ocean-bg-seahorse-fill)"
        className="ocean-bg-seahorse-body"
      />
      {/* Snout (elongated mouth) */}
      <path d="M 24 16 Q 28 14 30 18 Q 28 16 24 18 Z" fill="rgba(50,100,92,0.5)" />
      {/* Cartoon eye */}
      <circle cx="28" cy="24" r="3.5" fill="rgba(25,45,42,0.85)" />
      <circle cx="28.8" cy="23.2" r="1" fill="rgba(255,255,255,0.7)" />
    </svg>
  )
}

function OceanBackground() {
  return (
    <div className="ocean-bg" aria-hidden="true">
      <div className="ocean-bg__waves">
        <WaveClusterSVG />
      </div>
      <KelpGroup side="left" />
      <KelpGroup side="right" />
      <div className="ocean-bg__creature ocean-bg__turtle">
        <SeaTurtleSVG className="ocean-bg__svg ocean-bg__svg--turtle" />
      </div>
      <div className="ocean-bg__creature ocean-bg__jellyfish ocean-bg__jellyfish--1">
        <JellyfishSVG className="ocean-bg__svg ocean-bg__svg--jelly" />
      </div>
      <div className="ocean-bg__creature ocean-bg__jellyfish ocean-bg__jellyfish--2">
        <JellyfishSVG className="ocean-bg__svg ocean-bg__svg--jelly" />
      </div>
      <div className="ocean-bg__creature ocean-bg__manta">
        <MantaSVG className="ocean-bg__svg ocean-bg__svg--manta" />
      </div>
      <div className="ocean-bg__creature ocean-bg__seahorse ocean-bg__seahorse--1">
        <SeahorseSVG className="ocean-bg__svg ocean-bg__svg--seahorse" />
      </div>
      <div className="ocean-bg__creature ocean-bg__seahorse ocean-bg__seahorse--2">
        <SeahorseSVG className="ocean-bg__svg ocean-bg__svg--seahorse" />
      </div>
    </div>
  )
}

export default memo(OceanBackground)
