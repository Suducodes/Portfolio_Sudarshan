import { Reveal } from './anim/Reveal'
import { awards } from '../data/resume'

/**
 * Honours rendered as a military service-ribbon rack — the visual language the
 * NCC awards actually come from. Each bar is woven from hard-stop gradient
 * stripes, framed in metal, with a specular sweep that catches the light.
 */
const TIER = {
  gold: {
    frame: 'linear-gradient(145deg,#F5D98B,#C9962F 45%,#8A6414)',
    glow: 'rgba(232,192,99,0.55)',
    ink: '#3A2A08',
    label: 'Gold',
  },
  silver: {
    frame: 'linear-gradient(145deg,#EDEFF2,#A9B0B8 45%,#6C737B)',
    glow: 'rgba(220,228,236,0.35)',
    ink: '#22262B',
    label: 'Silver',
  },
  bronze: {
    frame: 'linear-gradient(145deg,#E3B48C,#B0763F 45%,#77471E)',
    glow: 'rgba(200,140,90,0.3)',
    ink: '#2E1C0C',
    label: 'Bronze',
  },
}

// hard-stop stripes → a crisp woven ribbon rather than a blur
const weave = (cols) => {
  const w = 100 / cols.length
  return `linear-gradient(90deg, ${cols
    .map((c, i) => `${c} ${(i * w).toFixed(3)}%, ${c} ${((i + 1) * w).toFixed(3)}%`)
    .join(', ')})`
}

export default function RibbonRack() {
  return (
    <ul className="flex flex-col gap-2.5">
      {awards.map((a, i) => {
        const t = TIER[a.tier] || TIER.bronze
        return (
          <Reveal as="li" key={a.title} delay={i * 0.05} y={22}>
            <div
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.022] px-4 py-3.5 transition-[transform,background-color,border-color] duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] sm:gap-5 sm:px-5"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
            >
              {/* the ribbon bar */}
              <div className="relative shrink-0" style={{ filter: `drop-shadow(0 4px 10px ${t.glow})` }}>
                <div
                  className="relative h-9 w-[74px] overflow-hidden rounded-[3px] p-[2px] sm:w-[104px]"
                  style={{ background: t.frame }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[2px]" style={{ background: weave(a.ribbon) }}>
                    {/* silk shading across the weave */}
                    <span
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.02) 38%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.42))',
                      }}
                    />
                    {/* specular sweep — runs on hover */}
                    <span
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-sheen"
                      style={{
                        background: 'linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.55) 50%, transparent 66%)',
                        backgroundSize: '250% 100%',
                      }}
                    />
                  </div>
                </div>

                {/* the metal device pinned on the bar */}
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-[19px] w-[19px] items-center justify-center rounded-full font-display text-[10px] font-700 leading-none"
                  style={{
                    background: t.frame,
                    color: t.ink,
                    boxShadow: `0 0 10px ${t.glow}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                  }}
                >
                  {a.device}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-display text-[14px] font-600 leading-snug tracking-tight text-bone sm:text-[15px]">
                  {a.title}
                </p>
                <p className="mt-0.5 font-body text-[12px] leading-snug text-bone/45">{a.detail}</p>
              </div>

              <span className="shrink-0 self-start font-body text-[11px] tracking-widest text-bone/35">{a.year}</span>
            </div>
          </Reveal>
        )
      })}
    </ul>
  )
}
