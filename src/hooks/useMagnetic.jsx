import { useEffect, useRef } from 'react'

export function useMagnetic(strength = 0.35) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    el.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)'
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0,0)'
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])
  return ref
}

/** Wrap any element to make it drift toward the cursor. */
export function Magnetic({ children, strength = 0.35, className = '', ...rest }) {
  const ref = useMagnetic(strength)
  return (
    <span ref={ref} className={`inline-block ${className}`} {...rest}>
      {children}
    </span>
  )
}
