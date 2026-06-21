import { useRef } from 'react'

/**
 * Cursor-driven 3D tilt. Wrap a card; children with `translateZ` get real
 * parallax depth as the card leans toward the pointer. Desktop only (hover).
 */
export default function Tilt3D({ children, className = '', max = 9, style }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`
  }
  const reset = () => {
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
        ...style,
      }}
    >
      {children}
    </div>
  )
}
