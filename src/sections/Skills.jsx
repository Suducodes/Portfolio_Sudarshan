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

        <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.label} delay={(i % 3) * 0.06}>
              <p className="font-body text-[11px] uppercase tracking-[0.3em] text-teal/70">{g.label}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-bone/[0.05] px-2.5 py-1 font-body text-[12px] tracking-wide text-bone/70 transition-colors hover:bg-teal/10 hover:text-teal"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* awards strip */}
        <Reveal as="p" className="mb-6 mt-20 flex items-center gap-4 font-body text-[11px] uppercase tracking-[0.4em] text-teal/70">
          <span className="inline-block h-px w-12 bg-teal/50" />
          Awards & Honours
        </Reveal>
        <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {awards.map((a, i) => (
            <Reveal
              key={a}
              delay={(i % 2) * 0.05}
              className="flex gap-3 border-t border-bone/10 py-4 font-body text-[14px] leading-snug text-bone/75"
            >
              <span className="mt-1 text-teal">✦</span>
              {a}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
