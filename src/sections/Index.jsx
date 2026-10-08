import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../data/projects'
import ChapterMark from '../components/ChapterMark'
import { Reveal } from '../components/anim/Reveal'
import ProjectMotif from '../components/fx/ProjectMotif'
import { asset } from '../lib/asset'
import { sfx } from '../lib/sfx'

const pad = (n) => String(n).padStart(2, '0')
const MOTIFS = ['ecg', 'wave', 'hex', 'scatter']

const live = (s) => s === 'Live' || s === 'In use' || s === 'Shipped'

/** What a row shows when it has no key art: the project's own line-art. */
function Plate({ p, i }) {
  if (p.image)
    return <img src={asset(p.image)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
  return (
    <div className="absolute inset-0 bg-void-2">
      <ProjectMotif motif={MOTIFS[i % MOTIFS.length]} color={p.color} className="absolute inset-0 h-full w-full opacity-70" />
      <span className="display absolute bottom-4 left-5 text-[22px] font-[600] text-bone/80">{p.title}</span>
    </div>
  )
}

/**
 * The register of everything — Parallel Universe's "all works" list. Big rows
 * you can read from across the room; on desktop the row under the pointer
 * shows its plate in a sticky pane on the right.
 */
export default function Index({ onOpen }) {
  const [hover, setHover] = useState(0)
  const hp = projects[hover]

  return (
    <section id="index" className="relative w-full px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <ChapterMark n="03" title="Index — everything I've built" meta={`${projects.length} entries · 2023 — 2026`} />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <ul className="border-t border-bone/10">
            {projects.map((p, i) => (
              <li key={p.id}>
                <Reveal y={18} start="top 92%">
                  <button
                    onClick={() => onOpen(p.id)}
                    onMouseEnter={() => {
                      setHover(i)
                      sfx.tick()
                    }}
                    onFocus={() => setHover(i)}
                    className="group grid w-full grid-cols-[28px_1fr_auto] items-baseline gap-x-4 border-b border-bone/10 py-4 text-left transition-colors duration-300 hover:bg-bone/[0.025] sm:grid-cols-[36px_1fr_160px_70px] sm:py-5"
                  >
                    <span className="label-sm text-bone/30 transition-colors group-hover:text-teal">{pad(i + 1)}</span>
                    <span className="min-w-0">
                      <span className="display block truncate text-[clamp(1.05rem,4.6vw,1.4rem)] font-[520] text-bone/85 transition-[color,transform] duration-500 ease-surgical group-hover:translate-x-2 group-hover:text-bone sm:text-[clamp(1.3rem,2.5vw,2.3rem)]">
                        {p.title}
                      </span>
                      <span className="mt-1 block truncate font-body text-[13px] text-bone/40 transition-colors group-hover:text-bone/65">
                        {p.subtitle}
                      </span>
                    </span>
                    <span className="label-sm hidden text-bone/35 sm:block">{p.discipline}</span>
                    <span className="flex flex-col items-end gap-1.5">
                      <span className="label-sm text-bone/45">{p.year}</span>
                      <span className={`label-sm flex items-center gap-1.5 ${live(p.status) ? 'text-teal/80' : 'text-bone/35'}`}>
                        {live(p.status) && <span className="h-1 w-1 rounded-full bg-teal" />}
                        {p.status}
                      </span>
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* the sticky plate */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              <div
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px]"
                style={{ border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={hp.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Plate p={hp} i={hover} />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-5 bottom-5">
                  <p className="label-sm" style={{ color: hp.color }}>
                    {hp.discipline} · {hp.year}
                  </p>
                  <p className="mt-2 font-body text-[13px] leading-relaxed text-bone/75 line-clamp-4">{hp.detail}</p>
                </div>
              </div>
              <p className="label-sm mt-4 text-bone/30">Select a row to open the specimen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
