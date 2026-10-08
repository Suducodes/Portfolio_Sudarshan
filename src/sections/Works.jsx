import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { featured } from '../data/projects'
import { Reveal } from '../components/anim/Reveal'
import ChapterMark from '../components/ChapterMark'
import { asset } from '../lib/asset'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { scrollState } from '../lib/scrollState'
import { picker } from '../lib/picker'

const N = featured.length
const STEP = 360 / N
const RADIUS = 500
const Y_GAP = 300
const MAX_Y = (N - 1) * Y_GAP
const CARD_W = 'clamp(300px, 26vw, 430px)'
const VH_PER = 78 // scroll length per project, in vh
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const pad = (n) => String(n).padStart(2, '0')

/* a glass plate with the project's real key art behind it */
function Card({ p, i }) {
  return (
    <>
      <figure
        className="relative overflow-hidden rounded-[18px]"
        style={{
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 30px 60px -30px rgba(0,0,0,0.9)',
        }}
      >
        <div className="relative aspect-[16/10] w-full bg-void-2">
          <img
            src={asset(p.image)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* the glass: a dark fall-off so the name reads, and a sheen */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(6,8,10,0.25) 0%, rgba(6,8,10,0) 30%, rgba(6,8,10,0.86) 100%)' }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.16), transparent 36%)' }}
          />
          <span className="label-sm absolute left-4 top-3.5 drop-shadow" style={{ color: p.color }}>
            {p.kicker}
          </span>
          <span className="label-sm absolute right-4 top-3.5 text-bone/70 drop-shadow">{p.status}</span>
          <h3
            className="display absolute bottom-3.5 left-4 right-4 text-[clamp(1.15rem,1.9vw,1.85rem)] font-[600] text-bone"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.75)' }}
          >
            {p.title}
          </h3>
        </div>
      </figure>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="label-sm text-bone/45">[{pad(i + 1)}]</span>
        <span className="label-sm ml-auto text-bone/45 sm:order-3 sm:ml-0">{p.year}</span>
        <span className="w-full font-body text-[13px] leading-snug text-bone/60 sm:order-2 sm:w-auto sm:flex-1">
          {p.subtitle}
        </span>
      </div>
    </>
  )
}

export default function Works({ onOpen, scrollTo, glass = true }) {
  const desktop = useMediaQuery('(min-width: 880px)')
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const hoverRaf = useRef(0)
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
        setActiveIdx(f0)
      }
      slots.current.forEach((el, i) => {
        if (!el) return
        const a = (((i * STEP - current) % 360) + 540) % 360 - 180
        const f = clamp(1 - Math.abs(a) / 110, 0, 1)
        const o = (0.04 + 0.96 * f).toFixed(2)
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

  /* Phones get the same arc as the desktop orbit — the heart turns through
     the projects behind the stack while each card leans toward you as it
     crosses the middle of the screen. */
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

  // jump the descent to a given project (desktop rail)
  const goTo = (i) => {
    const s = sectionRef.current
    if (!s) return
    const top = s.getBoundingClientRect().top + window.scrollY
    const total = s.offsetHeight - window.innerHeight
    scrollTo?.(top + (i / (N - 1)) * total + 2)
  }

  const active = featured[activeIdx]

  // the glass plates live in WebGL behind this DOM — ask them what's under the pointer
  const ndc = (e) => [(e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1]
  const onStageClick = (e) => {
    if (!glass || e.target.closest('button, a')) return
    const id = picker.pick?.(...ndc(e))
    if (id) onOpen(id)
  }
  const onStageMove = (e) => {
    if (!glass || hoverRaf.current) return
    const [x, y] = ndc(e)
    hoverRaf.current = requestAnimationFrame(() => {
      hoverRaf.current = 0
      const id = picker.pick?.(x, y) ?? null
      if (id !== scrollState.hoverPanel) {
        scrollState.hoverPanel = id
        if (stageRef.current) stageRef.current.style.cursor = id ? 'pointer' : ''
      }
    })
  }
  const onStageLeave = () => {
    scrollState.hoverPanel = null
    if (stageRef.current) stageRef.current.style.cursor = ''
  }

  if (!desktop) {
    return (
      <section id="work" ref={sectionRef} className="relative w-full px-5 pb-32 pt-20">
        <div
          className="pointer-events-none absolute inset-0 bg-void/25"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)',
            maskImage: 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)',
          }}
        />

        {/* chapter marker — rides along and counts the descent */}
        <div
          className="sticky top-[56px] z-[30] -mx-5 mb-12 flex items-end justify-between gap-4 px-5 pb-5 pt-3"
          style={{ background: 'linear-gradient(180deg, #06080a 0%, rgba(6,8,10,0.92) 62%, rgba(6,8,10,0) 100%)' }}
        >
          <div className="pointer-events-none">
            <p className="label-sm text-teal/80">02 — Selected work</p>
            <h2 className="display mt-2 text-[22px] font-[560] text-bone">
              Things I’ve built <span className="text-teal">that matter.</span>
            </h2>
          </div>
          <span className="label shrink-0 pb-0.5 text-bone/50">
            {pad(activeIdx + 1)}
            <span className="text-bone/25"> / {pad(N)}</span>
          </span>
        </div>

        <div className="relative z-10 mx-auto flex max-w-xl flex-col gap-14">
          {featured.map((p, i) => (
            <Reveal key={p.id} blur y={40} className="w-full cursor-pointer" onClick={() => onOpen(p.id)}>
              <div ref={(el) => (cardRefs.current[i] = el)} className="will-change-transform">
                <Card p={p} i={i} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="work" ref={sectionRef} className="relative" style={{ height: `${(N - 1) * VH_PER + 120}vh` }}>
      <div
        className="pointer-events-none absolute inset-0 bg-void/30"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
        }}
      />
      <div
        ref={stageRef}
        onClick={onStageClick}
        onMouseMove={onStageMove}
        onMouseLeave={onStageLeave}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute left-1/2 top-[8%] z-[200] -translate-x-1/2 text-center">
          <ChapterMark n="02" title="Selected work — descend the helix" center />
          <h2 className="display mt-4 text-[clamp(1.2rem,2.2vw,2.1rem)] font-[560] text-bone">
            Things I’ve built <span className="text-teal">that matter.</span>
          </h2>
        </div>

        {/* WebGL draws the ring as real glass; this CSS ring is only the fallback
            for visitors who get no WebGL (reduced motion) */}
        {!glass && (
        <div style={{ perspective: '1500px' }} className="relative h-full w-full">
          <div ref={ringRef} className="absolute left-1/2 top-1/2 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            {featured.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => (slots.current[i] = el)}
                onClick={() => onOpen(p.id)}
                className="group/card absolute cursor-pointer"
                style={{
                  width: CARD_W,
                  left: '50%',
                  top: '50%',
                  marginLeft: `calc(${CARD_W} / -2)`,
                  marginTop: '-150px',
                  transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px) translateY(${i * Y_GAP}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <Card p={p} i={i} />
              </div>
            ))}
          </div>
        </div>
        )}

        {/* readout of the specimen in focus */}
        <div className="absolute bottom-10 left-10 z-[200] w-[min(330px,26vw)]">
          <p className="label text-bone/35">
            {pad(activeIdx + 1)} <span className="text-bone/20">/ {pad(N)}</span>
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="label-sm mt-3" style={{ color: active.color }}>
                {active.kicker}
              </p>
              <p className="display mt-2 text-[clamp(1.1rem,1.6vw,1.6rem)] font-[600] text-bone">{active.title}</p>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-bone/55">{active.subtitle}</p>
              <button
                onClick={() => onOpen(active.id)}
                className="label mt-4 text-[10px] text-teal transition-colors hover:text-bone"
              >
                Open specimen →
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* the rail — every featured piece, the one in focus lit */}
        <ul className="absolute right-16 top-1/2 z-[200] flex -translate-y-1/2 flex-col gap-2.5">
          {featured.map((p, i) => (
            <li key={p.id}>
              <button
                onClick={() => goTo(i)}
                className={`label-sm flex items-center justify-end gap-3 transition-colors duration-300 ${
                  i === activeIdx ? 'text-bone' : 'text-bone/30 hover:text-bone/60'
                }`}
              >
                {p.title}
                <span
                  className="h-px transition-all duration-500"
                  style={{ width: i === activeIdx ? 28 : 10, background: i === activeIdx ? p.color : 'rgba(236,230,218,.25)' }}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
