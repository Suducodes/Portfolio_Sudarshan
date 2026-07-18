import { useRef, useState } from 'react'
import { sfx } from '../lib/sfx'

export const NAV_ITEMS = [
  { label: 'Work', target: '#work' },
  { label: 'Research', target: '#research' },
  { label: 'Story', target: '#story' },
  { label: 'Contact', target: '#contact' },
]

// liquid glass, iOS segmented-control flavour
const CAPSULE = {
  background: 'linear-gradient(150deg, rgba(255,255,255,0.11), rgba(255,255,255,0.025))',
  backdropFilter: 'blur(16px) saturate(150%)',
  WebkitBackdropFilter: 'blur(16px) saturate(150%)',
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.05), 0 10px 30px -14px rgba(0,0,0,0.6)',
}

/**
 * The glass nav capsule with a thumb that slides to the hovered item.
 * Used twice: anchored in the hero column, and in the sticky header once
 * you've scrolled past the hero.
 */
export default function NavCapsule({ scrollTo, className = '', style }) {
  const [thumb, setThumb] = useState(null)
  const itemRefs = useRef([])

  const moveThumb = (i) => {
    const el = itemRefs.current[i]
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth })
  }

  return (
    <ul
      onMouseLeave={() => setThumb(null)}
      className={`relative flex w-fit items-center rounded-full p-1 sm:p-1.5 ${className}`}
      style={{ ...CAPSULE, ...style }}
    >
      {/* sliding liquid-glass thumb — follows the hovered item */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1 top-1 rounded-full transition-all duration-300 ease-surgical sm:bottom-1.5 sm:top-1.5"
        style={{
          left: thumb ? thumb.left : 0,
          width: thumb ? thumb.width : 0,
          opacity: thumb ? 1 : 0,
          background: 'linear-gradient(150deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px -2px rgba(0,0,0,0.4)',
        }}
      />
      {NAV_ITEMS.map((item, i) => (
        <li key={item.label}>
          <button
            ref={(el) => (itemRefs.current[i] = el)}
            onClick={() => scrollTo?.(item.target)}
            onMouseEnter={() => {
              moveThumb(i)
              sfx.tick()
            }}
            data-cursor="hover"
            className="relative z-10 rounded-full px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.18em] text-bone/65 transition-colors duration-300 hover:text-bone sm:px-4 sm:text-[12px]"
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
