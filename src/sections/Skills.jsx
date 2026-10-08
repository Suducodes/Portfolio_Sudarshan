import { Reveal, RevealLines } from '../components/anim/Reveal'
import { skillGroups } from '../data/resume'
import { useMediaQuery } from '../hooks/useMediaQuery'
import SynapseMap from '../components/SynapseMap'
import RibbonRack from '../components/RibbonRack'
import ChapterMark from '../components/ChapterMark'

export default function Skills() {
  // the net needs room to breathe — phones get the grouped chips instead
  const wide = useMediaQuery('(min-width: 880px)')

  return (
    <section id="capabilities" className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <ChapterMark n="06" title="Capabilities" meta="34 tools · 6 domains" className="mb-8" />
        <RevealLines
          as="h2"
          className="display mb-5 text-[clamp(1.6rem,4.4vw,3.6rem)] font-[600] text-bone"
          lines={[<>Built across</>, <span key="m" className="text-teal">wet &amp; dry.</span>]}
        />

        {wide ? (
          <>
            <Reveal as="p" className="mb-10 max-w-md font-body text-[13px] leading-relaxed text-bone/45">
              Every tool I use is wired to another. Hover a node to fire its synapses — the
              paths are the ones these skills actually travel in my projects.
            </Reveal>
            <Reveal blur y={40}>
              <SynapseMap />
            </Reveal>
          </>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {skillGroups.map((g, i) => (
              <Reveal key={g.label} delay={(i % 2) * 0.06}>
                <div
                  className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
                >
                  <p className="relative flex items-center gap-2.5 font-body text-[11px] uppercase tracking-[0.3em] text-teal/75">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(0,229,196,0.8)]" />
                    {g.label}
                  </p>
                  <div className="relative mt-4 flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-white/5 bg-bone/[0.05] px-2.5 py-1 font-body text-[12px] tracking-wide text-bone/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* the rack */}
        <ChapterMark n="07" title="Honours — the ribbon rack" meta="6 decorations" className="mb-8 mt-28" />
        <RibbonRack />
      </div>
    </section>
  )
}
