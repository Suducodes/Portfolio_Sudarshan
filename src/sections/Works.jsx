import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import ProjectMotif from '../components/fx/ProjectMotif'
import { Reveal, RevealLines } from '../components/anim/Reveal'
import { asset } from '../lib/asset'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { scrollState } from '../lib/scrollState'

const N = projects.length
const STEP = 360 / N // angle between cards on the ring
const RADIUS = 420 // px from the central axis
const Y_GAP = 300 // px vertical spacing → the helix pitch
const MAX_Y = (N - 1) * Y_GAP

function Card({ p }) {
  return (
    <>
      <figure
        className="group relative rounded-xl border border-white/15 p-2.5 transition-all duration-500 group-hover/card:border-white/35 sm:p-3"
        style={{
          background: 'linear-gradient(150deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 40px 90px -40px rgba(0,0,0,0.85)',
        }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-void/55">
          <ProjectMotif motif={p.motif} color={p.color} className="absolute inset-0 h-full w-full" />
          <img
            src={asset(p.image)}
            alt={p.title}
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-surgical group-hover/card:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(130% 100% at 50% 120%, ${p.color}24, transparent 55%)` }} />
          <span className="absolute left-4 top-3 font-body text-[9px] uppercase tracking-[0.3em]" style={{ color: p.color }}>
            {p.featured || p.tags.join(' · ')}
          </span>
        </div>
      </figure>
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-4 sm:gap-7">
          <span className="font-body text-[11px] tracking-widest text-bone/40">[{p.index}]</span>
          <h3 className="whitespace-nowrap font-display text-lg font-500 uppercase tracking-tight text-bone sm:text-2xl">{p.title}</h3>
        </div>
        <span className="shrink-0 whitespace-nowrap font-body text-[11px] tracking-wide text-bone/45">// {p.date}</span>
      </div>
      <p className="mt-2 font-body text-[13px] leading-relaxed text-bone/45">{p.subtitle}</p>
    </>
  )
}

export default function Works({ onOpen }) {
  const desktop = useMediaQuery('(min-width: 880px)')
  const sectionRef = useRef(null)
  const ringRef = useRef(null)
  const slots = useRef([])

  useEffect(() => {
    if (!desktop) return
    const section = sectionRef.current
    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      const wp = Math.max(0, Math.min(1, -rect.top / total))
      const current = wp * (N - 1) * STEP
      // drive the heart's pan-down
      scrollState.worksActive = rect.top <= 1 && rect.bottom >= window.innerHeight - 1
      scrollState.worksProgress = wp
      // descend + rotate the helix → cards spiral down, each to front-centre in turn
      if (ringRef.current)
        ringRef.current.style.transform = `translateY(${-wp * MAX_Y}px) rotateX(-6deg) rotateY(${-current}deg)`
      slots.current.forEach((el, i) => {
        if (!el) return
        const a = (((i * STEP - current) % 360) + 540) % 360 - 180 // facing, -180..180
        const f = Math.max(0, 1 - Math.abs(a) / 90)
        el.style.opacity = (0.06 + 0.94 * f).toFixed(3)
        el.style.zIndex = String(Math.round(f * 100))
        el.style.pointerEvents = f > 0.6 ? 'auto' : 'none'
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      scrollState.worksActive = false
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [desktop])

  if (!desktop) {
    return (
      <section id="work" className="relative w-full px-6 py-28">
        <div className="pointer-events-none absolute inset-0 bg-void/55" />
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-20">
          <RevealLines
            as="h2"
            className="text-center font-serif text-[clamp(2rem,9vw,3rem)] font-500 uppercase leading-[0.95] tracking-tight text-bone"
            lines={[<>Things I’ve built</>, <span key="m" className="text-teal">that matter.</span>]}
          />
          {projects.map((p) => (
            <Reveal key={p.id} blur y={50} className="group/card w-full cursor-pointer" onClick={() => onOpen(projects.indexOf(p))}>
              <Card p={p} />
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="work" ref={sectionRef} className="relative" style={{ height: `${(N + 1.5) * 100}vh` }}>
      <div className="pointer-events-none absolute inset-0 bg-void/40" />
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[10%] z-[200] -translate-x-1/2 text-center">
          <p className="mb-3 font-body text-[11px] uppercase tracking-[0.45em] text-teal/70">Selected Work — descend the helix</p>
          <h2 className="font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-500 uppercase tracking-tight text-bone">
            Things I’ve built <span className="text-teal">that matter.</span>
          </h2>
        </div>

        <div style={{ perspective: '1600px' }} className="relative h-full w-full">
          <div ref={ringRef} className="absolute left-1/2 top-1/2 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            {projects.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => (slots.current[i] = el)}
                onClick={() => onOpen(i)}
                className="group/card absolute w-[clamp(280px,24vw,380px)] cursor-pointer"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: 'calc(clamp(280px,24vw,380px) / -2)',
                  marginTop: '-150px',
                  transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px) translateY(${i * Y_GAP}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <Card p={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[200] -translate-x-1/2 font-body text-[10px] uppercase tracking-[0.4em] text-bone/35">
          Scroll to descend ↓
        </div>
      </div>
    </section>
  )
}
