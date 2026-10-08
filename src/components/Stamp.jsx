/**
 * A passport entry stamp, drawn in SVG: double ring, the conference arced
 * along the top, the destination arced along the bottom, the airport code
 * dead centre. Ink is eaten by a noise mask so it reads as pressed, not printed.
 */
export default function Stamp({ code, top, bottom, date, mark = 'ADMITTED', ink = '#C8102E', size = 240, rotate = -8, className = '', style }) {
  const id = `st-${code}-${size}`
  return (
    <svg
      viewBox="0 0 260 260"
      width={size}
      height={size}
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, filter: `drop-shadow(0 0 18px ${ink}55)`, ...style }}
      aria-label={`${top} — ${bottom}`}
      role="img"
    >
      <defs>
        <path id={`${id}-top`} d="M 38 130 A 92 92 0 0 1 222 130" />
        <path id={`${id}-bot`} d="M 30 130 A 100 100 0 0 0 230 130" />
        {/* worn ink: a fractal-noise threshold knocks out speckles of the print */}
        <filter id={`${id}-wear`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={code.length * 7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.7 1.62" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id}-wear)`} fill="none" stroke={ink} style={{ opacity: 0.92 }}>
        <circle cx="130" cy="130" r="122" strokeWidth="5" />
        <circle cx="130" cy="130" r="112" strokeWidth="1.6" />
        <circle cx="130" cy="130" r="70" strokeWidth="1.6" strokeDasharray="3 4" />
        <text fill={ink} stroke="none" style={{ font: '600 15px "Martian Mono Variable", monospace', letterSpacing: '0.22em' }}>
          <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
            {top}
          </textPath>
        </text>
        <text fill={ink} stroke="none" style={{ font: '600 13px "Martian Mono Variable", monospace', letterSpacing: '0.26em' }}>
          <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
            {bottom}
          </textPath>
        </text>
        <text x="130" y="96" textAnchor="middle" fill={ink} stroke="none" style={{ font: '500 11px "Martian Mono Variable", monospace', letterSpacing: '0.24em' }}>
          {date}
        </text>
        <text x="130" y="146" textAnchor="middle" fill={ink} stroke="none" style={{ font: '700 50px "Unbounded Variable", sans-serif', letterSpacing: '-0.02em' }}>
          {code}
        </text>
        {/* the immigration chop, slanted across the lower half */}
        <g transform="rotate(-9 130 176)">
          <rect x="58" y="164" width="144" height="23" strokeWidth="2" />
          <text x="130" y="180.5" textAnchor="middle" fill={ink} stroke="none" style={{ font: '700 11.5px "Martian Mono Variable", monospace', letterSpacing: '0.32em' }}>
            {mark}
          </text>
        </g>
      </g>
    </svg>
  )
}
