import ScrollFillText from '../components/anim/ScrollFillText'
import { Reveal, RevealLines } from '../components/anim/Reveal'
import ChapterMark from '../components/ChapterMark'
import { asset } from '../lib/asset'

const identity = [
  { k: 'Field', v: 'Midfielder' },
  { k: 'Music', v: 'Keyboard · singer · beatboxer' },
  { k: 'Screen', v: 'Dead Poets Society · Thalapathy · Demon Slayer' },
  { k: 'Roots', v: 'Coimbatore-born · Kerala roots' },
]

export default function Origin() {
  return (
    <section id="story" className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <ChapterMark n="08" title="Origin — between the cell and the cosmos" meta="Fig. 1" className="mb-14" />

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <Reveal y={30} className="relative mx-auto w-full max-w-[360px]">
            <figure>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px]" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <img
                  src={asset('sudu.png')}
                  alt="Sudarshan Vasanthakumar"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fb) {
                      e.currentTarget.dataset.fb = '1'
                      e.currentTarget.src = asset('portrait-placeholder.svg')
                    }
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/75 via-transparent to-transparent" />
                {/* registration marks, like a specimen plate */}
                {['left-3 top-3', 'right-3 top-3', 'left-3 bottom-3', 'right-3 bottom-3'].map((pos) => (
                  <span key={pos} className={`absolute ${pos} h-3 w-3 border-bone/40`} style={{ borderWidth: pos.includes('top') ? (pos.includes('left') ? '1px 0 0 1px' : '1px 1px 0 0') : pos.includes('left') ? '0 0 1px 1px' : '0 1px 1px 0' }} />
                ))}
              </div>
              <figcaption className="label-sm mt-3 flex justify-between text-bone/35">
                <span>Fig. 1 — The author</span>
                <span>11.08°N 77.14°E</span>
              </figcaption>
            </figure>
          </Reveal>

          <RevealLines
            as="blockquote"
            blur
            className="display text-[clamp(1.35rem,2.9vw,2.6rem)] font-[560] leading-[1.15] text-bone"
            lines={[
              <>How does a single cell</>,
              <>know what to become?</>,
              <span key="t" className="text-bone/45">
                I build tools so surgeons
              </span>,
              <span key="t2" className="text-bone/45">
                see what <span className="text-teal">machines cannot.</span>
              </span>,
            ]}
          />
        </div>

        <div className="mt-24 grid grid-cols-1 gap-14 md:grid-cols-2">
          <ScrollFillText
            className="font-body text-[clamp(1.15rem,2vw,1.5rem)] leading-relaxed text-bone/85"
            text="From an NCC Air Wing cadet — Gold Best Cadet of Tamil Nadu — to IEEE stages in Toronto and Bali: one obsession, getting closer to the moment a life is saved, and making the tools sharper."
          />

          <dl className="flex flex-col justify-center border-t border-bone/10">
            {identity.map((row, i) => (
              <Reveal key={row.k} delay={i * 0.05} y={16} className="grid grid-cols-[86px_1fr] items-baseline gap-4 border-b border-bone/10 py-4">
                <dt className="label-sm text-teal/80">{row.k}</dt>
                <dd className="font-body text-[14px] text-bone/75">{row.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        {/* mission */}
        <Reveal className="mt-24 border-t border-bone/10 pt-12">
          <p className="label text-bone/45">The mission</p>
          <p className="display mt-6 max-w-4xl text-[clamp(1.35rem,3.2vw,2.8rem)] font-[560] leading-[1.15] text-bone">
            To make precision medicine run on hardware{' '}
            <span className="text-teal">every hospital already owns</span> — not just the ones that can afford it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
