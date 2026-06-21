import { useRef } from 'react'

/**
 * Cursor-driven 3D tilt. Wrap a card; children with `translateZ` get real
 * parallax depth as the card leans toward the pointer. Desktop only (hover).
 * Pointer moves are coalesced to one write per frame (rAF) so fast mouse
 * movement can't flood the main thread.
 */
export default function Tilt3D({ children, className = '', max = 9, style }) {
  const ref = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const frame = useRef(0)

  const apply = () => {
    frame.current = 0
    const el = ref.current
    if (!el) return
    el.style.transform = `perspective(900px) rotateY(${pos.current.x * max}deg) rotateX(${-pos.current.y * max}deg)`
  }
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    pos.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }
    if (!frame.current) frame.current = requestAnimationFrame(apply)
  }
  const reset = () => {
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = 0
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
