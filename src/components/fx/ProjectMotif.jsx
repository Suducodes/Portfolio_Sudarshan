import { useEffect, useRef } from 'react'

/**
 * Procedural, animated line-art per project — no image assets. Each motif is
 * tuned to the project's domain: an ECG trace, layered biomechanics waves, a
 * molecular hex lattice, and a clinical scatter with a sweeping boundary.
 */
export default function ProjectMotif({ motif, color = '#00E5C4', active = true, className = '' }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // only animate while the card is on-screen (saves 3 idle rAF loops)
    let visible = false
    const io = new IntersectionObserver(
      ([e]) => {
        const wasVisible = visible
        visible = e.isIntersecting
        if (visible && !wasVisible && !reduced) raf = requestAnimationFrame(draw)
      },
      { rootMargin: '120px' }
    )
    io.observe(canvas)

    let last = -100
    let painted = false
    const draw = (time) => {
      if (!reduced && visible) raf = requestAnimationFrame(draw)
      // only the focused card animates; others paint one frame then idle (~free)
      if (!activeRef.current && painted) return
      if (activeRef.current && time - last < 33) return // cap at ~30fps
      last = time
      painted = true
      const t = time * 0.001
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (motif === 'ecg') {
        ctx.strokeStyle = color
        ctx.lineWidth = 1.6
        ctx.shadowColor = color
        ctx.shadowBlur = 14
        const beats = 3
        const off = (t * 0.18) % 1
        ctx.beginPath()
        for (let x = 0; x <= w; x += 2) {
          const u = x / w
          const ph = ((u * beats - off) % 1 + 1) % 1
          const g = (c, s, a) => a * Math.exp(-((ph - c) ** 2) / (2 * s * s))
          const y =
            g(0.18, 0.025, 0.12) + g(0.3, 0.008, -0.1) + g(0.33, 0.011, 0.92) +
            g(0.36, 0.011, -0.2) + g(0.56, 0.04, 0.24)
          const py = h * 0.5 - y * h * 0.32
          x === 0 ? ctx.moveTo(x, py) : ctx.lineTo(x, py)
        }
        ctx.stroke()
      } else if (motif === 'wave') {
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        for (let l = 0; l < 4; l++) {
          ctx.strokeStyle = color
          ctx.globalAlpha = 0.18 + l * 0.18
          ctx.lineWidth = 1.2 + l * 0.4
          ctx.beginPath()
          for (let x = 0; x <= w; x += 3) {
            const u = x / w
            const y =
              h * 0.5 +
              Math.sin(u * (6 + l * 2) + t * (1 + l * 0.4)) * (h * 0.12) *
                Math.sin(u * Math.PI) +
              Math.sin(u * 14 - t * 1.6) * (h * 0.03 * (l + 1))
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      } else if (motif === 'hex') {
        ctx.strokeStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        const R = Math.min(w, h) * 0.12
        const dx = R * 1.5
        const dy = R * Math.sqrt(3)
        let col = 0
        for (let cx = -R; cx < w + R; cx += dx) {
          const yoff = col % 2 ? dy / 2 : 0
          col++
          for (let cy = -R; cy < h + R; cy += dy) {
            const pulse = 0.12 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.4 + cx * 0.04 + cy * 0.05))
            ctx.globalAlpha = pulse
            ctx.lineWidth = 1
            ctx.beginPath()
            for (let i = 0; i <= 6; i++) {
              const a = (Math.PI / 3) * i + Math.PI / 6
              const px = cx + Math.cos(a) * R
              const py = cy + yoff + Math.sin(a) * R
              i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
            }
            ctx.stroke()
            ctx.globalAlpha = Math.min(1, pulse * 1.6)
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(cx, cy + yoff, 1.6, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
      } else if (motif === 'scatter') {
        // deterministic pseudo-random points
        const rand = (i) => {
          const s = Math.sin(i * 127.1) * 43758.5453
          return s - Math.floor(s)
        }
        const sweep = (0.5 + 0.5 * Math.sin(t * 0.5)) * w
        for (let i = 0; i < 90; i++) {
          const x = rand(i) * w
          const y = rand(i + 99) * h
          const minority = rand(i + 7) > 0.82
          const lit = Math.abs(x - sweep) < 60
          ctx.fillStyle = minority ? color : 'rgba(240,237,230,0.35)'
          ctx.globalAlpha = lit ? 1 : minority ? 0.7 : 0.4
          ctx.shadowColor = color
          ctx.shadowBlur = lit && minority ? 12 : 0
          ctx.beginPath()
          ctx.arc(x, y, minority ? 3 : 2, 0, Math.PI * 2)
          ctx.fill()
        }
        // sweeping boundary
        ctx.globalAlpha = 0.5
        ctx.strokeStyle = color
        ctx.shadowBlur = 16
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(sweep, 0)
        ctx.lineTo(sweep, h)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
      ctx.shadowBlur = 0
    }
    // paint one frame immediately so it's never blank before first intersect
    draw(performance.now())
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [motif, color])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
