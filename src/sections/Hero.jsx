import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../lib/scroll'
import { asset } from '../lib/asset'
import RotatingHook from '../components/RotatingHook'

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

export default function Hero({ ready }) {
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
      <div ref={inner} className="absolute inset-0">
        {/* gentle depth + bottom blend over the calm live scene */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-transparent" />

        {/* centred composition wrapper — keeps name + figure together on 16:9 */}
        <div className="relative mx-auto h-full w-full max-w-[1320px]">
        {/* figure — natural, anchored bottom-right (clear of the text) */}
        <motion.img
          src={asset('sudu.png')}
          alt="Sudarshan Vasanthakumar"
          onError={(e) => (e.currentTarget.style.opacity = 0)}
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1.4, ease }}
          className="absolute bottom-0 right-0 z-[10] h-[64%] max-w-none object-contain object-bottom sm:h-[88%]"
          style={{ filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.7))' }}
        />

        {/* name block — left, vertically centred, never crossing the face */}
        <div className="absolute inset-y-0 left-6 z-[20] flex max-w-[68%] flex-col justify-center sm:left-10 md:max-w-[52%]">
          <h1 className="font-serif uppercase leading-[0.86] tracking-tight text-bone">
            <motion.span
              custom={0}
              variants={up}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              className="block text-[clamp(2rem,7vw,6.5rem)] will-change-[transform,filter]"
              style={{ textShadow: '0 8px 50px rgba(0,0,0,0.6)' }}
            >
              Sudarshan
            </motion.span>
            <motion.span
              custom={1}
              variants={up}
              initial="hidden"
              animate={ready ? 'show' : 'hidden'}
              className="block text-[clamp(1.45rem,5.1vw,4.6rem)] text-bone/90 will-change-[transform,filter]"
              style={{ textShadow: '0 8px 50px rgba(0,0,0,0.6)' }}
            >
              Vasanthakumar
            </motion.span>
          </h1>

          <motion.p
            custom={2}
            variants={up}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            className="mt-5 font-body text-xs uppercase tracking-[0.4em] text-teal sm:text-sm"
            style={{ textShadow: '0 2px 18px rgba(0,0,0,0.9)' }}
          >
            Biomedical Engineer · Researcher · Builder
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-6 max-w-[24ch] font-serif text-base leading-snug tracking-tight sm:text-xl"
            style={{ textShadow: '0 2px 18px rgba(0,0,0,0.9)' }}
          >
            <RotatingHook />
          </motion.div>
        </div>
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
