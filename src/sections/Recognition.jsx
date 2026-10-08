import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { timeline } from '../data/timeline'
import { Reveal } from '../components/anim/Reveal'
import ChapterMark from '../components/ChapterMark'

export default function Recognition() {
  const lineRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const line = lineRef.current
    const wrap = wrapRef.current
    if (!line || !wrap) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: { trigger: wrap, start: 'top 70%', end: 'bottom 75%', scrub: true },
        }
      )
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <section id="vitals" className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <ChapterMark n="09" title="Vitals — the years" meta="2019 — 2026" className="mb-8" />
        <Reveal as="h2" delay={0.05} className="display mb-16 text-[clamp(1.5rem,4vw,3.2rem)] font-[600] text-bone">
          A vitals trace of the <span className="text-teal">years.</span>
        </Reveal>

        <div ref={wrapRef} className="relative pl-8">
          {/* base + animated line */}
          <div className="absolute bottom-2 left-[6px] top-2 w-px bg-bone/10" />
          <div
            ref={lineRef}
            className="absolute bottom-2 left-[6px] top-2 w-px bg-teal"
            style={{ boxShadow: '0 0 10px rgba(0,229,196,0.8)' }}
          />

          <ol className="flex flex-col gap-10">
            {timeline.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.05} y={24} className="relative">
                <span
                  className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full"
                  style={{
                    background: item.peak ? '#E0303A' : '#ECE6DA',
                    boxShadow: item.peak ? '0 0 16px rgba(224,48,58,0.9)' : '0 0 12px rgba(0,229,196,0.7)',
                  }}
                />
                {item.peak && (
                  <span className="absolute -left-[31px] top-[2px] h-5 w-5 rounded-full bg-crimson/20 animate-pulse-dot" />
                )}
                <p className="label-sm" style={{ color: item.peak ? '#ff6b75' : '#00E5C4' }}>
                  {item.year}
                </p>
                <p className="display mt-2 text-[clamp(0.95rem,1.6vw,1.2rem)] font-[560] normal-case tracking-[-0.02em] text-bone">
                  {item.title}
                </p>
                <p className="mt-1 font-body text-[13px] text-bone/45">{item.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
