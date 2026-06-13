import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const WORDS = [
  'keeps people alive.',
  'lets surgeons see more.',
  'travels to every hospital.',
  'turns data into healing.',
]

export default function RotatingHook() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className="text-bone/70">I build technology that</span>
      <span className="relative inline-block h-[1.2em] overflow-hidden align-baseline">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-110%', opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="block whitespace-nowrap text-teal text-glow-teal"
          >
            {WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
