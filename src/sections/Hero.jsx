import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/scroll'
import { asset } from '../lib/asset'
import RotatingHook from '../components/RotatingHook'
import Glass from '../components/Glass'
import NavCapsule from '../components/NavCapsule'

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
          // feather the hero's bottom so its scrims + figure dissolve into the
          // nebula instead of ending on a hard line where the next section starts
          WebkitMaskImage: 'linear-gradient(to bottom, #000 84%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 84%, transparent 100%)',
        }}
      >
        {/* figure — right, fully visible */}
        <motion.img
          src={asset('sudu.png')}
          alt="Sudarshan Vasanthakumar"
          onError={(e) => (e.currentTarget.style.opacity = 0)}
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1.4, ease }}
          className="absolute bottom-0 right-[4%] z-[10] h-[56%] max-w-none object-contain object-bottom sm:h-[94%]"
          style={{ filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.7))' }}
        />
        {/* soft glow behind the figure */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-[5] h-full w-3/5"
          style={{ background: 'radial-gradient(55% 55% at 72% 52%, rgba(0,229,196,0.10), transparent 70%)' }}
        />

        {/* gradients: dark at top for nav, transparent at bottom (seamless),
            left scrim so the name reads on the dark side */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/55 via-transparent via-55% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/90 via-void/25 to-transparent" />

        {/* name — left, artistic */}
        <div className="absolute inset-y-0 left-6 z-[20] flex max-w-[62%] flex-col justify-center sm:left-[14%] md:max-w-[50%] lg:left-[22%]">
          {/* glass nav capsule — anchored to the column, comfortably above the kicker */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 1, ease }}
            className="mb-10"
          >
            <NavCapsule scrollTo={scrollTo} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 1 }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="h-px w-14 bg-teal/60" />
            <span className="font-body text-[10px] uppercase tracking-[0.45em] text-teal sm:text-[11px]">
              Coimbatore → Toronto · 2026
            </span>
          </motion.div>

          <h1 className="font-serif uppercase leading-[0.82] tracking-tight text-bone">
            <motion.span
              custom={0}
              variants={up}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              className="block text-[clamp(2.4rem,8.5vw,8rem)] will-change-[transform,filter]"
              style={{ textShadow: '0 6px 60px rgba(0,0,0,0.85)' }}
            >
              Sudarshan
            </motion.span>
            <motion.span
              custom={1}
              variants={up}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              className="block text-[clamp(1.5rem,5.4vw,5rem)] text-bone/85 will-change-[transform,filter]"
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
            className="mt-5 font-body text-xs uppercase tracking-[0.38em] text-teal sm:text-sm"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
          >
            Biomedical Engineer · Researcher · Builder
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-5 font-serif text-base leading-snug tracking-tight sm:text-xl"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.95)' }}
          >
            <RotatingHook />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.35, duration: 0.9, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Glass
              as="button"
              onClick={() => scrollTo?.('#work')}
              className="rounded-full px-6 py-3 text-bone transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="font-body text-[12px] uppercase tracking-[0.22em]">View work →</span>
            </Glass>
            <button
              onClick={() => scrollTo?.('#contact')}
              className="rounded-full px-6 py-3 font-body text-[12px] uppercase tracking-[0.22em] text-bone/55 transition-colors duration-300 hover:text-teal"
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
        <span className="font-body text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="animate-drift text-sm">↓</span>
      </motion.div>
    </section>
  )
}
