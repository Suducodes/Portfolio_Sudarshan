/**
 * Thin concentric orbit guides — the Parallel Universe device of drawing every
 * centrepiece inside its own instrument. Pure SVG; the rotation is CSS so it
 * costs nothing per frame on the JS side.
 */
export default function OrbitRings({ className = '', style, rings = [0.42, 0.62, 0.86], ticks = true, label }) {
  const R = 500
  return (
    <svg
      viewBox="-520 -520 1040 1040"
      className={`pointer-events-none ${className}`}
      style={style}
      aria-hidden
      fill="none"
    >
      {rings.map((k, i) => (
        <circle
          key={k}
          r={R * k}
          stroke="rgba(236,230,218,0.14)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={i === 1 ? '2 7' : undefined}
        />
      ))}

      {/* outer instrument ring: degree ticks, slowly turning */}
      {ticks && (
        <g className="origin-center animate-spin-slow">
          {Array.from({ length: 120 }, (_, i) => {
            const a = (i / 120) * Math.PI * 2
            const long = i % 10 === 0
            const r0 = R * 0.95
            const r1 = R * (long ? 0.915 : 0.935)
            return (
              <line
                key={i}
                x1={Math.cos(a) * r0}
                y1={Math.sin(a) * r0}
                x2={Math.cos(a) * r1}
                y2={Math.sin(a) * r1}
                stroke={long ? 'rgba(236,230,218,0.5)' : 'rgba(236,230,218,0.2)'}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
          {/* a single bright marker riding the ring */}
          <circle cx={R * 0.95} cy="0" r="3.5" fill="#00E5C4" />
        </g>
      )}

      {/* crosshair stubs at the cardinal points */}
      {[0, 90, 180, 270].map((d) => {
        const a = (d * Math.PI) / 180
        return (
          <line
            key={d}
            x1={Math.cos(a) * R * 0.99}
            y1={Math.sin(a) * R * 0.99}
            x2={Math.cos(a) * R * 1.03}
            y2={Math.sin(a) * R * 1.03}
            stroke="rgba(236,230,218,0.4)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        )
      })}

      {label && (
        <text
          className="max-sm:hidden"
          x="0"
          y={-R * 1.0 - 4}
          textAnchor="middle"
          fill="rgba(236,230,218,0.38)"
          style={{ font: '400 13px "Martian Mono Variable", monospace', letterSpacing: '0.2em' }}
        >
          {label}
        </text>
      )}
    </svg>
  )
}
