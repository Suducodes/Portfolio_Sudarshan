import { Reveal, RevealLines } from '../components/anim/Reveal'
import Tilt3D from '../components/anim/Tilt3D'
import { research, publications } from '../data/resume'

const ACCENT = { Computational: '#00E5C4', 'Wet-lab': '#8b7bd8' }

export default function Research() {
  return (
    <section id="research" className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal as="p" className="mb-4 flex items-center gap-4 font-body text-[11px] uppercase tracking-[0.4em] text-teal/70">
          <span className="inline-block h-px w-12 bg-teal/50" />
          Research
        </Reveal>
        <RevealLines
          as="h2"
          className="mb-16 font-serif text-[clamp(2rem,5vw,4rem)] font-500 uppercase leading-[0.95] tracking-tight text-bone"
          lines={[<>From bench</>, <span key="m" className="text-teal">to model.</span>]}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {research.map((r, i) => {
            const c = ACCENT[r.tag] || '#00E5C4'
            return (
              <Reveal key={r.title} delay={(i % 2) * 0.08} blur y={50}>
                <Tilt3D
                  className="group relative h-full overflow-hidden rounded-2xl border border-white/10 p-7 sm:p-8"
                  style={{
                    background: 'linear-gradient(155deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 55%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 40px 90px -50px rgba(0,0,0,0.9)',
                  }}
                >
                  {/* accent glow */}
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
                    style={{ background: c }}
                  />
                  {/* floating index — parallax depth */}
                  <span
                    className="pointer-events-none absolute right-5 top-3 font-display text-6xl font-700 leading-none text-white/[0.05]"
                    style={{ transform: 'translateZ(40px)' }}
                  >
                    0{i + 1}
                  </span>

                  <div className="relative flex items-center justify-between" style={{ transform: 'translateZ(28px)' }}>
                    <span
                      className="rounded-full px-3 py-1 font-body text-[10px] uppercase tracking-[0.2em]"
                      style={{ background: `${c}1a`, color: c }}
                    >
                      {r.tag}
                    </span>
                    <span className="font-body text-[11px] tracking-wide text-bone/40">{r.year}</span>
                  </div>
                  <h3
                    className="mt-5 font-display text-xl font-600 leading-tight tracking-tight text-bone"
                    style={{ transform: 'translateZ(22px)' }}
                  >
                    {r.title}
                  </h3>
                  <p className="mt-1.5 font-body text-[13px] text-bone/50" style={{ transform: 'translateZ(16px)' }}>
                    {r.sub}
                  </p>
                  <ul className="mt-4 space-y-2" style={{ transform: 'translateZ(10px)' }}>
                    {r.points.map((p) => (
                      <li key={p} className="flex gap-2.5 font-body text-[13px] leading-relaxed text-bone/70">
                        <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: c }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Tilt3D>
              </Reveal>
            )
          })}
        </div>

        {/* publications */}
        <Reveal as="p" className="mb-6 mt-20 flex items-center gap-4 font-body text-[11px] uppercase tracking-[0.4em] text-teal/70">
          <span className="inline-block h-px w-12 bg-teal/50" />
          Publications & Conferences
        </Reveal>
        <div className="flex flex-col">
          {publications.map((p) => (
            <Reveal
              key={p.n}
              className="group grid grid-cols-[auto_1fr] gap-5 border-t border-bone/10 py-6 last:border-b sm:gap-8"
            >
              <span className="font-display text-sm tracking-[0.2em] text-teal/60">[{p.n}]</span>
              <div>
                <p className="font-body text-[15px] leading-relaxed text-bone/85">{p.cite}</p>
                <p className="mt-1.5 font-body text-[12px] uppercase tracking-[0.12em] text-teal/70">
                  {p.venue}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
