import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import ProjectMotif from '../components/fx/ProjectMotif'
import { Reveal, RevealLines } from '../components/anim/Reveal'
import { asset } from '../lib/asset'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { scrollState } from '../lib/scrollState'

const N = projects.length
const STEP = 360 / N
const RADIUS = 430
const Y_GAP = 300
const MAX_Y = (N - 1) * Y_GAP
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/* a transparent glass panel — the scene refracts through it, name sits on it */
function Card({ p, big = true }) {
  return (
    <>
      <figure
        className="group relative overflow-hidden rounded-2xl border border-white/20"
        style={{
          background: 'linear-gradient(150deg, rgba(255,255,255,0.10), rgba(255,255,255,0.015) 60%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 40px rgba(255,255,255,0.04), 0 50px 110px -40px rgba(0,0,0,0.8)',
        }}
      >
        <div className="relative aspect-[4/3] w-full">
          <ProjectMotif motif={p.motif} color={p.color} className="absolute inset-0 h-full w-full opacity-75" />
          {/* glass sheen */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.14), transparent 40%)' }} />
          <span className="absolute left-5 top-4 font-body text-[9px] uppercase tracking-[0.3em]" style={{ color: p.color }}>
            {p.featured || p.tags.join(' · ')}
          </span>
          {/* the big name, ON the glass */}
          {big && (
            <h3 className="absolute bottom-4 left-5 right-5 font-display text-[clamp(1.6rem,2.6vw,2.6rem)] font-600 uppercase leading-[0.92] tracking-tight text-bone" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.7)' }}>
              {p.title}
            </h3>
          )}
        </div>
      </figure>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <span className="font-body text-[11px] tracking-widest text-bone/45">[{p.index}]</span>
        <span className="font-body text-[12px] leading-snug text-bone/55">{p.subtitle}</span>
        <span className="shrink-0 whitespace-nowrap font-body text-[11px] tracking-wide text-bone/45">// {p.date}</span>
      </div>
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
    let cur = 0
    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      // far from view → idle
      if (rect.bottom < -50 || rect.top > vh * 1.4) {
        scrollState.worksActive = false
        return
      }
      const total = section.offsetHeight - vh
      const target = clamp(-rect.top / total, 0, 1)
      cur += (target - cur) * 0.09 // eased glide → buttery, never 1:1 jitter
      const current = cur * (N - 1) * STEP
      scrollState.worksActive = rect.top <= 2 && rect.bottom >= vh - 2
      scrollState.worksProgress = cur
      if (ringRef.current)
        ringRef.current.style.transform = `translateY(${-cur * MAX_Y}px) rotateX(-6deg) rotateY(${-current}deg)`
      slots.current.forEach((el, i) => {
        if (!el) return
        const a = (((i * STEP - current) % 360) + 540) % 360 - 180
        const f = clamp(1 - Math.abs(a) / 115, 0, 1)
        el.style.opacity = (0.05 + 0.95 * f).toFixed(3)
        el.style.zIndex = String(Math.round(f * 100))
        el.style.pointerEvents = f > 0.6 ? 'auto' : 'none'
      })
    }
    raf = requestAnimationFrame(loop)
    return () => {
      scrollState.worksActive = false
      cancelAnimationFrame(raf)
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
    <section id="work" ref={sectionRef} className="relative" style={{ height: `${(N - 1) * 82 + 120}vh` }}>
      <div className="pointer-events-none absolute inset-0 bg-void/35" />
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[9%] z-[200] -translate-x-1/2 text-center">
          <p className="mb-3 font-body text-[11px] uppercase tracking-[0.45em] text-teal/70">Selected Work — descend the helix</p>
          <h2 className="font-serif text-[clamp(1.5rem,3.2vw,2.4rem)] font-500 uppercase tracking-tight text-bone">
            Things I’ve built <span className="text-teal">that matter.</span>
          </h2>
        </div>

        <div style={{ perspective: '1700px' }} className="relative h-full w-full">
          <div ref={ringRef} className="absolute left-1/2 top-1/2 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            {projects.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => (slots.current[i] = el)}
                onClick={() => onOpen(i)}
                className="group/card absolute w-[clamp(300px,25vw,400px)] cursor-pointer"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: 'calc(clamp(300px,25vw,400px) / -2)',
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
          Scroll ↓
        </div>
      </div>
    </section>
  )
}
