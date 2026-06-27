import { useMemo } from 'react'

/**
 * Per-project line-art, tuned to each domain — an ECG trace, layered
 * biomechanics waves, a molecular hex lattice, and a clinical scatter.
 *
 * Rendered as STATIC inline SVG rather than a live <canvas>. A fullscreen
 * WebGL canvas (the heart) plus several overlapping canvas layers inside the
 * 3D orbit pushes Chrome's compositor onto a slow path (~11fps). SVG paints
 * into the panel's own layer, so the orbit composites in one cheap pass.
 */
const W = 320
const H = 240

function ecgPath() {
  let d = ''
  const beats = 3
  for (let x = 0; x <= W; x += 3) {
    const u = x / W
    const ph = (((u * beats) % 1) + 1) % 1
    const g = (c, s, a) => a * Math.exp(-((ph - c) ** 2) / (2 * s * s))
    const y = g(0.18, 0.025, 0.12) + g(0.3, 0.008, -0.1) + g(0.33, 0.011, 0.92) + g(0.36, 0.011, -0.2) + g(0.56, 0.04, 0.24)
    const py = H * 0.5 - y * H * 0.32
    d += (x === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + py.toFixed(1) + ' '
  }
  return d
}

function wavePath(l) {
  let d = ''
  for (let x = 0; x <= W; x += 4) {
    const u = x / W
    const y = H * 0.5 + Math.sin(u * (6 + l * 2)) * (H * 0.12) * Math.sin(u * Math.PI) + Math.sin(u * 14) * (H * 0.03 * (l + 1))
    d += (x === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' '
  }
  return d
}

function hexCells() {
  const R = Math.min(W, H) * 0.12
  const dx = R * 1.5
  const dy = R * Math.sqrt(3)
  const cells = []
  let col = 0
  for (let cx = -R; cx < W + R; cx += dx) {
    const yoff = col % 2 ? dy / 2 : 0
    col++
    for (let cy = -R; cy < H + R; cy += dy) {
      let d = ''
      for (let i = 0; i <= 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6
        const px = cx + Math.cos(a) * R
        const py = cy + yoff + Math.sin(a) * R
        d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' '
      }
      // deterministic per-cell opacity, like the old pulse frozen mid-breath
      const o = 0.14 + 0.4 * (0.5 + 0.5 * Math.sin(cx * 0.04 + cy * 0.05))
      cells.push({ d, o, cx, cy: cy + yoff })
    }
  }
  return cells
}

function scatterPoints() {
  const rand = (i) => {
    const s = Math.sin(i * 127.1) * 43758.5453
    return s - Math.floor(s)
  }
  const pts = []
  for (let i = 0; i < 70; i++) {
    pts.push({ x: rand(i) * W, y: rand(i + 99) * H, minority: rand(i + 7) > 0.82 })
  }
  return pts
}

export default function ProjectMotif({ motif, color = '#00E5C4', className = '' }) {
  const data = useMemo(() => {
    if (motif === 'hex') return { hex: hexCells() }
    if (motif === 'scatter') return { scatter: scatterPoints() }
    if (motif === 'wave') return { waves: [0, 1, 2, 3].map(wavePath) }
    return { ecg: ecgPath() }
  }, [motif])

  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden fill="none">
      {data.ecg && <path d={data.ecg} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}

      {data.waves &&
        data.waves.map((d, l) => (
          <path key={l} d={d} stroke={color} strokeWidth={1.2 + l * 0.4} strokeLinecap="round" opacity={0.18 + l * 0.18} />
        ))}

      {data.hex && (
        <g strokeWidth="1">
          {data.hex.map((c, i) => (
            <path key={i} d={c.d + 'Z'} stroke={color} opacity={c.o} />
          ))}
          {data.hex.map((c, i) => (
            <circle key={'d' + i} cx={c.cx} cy={c.cy} r="1.6" fill={color} opacity={Math.min(1, c.o * 1.6)} />
          ))}
        </g>
      )}

      {data.scatter && (
        <g>
          {data.scatter.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.minority ? 3 : 2}
              fill={p.minority ? color : 'rgba(240,237,230,0.35)'}
              opacity={p.minority ? 0.7 : 0.4}
            />
          ))}
          <line x1={W * 0.5} y1="0" x2={W * 0.5} y2={H} stroke={color} strokeWidth="1.4" opacity="0.5" />
        </g>
      )}
    </svg>
  )
}
