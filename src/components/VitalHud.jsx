import { useEffect, useRef } from 'react'

// one PQRST beat from gaussians (same language as the loader/hero)
const g = (x, c, s, a) => a * Math.exp(-((x - c) * (x - c)) / (2 * s * s))
function beat(ph) {
  const p = ((ph % 1) + 1) % 1
  return (
    g(p, 0.2, 0.022, 0.1) + g(p, 0.31, 0.008, -0.12) + g(p, 0.34, 0.011, 1.0) +
    g(p, 0.37, 0.011, -0.22) + g(p, 0.56, 0.04, 0.22)
  )
}

/**
 * A persistent little vital-signs monitor — a rolling ECG trace that beats at
 * ~62 BPM. Ties the whole operating-theatre identity together. Cheap canvas.
 */
export default function VitalHud() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = 116
    const H = 34
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const BPM = 62
    let raf
    let last = -100
    let beatFlash = 0
    let prevPhase = 0

    const draw = (time) => {
      raf = requestAnimationFrame(draw)
      if (time - last < 33) return
      last = time
      const t = time * 0.001
      const speed = BPM / 60 // beats per second
      const phase = t * speed
      // detect the R-peak crossing for the dot flash
      if (Math.floor(phase) !== Math.floor(prevPhase)) beatFlash = 1
      prevPhase = phase
      beatFlash *= 0.9

      ctx.clearRect(0, 0, W, H)
      // rolling trace
      ctx.strokeStyle = '#00E5C4'
      ctx.lineWidth = 1.4
      ctx.shadowColor = '#00E5C4'
      ctx.shadowBlur = 6
      ctx.beginPath()
      const beatsAcross = 1.6
      for (let x = 0; x <= W; x += 1.5) {
        const u = x / W
        const ph = phase + u * beatsAcross
        const y = H * 0.55 - beat(ph % 1) * H * 0.42
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }
    if (!reduced) raf = requestAnimationFrame(draw)
    else {
      // static single beat for reduced motion
      ctx.strokeStyle = '#00E5C4'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      for (let x = 0; x <= W; x += 1.5) {
        const y = H * 0.55 - beat((x / W) * 1.6) * H * 0.42
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-3 md:flex">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-crimson animate-pulse-dot" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
      </span>
      <canvas ref={ref} style={{ width: 116, height: 34 }} aria-hidden />
      <span className="font-body text-[10px] uppercase tracking-[0.25em] text-bone/45">
        62 BPM
      </span>
    </div>
  )
}
