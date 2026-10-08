import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/scroll'
import { asset } from '../lib/asset'
import RotatingHook from '../components/RotatingHook'
import Glass from '../components/Glass'
import NavCapsule from '../components/NavCapsule'
import OrbitRings from '../components/OrbitRings'

const ease = [0.16, 1, 0.3, 1]
const up = {
  hidden: { opacity: 0, y: 26, filter: 'blur(14px)' },
  show: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.12, duration: 1.1, ease },
  }),
}

const CREDS = ['IEEE EMBC ’26 · Toronto', 'IEEE TENCON ’26 · Bali', 'President · BMESI']

export default function Hero({ ready, scrollTo }) {
  const wrap = useRef(null)
  const inner = useRef(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.to(inner.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrap} className="relative h-[100svh] w-full overflow-hidden">
      <div
        ref={inner}
        className="absolute inset-0"
        style={{
          // feather the bottom so the hero dissolves into the next scene
          WebkitMaskImage: 'linear-gradient(to bottom, #000 84%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 84%, transparent 100%)',
        }}
      >
        {/* the specimen, inside its own instrument */}
        {/* positioning and animation live on separate elements — framer writes
            its own inline transform, which would wipe Tailwind's translate */}
        <div className="pointer-events-none absolute right-[-42%] top-[62%] z-[4] aspect-square w-[140vw] -translate-y-1/2 sm:right-[-6%] sm:top-[44%] sm:w-[min(62vw,860px)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 2.2, ease }}
            className="h-full w-full"
          >
            <OrbitRings className="h-full w-full" label="SPECIMEN 01 · 62 BPM" />
          </motion.div>
        </div>

        <motion.img
          src={asset('sudu.png')}
          alt="Sudarshan Vasanthakumar"
          onError={(e) => (e.currentTarget.style.opacity = 0)}
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1.4, ease }}
          className="absolute bottom-0 right-[-8%] z-[10] h-[46%] max-w-none object-contain object-bottom sm:right-[4%] sm:h-[94%]"
          style={{ filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.7))' }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-[5] h-full w-3/5"
          style={{ background: 'radial-gradient(55% 55% at 72% 52%, rgba(0,229,196,0.08), transparent 70%)' }}
        />

        {/* phones lift the text off the figure from below; desktop keeps a side scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/55 via-transparent via-55% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/20 sm:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-void/90 via-void/25 to-transparent sm:block" />

        {/* phones: the column sits in the upper half so nothing lands on the face */}
        <div className="absolute inset-y-0 left-6 right-6 z-[20] flex flex-col justify-start pt-[12vh] sm:left-[10%] sm:right-auto sm:max-w-[62%] sm:justify-center sm:pt-0 lg:left-[14%] lg:max-w-[56%]">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 1, ease }}
            className="mb-8 sm:mb-10"
          >
            <NavCapsule scrollTo={scrollTo} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 1 }}
            className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4"
          >
            <span className="h-px w-8 shrink-0 bg-teal/60 sm:w-14" />
            <span className="label whitespace-nowrap text-teal">Coimbatore → Toronto → Bali</span>
          </motion.div>

          <h1 className="display text-bone">
            <motion.span
              custom={0}
              variants={up}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              className="block text-[clamp(2.3rem,10.6vw,3.2rem)] font-[640] will-change-[transform,filter] sm:text-[clamp(3rem,5.4vw,6.6rem)]"
              style={{ textShadow: '0 6px 60px rgba(0,0,0,0.85)' }}
            >
              Sudarshan
            </motion.span>
            <motion.span
              custom={1}
              variants={up}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              className="mt-[0.18em] block text-[clamp(1.1rem,5.6vw,1.7rem)] font-[280] tracking-[0.01em] text-bone/85 will-change-[transform,filter] sm:text-[clamp(1.3rem,2.75vw,3.3rem)]"
              style={{ textShadow: '0 6px 60px rgba(0,0,0,0.85)' }}
            >
              Vasanthakumar
            </motion.span>
          </h1>

          <motion.p
            custom={2}
            variants={up}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            className="label mt-5 text-teal sm:mt-7"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
          >
            Biomedical engineer · Researcher · Builder
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-4 font-body text-[17px] leading-snug sm:mt-5 sm:text-[21px]"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
          >
            <RotatingHook />
          </motion.div>

          {/* credentials — the first thing a recruiter should be able to read */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.25, duration: 1 }}
            className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 sm:mt-6"
          >
            {CREDS.map((c) => (
              <li key={c} className="label-sm flex items-center gap-2 text-bone/55">
                <span className="h-1 w-1 rounded-full bg-crimson" />
                {c}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.35, duration: 0.9, ease }}
            className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9"
          >
            <Glass
              as="button"
              onClick={() => scrollTo?.('#work')}
              className="rounded-full px-6 py-3 text-bone transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="label text-[11px] text-bone">View work →</span>
            </Glass>
            <button
              onClick={() => scrollTo?.('#contact')}
              className="label rounded-full px-5 py-3 text-[11px] text-bone/70 transition-colors duration-300 hover:text-teal sm:px-6"
            >
              Get in touch
            </button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-6 z-[20] flex flex-col items-center gap-2 text-bone/35 sm:right-10"
      >
        <span className="label-sm">Scroll</span>
        <span className="animate-drift text-sm">↓</span>
      </motion.div>
    </section>
  )
}
