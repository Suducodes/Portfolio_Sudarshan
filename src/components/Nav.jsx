import { useEffect, useRef, useState } from 'react'
import { sfx } from '../lib/sfx'

// the glass capsule that holds the nav links — an iOS segmented-control look
const CAPSULE = {
  background: 'linear-gradient(150deg, rgba(255,255,255,0.11), rgba(255,255,255,0.025))',
  backdropFilter: 'blur(16px) saturate(150%)',
  WebkitBackdropFilter: 'blur(16px) saturate(150%)',
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.05), 0 10px 30px -14px rgba(0,0,0,0.6)',
}

const ITEMS = [
  { label: 'Work', target: '#work' },
  { label: 'Research', target: '#research' },
  { label: 'Story', target: '#story' },
  { label: 'Contact', target: '#contact' },
]

function SoundToggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Enable ambient sound'}
      data-cursor="hover"
      className="group flex items-center gap-2.5 text-bone/55 transition-colors hover:text-teal"
    >
      <span className="flex h-3.5 items-center gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-current"
            style={{
              height: on ? `${[7, 13, 9, 15][i]}px` : '3px',
              transition: `height .4s ${0.05 * i}s cubic-bezier(.16,1,.3,1)`,
              animation: on ? `drift ${0.9 + i * 0.2}s ease-in-out ${i * 0.1}s infinite` : 'none',
            }}
          />
        ))}
      </span>
      <span className="hidden font-body text-[10px] uppercase tracking-[0.3em] sm:inline">
        {on ? 'On' : 'Sound'}
      </span>
    </button>
  )
}

export default function Nav({ scrollTo, soundOn, onToggleSound }) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [thumb, setThumb] = useState(null) // sliding glass highlight {left,width}
  const itemRefs = useRef([])

  const moveThumb = (i) => {
    const el = itemRefs.current[i]
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth })
  }

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 400) // hide on scroll-down, show on up
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-surgical"
      style={{ transform: hidden ? 'translateY(-110%)' : 'translateY(0)' }}
    >
      <div
        className="flex items-center justify-between px-5 py-5 transition-colors duration-500 sm:px-9 sm:py-6"
        style={{
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          background: scrolled
            ? 'linear-gradient(180deg, rgba(7,10,13,0.7), rgba(7,10,13,0))'
            : 'transparent',
        }}
      >
        <button
          onClick={() => scrollTo(0)}
          data-cursor="hover"
          aria-label="Back to top"
          className="flex items-center gap-3"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-crimson animate-pulse-dot" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-crimson" />
          </span>
          <span className="hidden font-display text-sm font-600 tracking-tight text-bone sm:inline">
            Sudarshan&nbsp;V.
          </span>
        </button>

        <nav className="flex items-center gap-3 sm:gap-5">
          <ul
            onMouseLeave={() => setThumb(null)}
            className="relative flex items-center rounded-full p-1 sm:p-1.5"
            style={CAPSULE}
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
            {ITEMS.map((item, i) => (
              <li key={item.label}>
                <button
                  ref={(el) => (itemRefs.current[i] = el)}
                  onClick={() => scrollTo(item.target)}
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
          <SoundToggle on={soundOn} onToggle={onToggleSound} />
        </nav>
      </div>
    </header>
  )
}
