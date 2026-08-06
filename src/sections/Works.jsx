import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'
import ProjectMotif from '../components/fx/ProjectMotif'
import { Reveal } from '../components/anim/Reveal'
import { asset } from '../lib/asset'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { scrollState } from '../lib/scrollState'

const N = projects.length
const STEP = 360 / N
const RADIUS = 460
const Y_GAP = 340
const MAX_Y = (N - 1) * Y_GAP
const CARD_W = 'clamp(280px, 25vw, 400px)'
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/* a transparent glass panel — the scene refracts through it, name sits on it */
function Card({ p, big = true, active = true }) {
  return (
    <>
      <figure
        className="group relative overflow-hidden rounded-2xl border border-white/20"
        style={{
          background: 'linear-gradient(150deg, rgba(255,255,255,0.10), rgba(255,255,255,0.015) 60%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 40px rgba(255,255,255,0.04), 0 24px 50px -28px rgba(0,0,0,0.8)',
        }}
      >
        <div className="relative aspect-[4/3] w-full">
          <ProjectMotif motif={p.motif} color={p.color} active={active} className="absolute inset-0 h-full w-full opacity-75" />
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
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <span className="font-body text-[11px] tracking-widest text-bone/45">[{p.index}]</span>
        <span className="ml-auto shrink-0 whitespace-nowrap font-body text-[11px] tracking-wide text-bone/45 sm:order-3 sm:ml-0">
          // {p.date}
        </span>
        {/* full width on mobile so it never fights the date */}
        <span className="w-full font-body text-[12px] leading-snug text-bone/55 sm:order-2 sm:ml-auto sm:w-auto sm:flex-1 sm:text-right">
          {p.subtitle}
        </span>
      </div>
    </>
  )
}

export default function Works({ onOpen }) {
  const desktop = useMediaQuery('(min-width: 880px)')
  const sectionRef = useRef(null)
  const ringRef = useRef(null)
  const slots = useRef([])
  const cardRefs = useRef([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!desktop) return
    const section = sectionRef.current
    let cur = 0
    let drawn = -1 // last rotation we actually painted — lets us skip when settled
    let raf
    let focus = 0
    const last = [] // cached per-slot styles, so we only touch the DOM on change
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
      scrollState.worksRot = current // heart locks to this — panels stay pinned
      // nothing moved enough to matter — skip all DOM writes this frame
      if (Math.abs(current - drawn) < 0.02) return
      drawn = current
      if (ringRef.current)
        ringRef.current.style.transform = `translateY(${-cur * MAX_Y}px) rotateX(-6deg) rotateY(${-current}deg)`
      const f0 = clamp(Math.round(current / STEP), 0, N - 1)
      if (f0 !== focus) {
        focus = f0
        setActiveIdx(f0) // only the front card's motif animates
      }
      slots.current.forEach((el, i) => {
        if (!el) return
        const a = (((i * STEP - current) % 360) + 540) % 360 - 180
        const f = clamp(1 - Math.abs(a) / 115, 0, 1)
        const o = (0.05 + 0.95 * f).toFixed(2)
        const z = Math.round(f * 100)
        const pe = f > 0.6 ? 'auto' : 'none'
        const L = last[i] || (last[i] = {})
        if (L.o !== o) el.style.opacity = (L.o = o)
        if (L.z !== z) el.style.zIndex = String((L.z = z))
        if (L.pe !== pe) el.style.pointerEvents = (L.pe = pe)
      })
    }
    raf = requestAnimationFrame(loop)
    return () => {
      scrollState.worksActive = false
      cancelAnimationFrame(raf)
    }
  }, [desktop])

  /* Phones get the same arc as the desktop orbit — the heart rises in, turns
     through the projects, then leaves — but choreographed for a vertical list:
     it sits *behind* the cards while they slide past and lean toward you. */
  useEffect(() => {
    if (desktop) return
    const section = sectionRef.current
    if (!section) return
    let raf
    let cur = 0
    let focus = -1
    const last = []
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.bottom < -80 || rect.top > vh * 1.3) {
        scrollState.worksActive = false
        return
      }
      const total = Math.max(1, section.offsetHeight - vh)
      const target = clamp(-rect.top / total, 0, 1)
      cur += (target - cur) * 0.1
      scrollState.worksActive = true
      scrollState.worksProgress = cur
      scrollState.worksRot = cur * 300 // one slow turn across the whole section

      // each card leans as it crosses the middle of the screen
      const mid = vh * 0.5
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const k = clamp((r.top + r.height / 2 - mid) / vh, -1, 1)
        const t = `perspective(900px) rotateX(${(-k * 8).toFixed(2)}deg) scale(${(
          1 - Math.min(0.1, Math.abs(k) * 0.12)
        ).toFixed(3)})`
        const s = last[i] || (last[i] = {})
        if (s.t !== t) el.style.transform = (s.t = t)
      })

      const idx = clamp(Math.round(cur * (N - 1)), 0, N - 1)
      if (idx !== focus) {
        focus = idx
        setActiveIdx(idx)
      }
    }
    raf = requestAnimationFrame(loop)
    return () => {
      scrollState.worksActive = false
      cancelAnimationFrame(raf)
    }
  }, [desktop])

  if (!desktop) {
    return (
      <section id="work" ref={sectionRef} className="relative w-full px-5 pb-32 pt-20">
        {/* light enough that the heart still reads behind the stack */}
        <div
          className="pointer-events-none absolute inset-0 bg-void/25"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)',
            maskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)',
          }}
        />

        {/* chapter marker — rides along and counts the descent */}
        <div className="sticky top-[72px] z-[30] mb-12 flex items-end justify-between gap-4">
          <div className="pointer-events-none">
            <p className="font-body text-[9px] uppercase tracking-[0.4em] text-teal/80">Selected Work</p>
            <h2 className="mt-1.5 font-serif text-[26px] uppercase leading-[0.95] tracking-tight text-bone">
              Things I’ve built <span className="text-teal">that matter.</span>
            </h2>
          </div>
          <span className="shrink-0 pb-1 font-display text-[11px] tracking-[0.18em] text-bone/50">
            {String(activeIdx + 1).padStart(2, '0')}
            <span className="text-bone/25"> / {String(N).padStart(2, '0')}</span>
          </span>
        </div>

        <div className="relative z-10 mx-auto flex max-w-xl flex-col gap-16">
          {projects.map((p, i) => (
            <Reveal key={p.id} blur y={40} className="w-full cursor-pointer" onClick={() => onOpen(i)}>
              <div ref={(el) => (cardRefs.current[i] = el)} className="will-change-transform">
                <Card p={p} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="work" ref={sectionRef} className="relative" style={{ height: `${(N - 1) * 82 + 120}vh` }}>
      <div
        className="pointer-events-none absolute inset-0 bg-void/35"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
        }}
      />
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[9%] z-[200] -translate-x-1/2 text-center">
          <p className="mb-3 font-body text-[11px] uppercase tracking-[0.45em] text-teal/70">Selected Work — descend the helix</p>
          <h2 className="font-serif text-[clamp(1.5rem,3.2vw,2.4rem)] font-500 uppercase tracking-tight text-bone">
            Things I’ve built <span className="text-teal">that matter.</span>
          </h2>
        </div>

        <div style={{ perspective: '1500px' }} className="relative h-full w-full">
          <div ref={ringRef} className="absolute left-1/2 top-1/2 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            {projects.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => (slots.current[i] = el)}
                onClick={() => onOpen(i)}
                className="group/card absolute cursor-pointer"
                style={{
                  width: CARD_W,
                  left: '50%',
                  top: '50%',
                  marginLeft: `calc(${CARD_W} / -2)`,
                  marginTop: '-165px',
                  transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px) translateY(${i * Y_GAP}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <Card p={p} active={i === activeIdx} />
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
