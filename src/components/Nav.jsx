import { useEffect, useState } from 'react'
import NavCapsule from './NavCapsule'

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

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      // the hero owns the capsule while it's on screen; the header takes over after
      setScrolled(y > window.innerHeight * 0.75)
      setHidden(y > last && y > 400) // hide on scroll-down, show on up
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-surgical"
      style={{ transform: hidden ? 'translateY(-110%)' : 'translateY(0)' }}
    >
      <div
        className="relative flex items-center justify-between px-5 py-6 transition-colors duration-500 sm:px-9 sm:py-7"
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

        <div className="flex items-center gap-4 sm:gap-6">
          {/* takes over once the hero's own capsule has scrolled away */}
          <NavCapsule
            scrollTo={scrollTo}
            className="hidden md:flex"
            style={{
              opacity: scrolled ? 1 : 0,
              pointerEvents: scrolled ? 'auto' : 'none',
              transition: 'opacity .45s ease',
            }}
          />
          <SoundToggle on={soundOn} onToggle={onToggleSound} />
        </div>
      </div>
    </header>
  )
}
