import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { roles } from '../data/resume'
import ChapterMark from '../components/ChapterMark'
import { Reveal } from '../components/anim/Reveal'

/** A word that starts as an outline and fills with ink, left to right, as it
 *  crosses the screen. */
function InkWord({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { backgroundPosition: '100% 0' },
        {
          backgroundPosition: '0% 0',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 38%', scrub: 0.5 },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #ECE6DA 50%, transparent 50%)',
        backgroundSize: '200% 100%',
        backgroundPosition: '100% 0',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(236,230,218,0.32)',
      }}
    >
      {children}
    </span>
  )
}

/** The offices — what people have trusted me with. */
export default function Office() {
  return (
    <section id="office" className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <ChapterMark n="05" title="Office — what I'm trusted with" meta="4 posts · 2025 — 2026" />

        <ul className="mt-16 flex flex-col">
          {roles.map((r) => (
            <li key={r.role} className="group border-t border-bone/10 py-8 last:border-b sm:py-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <h3 className="display text-[clamp(1.7rem,7.4vw,2.6rem)] font-[640] leading-[0.95] sm:text-[clamp(2.4rem,6.2vw,6.6rem)]">
                  <InkWord>{r.role}</InkWord>
                </h3>
                <div className="shrink-0 sm:pb-2 sm:text-right">
                  <p className="label text-teal">{r.org}</p>
                  <p className="label-sm mt-1.5 text-bone/35">{r.since}</p>
                </div>
              </div>
              <Reveal y={12} start="top 90%">
                <p className="mt-4 max-w-2xl font-body text-[15px] leading-relaxed text-bone/55 sm:text-base">{r.line}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
