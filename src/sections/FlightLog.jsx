import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { publications, benchwork, home } from '../data/resume'
import ChapterMark from '../components/ChapterMark'
import Stamp from '../components/Stamp'
import { Reveal } from '../components/anim/Reveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { sfx } from '../lib/sfx'

const flights = publications.filter((p) => p.code)
// the itinerary: home, then every conference that flew me somewhere
const STOPS = [
  {
    id: 'home',
    code: home.code,
    top: 'KPRIET · COIMBATORE',
    bottom: 'INDIA · 11.08°N 77.14°E',
    date: 'EST. 2023',
    mark: 'DEPARTED',
    ink: '#00E5C4',
    venue: 'Home lab',
    city: 'Coimbatore',
    country: 'India',
    title: 'Every paper starts at a desk in the biomedical department of KPRIET.',
    note: 'B.E. Biomedical Engineering · CGPA 8.5 · Rank 3',
  },
  ...flights.map((f) => ({
    ...f,
    top: f.venue.toUpperCase(),
    bottom: `${f.city} · ${f.country}`.toUpperCase(),
    date: f.when,
    mark: 'ADMITTED',
  })),
]

function StopCard({ s, onOpen }) {
  return (
    <>
      <p className="label-sm" style={{ color: s.ink }}>
        {s.venue} {s.full ? `· ${s.full}` : ''}
      </p>
      <p className="display mt-3 text-[clamp(1.3rem,2.4vw,2.2rem)] font-[560] text-bone">
        {s.city}
        <span className="text-bone/35">, {s.country}</span>
      </p>
      <p className="mt-4 max-w-md font-body text-[15px] leading-relaxed text-bone/75">{s.title}</p>
      <p className="label-sm mt-4 text-bone/40">{s.note}</p>
      {s.project && (
        <button onClick={() => onOpen(s.project)} className="label mt-5 text-[10px] text-teal transition-colors hover:text-bone">
          Open the project →
        </button>
      )}
    </>
  )
}

/** The route bar: three airports and a plane between them. */
function Route({ p }) {
  return (
    <div className="relative">
      <div className="relative h-px w-full bg-bone/15">
        <div className="absolute left-0 top-0 h-px bg-teal" style={{ width: `${p * 100}%`, boxShadow: '0 0 8px rgba(0,229,196,.7)' }} />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[13px] text-teal"
          style={{ left: `${p * 100}%` }}
        >
          ✈
        </span>
      </div>
      <div className="mt-3 flex justify-between">
        {STOPS.map((s, i) => (
          <span key={s.id} className={`label-sm ${i === 0 ? 'text-left' : i === STOPS.length - 1 ? 'text-right' : 'text-center'}`}>
            <span className="text-bone/70">{s.code}</span>
            <span className="block text-bone/30">{s.city}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function FlightLog({ onOpen }) {
  const desktop = useMediaQuery('(min-width: 880px)')
  const sectionRef = useRef(null)
  const [stop, setStop] = useState(0)
  const [prog, setProg] = useState(0)

  useEffect(() => {
    if (!desktop) return
    let raf = 0
    let last = -1
    const tick = () => {
      raf = 0
      const s = sectionRef.current
      if (!s) return
      const r = s.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, s.offsetHeight - window.innerHeight)))
      setProg(p)
      const i = p < 0.2 ? 0 : p < 0.6 ? 1 : 2
      if (i !== last) {
        if (last !== -1) sfx.tick()
        last = i
        setStop(i)
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', on, { passive: true })
    tick()
    return () => {
      window.removeEventListener('scroll', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [desktop])

  const s = STOPS[stop]
  // the route bar's plane moves exactly when the globe draws each flight
  // (same keyframes as Globe.jsx: CBE→YYZ over 0.12–0.42, CBE→DPS 0.62–0.88)
  const sm = (a, b, x) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  const planeP = 0.5 * sm(0.12, 0.42, prog) + 0.5 * sm(0.62, 0.88, prog)

  return (
    <section id="research" className="relative w-full">
      {/* the pin gets its own box, so the record below can't scroll over the stage */}
      <div id="research-pin" ref={sectionRef} style={{ height: desktop ? '300vh' : 'auto' }}>
      {desktop ? (
        <div className="sticky top-0 h-screen w-full overflow-hidden px-10">
          <div className="absolute left-10 right-10 top-24">
            <ChapterMark n="04" title="Flight log — research" meta={`${flights.length} papers abroad · 2 continents`} />
          </div>

          <div className="absolute left-10 top-[30%] w-[min(440px,36vw)]">
            <h2 className="display text-[clamp(1.5rem,2.7vw,2.6rem)] font-[560] text-bone">
              Research that <br />
              crossed <span className="text-teal">two oceans.</span>
            </h2>
            <div className="mt-10 min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StopCard s={s} onOpen={onOpen} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* the stamp lands on the globe's lower edge, like a postcard corner */}
          <div className="absolute left-[50%] top-[70%] -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
                transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.9 }}
              >
                <Stamp
                  code={s.code}
                  top={s.top}
                  bottom={s.bottom}
                  date={s.date}
                  mark={s.mark}
                  ink={s.ink}
                  size={250}
                  rotate={stop === 1 ? -9 : stop === 2 ? 7 : -3}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* sits above the 62 BPM monitor that owns the bottom edge */}
          <div className="absolute bottom-[104px] left-10 right-10">
            <Route p={planeP} />
          </div>
        </div>
      ) : (
        <div className="px-6 pb-10 pt-28">
          <ChapterMark n="04" title="Flight log — research" />
          <h2 className="display mt-8 text-[clamp(1.45rem,7vw,2rem)] font-[560] text-bone">
            Research that crossed <span className="text-teal">two oceans.</span>
          </h2>
          {/* the globe (WebGL, behind) rides in this gap with the chapter */}
          <div className="h-[36vh]" aria-hidden />
          <div className="mt-4 flex flex-col gap-16">
            {STOPS.map((st, i) => (
              <Reveal key={st.id} y={30}>
                <Stamp code={st.code} top={st.top} bottom={st.bottom} date={st.date} mark={st.mark} ink={st.ink} size={200} rotate={i % 2 ? 7 : -7} />
                <div className="mt-6">
                  <StopCard s={st} onOpen={onOpen} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* the full record */}
      <div className="relative px-6 pb-28 pt-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="label text-bone/45">Papers & posters</p>
              <ol className="mt-6 border-t border-bone/10">
                {publications.map((p, i) => (
                  <Reveal as="li" key={p.id} y={16} className="grid grid-cols-[34px_1fr] gap-4 border-b border-bone/10 py-5">
                    <span className="label-sm pt-1 text-bone/30">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-body text-[15px] leading-relaxed text-bone/85">“{p.title}”</p>
                      <p className="label-sm mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span style={{ color: p.ink }}>{p.venue}</span>
                        {p.city && <span className="text-bone/35">{p.city}</span>}
                        <span className="text-bone/35">{p.note}</span>
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
            <div>
              <p className="label text-bone/45">From the wet bench</p>
              <ul className="mt-6 border-t border-bone/10">
                {benchwork.map((b) => (
                  <Reveal as="li" key={b.title} y={16} className="border-b border-bone/10 py-5">
                    <p className="flex items-baseline justify-between gap-4">
                      <span className="display text-[15px] font-[520] text-bone">{b.title}</span>
                      <span className="label-sm text-bone/30">{b.year}</span>
                    </p>
                    <p className="mt-2 font-body text-[13px] leading-relaxed text-bone/55">{b.line}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
