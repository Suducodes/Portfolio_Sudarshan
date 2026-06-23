import { Reveal, RevealLines } from '../components/anim/Reveal'
import { skillGroups, awards } from '../data/resume'

export default function Skills() {
  return (
    <section className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal as="p" className="mb-4 flex items-center gap-4 font-body text-[11px] uppercase tracking-[0.4em] text-teal/70">
          <span className="inline-block h-px w-12 bg-teal/50" />
          Capabilities
        </Reveal>
        <RevealLines
          as="h2"
          className="mb-16 font-serif text-[clamp(2rem,5vw,4rem)] font-500 uppercase leading-[0.95] tracking-tight text-bone"
          lines={[<>Built across</>, <span key="m" className="text-teal">wet &amp; dry.</span>]}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.label} delay={(i % 3) * 0.06}>
              <div
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-[transform,background-color,border-color] duration-500 hover:-translate-y-1 hover:border-teal/30 hover:bg-white/[0.05]"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
              >
                {/* hover bloom in the corner */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <p className="relative flex items-center gap-2.5 font-body text-[11px] uppercase tracking-[0.3em] text-teal/75">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(0,229,196,0.8)]" />
                  {g.label}
                </p>
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/5 bg-bone/[0.05] px-2.5 py-1 font-body text-[12px] tracking-wide text-bone/70 transition-colors hover:border-teal/40 hover:bg-teal/10 hover:text-teal"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* awards strip */}
        <Reveal as="p" className="mb-6 mt-20 flex items-center gap-4 font-body text-[11px] uppercase tracking-[0.4em] text-teal/70">
          <span className="inline-block h-px w-12 bg-teal/50" />
          Awards & Honours
        </Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {awards.map((a, i) => (
            <Reveal key={a} delay={(i % 2) * 0.05}>
              <div className="group relative flex h-full items-start gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-[background-color,border-color] duration-500 hover:border-teal/30 hover:bg-white/[0.045]">
                <span className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-teal/60 transition-transform duration-500 group-hover:scale-y-100" />
                <span className="font-display text-lg font-700 leading-none text-teal/35 transition-colors duration-500 group-hover:text-teal/80">
                  0{i + 1}
                </span>
                <p className="font-body text-[14px] leading-snug text-bone/80">{a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
