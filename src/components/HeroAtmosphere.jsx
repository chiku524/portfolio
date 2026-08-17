/**
 * Hero-only aquatic atmosphere: caustics, plankton, school of fish, tide.
 * Hidden on touch and reduced-motion via CSS.
 */
function FishSVG({ id }) {
  return (
    <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`hero-fish-${id}`} x1="0.9" y1="0.2" x2="0.1" y2="0.9">
          <stop stopColor="rgba(34, 211, 238, 0.85)" />
          <stop offset="1" stopColor="rgba(14, 165, 233, 0.45)" />
        </linearGradient>
      </defs>
      <ellipse cx="46" cy="16" rx="24" ry="11" fill={`url(#hero-fish-${id})`} />
      <path d="M22 16 L2 5 L9 16 L2 27 Z" fill={`url(#hero-fish-${id})`} />
      <path d="M50 7 Q44 16 50 25" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" fill="none" />
      <circle cx="60" cy="14" r="2.1" fill="rgba(8, 47, 73, 0.75)" />
      <circle cx="59.3" cy="13.3" r="0.7" fill="rgba(255,255,255,0.65)" />
    </svg>
  )
}

export default function HeroAtmosphere() {
  return (
    <div className="hero__atmosphere" aria-hidden="true">
      <div className="hero__caustics">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hero__aurora hero__aurora--one" />
      <div className="hero__aurora hero__aurora--two" />
      <div className="hero__aurora hero__aurora--three" />
      <div className="hero__ripples" />
      <div className="hero__ripples hero__ripples--two" />
      <div className="hero__plankton" />
      <div className="hero__spray">
        <span className="hero__spray-line hero__spray-line--one" />
        <span className="hero__spray-line hero__spray-line--two" />
        <span className="hero__spray-line hero__spray-line--three" />
      </div>
      <div className="hero__sparkles">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hero__bubbles">
        <span className="hero__bubble hero__bubble--one" />
        <span className="hero__bubble hero__bubble--two" />
        <span className="hero__bubble hero__bubble--three" />
        <span className="hero__bubble hero__bubble--four" />
        <span className="hero__bubble hero__bubble--five" />
      </div>
      <div className="hero__fish-squad">
        <span className="fish fish--one">
          <FishSVG id="1" />
        </span>
        <span className="fish fish--two">
          <FishSVG id="2" />
        </span>
        <span className="fish fish--three">
          <FishSVG id="3" />
        </span>
        <span className="fish fish--four">
          <FishSVG id="4" />
        </span>
        <span className="fish fish--five">
          <FishSVG id="5" />
        </span>
        <span className="fish fish--six">
          <FishSVG id="6" />
        </span>
      </div>
      <div className="hero__tide">
        <svg viewBox="0 0 2880 120" preserveAspectRatio="none">
          <path
            className="hero__tide-path hero__tide-path--back"
            d="M0,52 C180,96 360,8 540,48 C720,88 900,16 1080,52 C1260,88 1380,24 1440,40 L1440,120 L0,120 Z"
          />
          <path
            className="hero__tide-path hero__tide-path--back"
            d="M1440,52 C1620,96 1800,8 1980,48 C2160,88 2340,16 2520,52 C2700,88 2820,24 2880,40 L2880,120 L1440,120 Z"
          />
          <path
            className="hero__tide-path hero__tide-path--front"
            d="M0,72 C220,28 440,108 720,68 C1000,28 1220,100 1440,64 L1440,120 L0,120 Z"
          />
          <path
            className="hero__tide-path hero__tide-path--front"
            d="M1440,72 C1660,28 1880,108 2160,68 C2440,28 2660,100 2880,64 L2880,120 L1440,120 Z"
          />
        </svg>
      </div>
    </div>
  )
}
