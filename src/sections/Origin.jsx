import ScrollFillText from '../components/anim/ScrollFillText'
import { Reveal, RevealLines } from '../components/anim/Reveal'
import { asset } from '../lib/asset'

const identity = [
  { icon: '⚽', label: 'Midfielder on the field' },
  { icon: '🎹', label: 'Keyboard · singer · beatboxer' },
  { icon: '🎬', label: 'Dead Poets Society · Thalapathy · Demon Slayer' },
  { icon: '📍', label: 'Coimbatore born · Kerala roots · Toronto-bound' },
]

export default function Origin() {
  return (
    <section id="story" className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal as="p" className="mb-12 flex items-center gap-4 font-body text-[11px] uppercase tracking-[0.4em] text-teal/70">
          <span className="inline-block h-px w-12 bg-teal/50" />
          The Story — between the cell and the cosmos
        </Reveal>

        {/* portrait + defining quote */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <Reveal y={30} className="relative mx-auto w-full max-w-[340px]">
            <div
              className="absolute -inset-6 -z-10"
              style={{ background: 'radial-gradient(60% 60% at 50% 45%, rgba(0,229,196,0.22), transparent 70%)' }}
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <img
                src={asset('sudu.png')}
                alt="Sudarshan V."
                onError={(e) => {
                  if (!e.currentTarget.dataset.fb) {
                    e.currentTarget.dataset.fb = '1'
                    e.currentTarget.src = asset('portrait-placeholder.svg')
                  }
                }}
                className="h-full w-full object-cover"
              />
              {/* subtle bottom melt into the void — natural colour kept */}
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-teal/15" />
            </div>
          </Reveal>

          <RevealLines
            as="blockquote"
            blur
            className="font-serif text-[clamp(1.6rem,4vw,3.2rem)] font-500 leading-[1.18] tracking-tight text-bone"
            lines={[
              <>How does a single cell</>,
              <>know what to become?</>,
              <span key="t" className="text-bone/55">
                I build tools so surgeons see
              </span>,
              <span key="t2" className="text-bone/55">
                what <span className="text-teal">machines cannot.</span>
              </span>,
            ]}
          />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2">
          <ScrollFillText
            className="font-body text-[clamp(1.15rem,2vw,1.5rem)] leading-relaxed text-bone/80"
            text="From an NCC Air Wing cadet — Gold Best Cadet of Tamil Nadu — to a Toronto stage at EMBC: one obsession, getting closer to the moment a life is saved, and making the tools sharper."
          />

          <div className="flex flex-col justify-center gap-1">
            {identity.map((row, i) => (
              <Reveal key={row.label} delay={i * 0.06} y={20} className="flex items-center gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-bone/[0.04]">
                <span className="text-xl">{row.icon}</span>
                <span className="font-body text-[14px] text-bone/75">{row.label}</span>
              </Reveal>
            ))}
          </div>
        </div>

        {/* mission */}
        <Reveal className="mt-20 border-t border-bone/10 pt-12">
          <p className="font-body text-[11px] uppercase tracking-[0.4em] text-teal/70">
            The mission
          </p>
          <p className="mt-5 max-w-3xl font-serif text-[clamp(1.5rem,3.6vw,2.8rem)] font-500 leading-snug tracking-tight text-bone">
            To make precision medicine accessible{' '}
            <span className="text-teal text-glow-teal">everywhere</span> — not just in
            hospitals that can afford it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
