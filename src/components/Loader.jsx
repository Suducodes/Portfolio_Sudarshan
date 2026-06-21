import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ onDone }) {
  const [done, setDone] = useState(false)
  const [count, setCount] = useState(0)
  const pathRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    if (path) {
      const len = path.getTotalLength()
      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${len}`
      path.getBoundingClientRect()
      path.style.transition = 'stroke-dashoffset 1.05s cubic-bezier(0.7,0,0.3,1)'
      path.style.strokeDashoffset = '0'
    }
    const start = performance.now()
    const DUR = 1100
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / DUR)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setDone(true), 120)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg width="360" height="120" viewBox="0 0 360 120" fill="none" className="max-w-[78vw]">
            <path
              ref={pathRef}
              d="M0 60 H120 L132 60 L140 28 L150 98 L160 16 L170 60 L182 60 H240 L252 60 L260 46 L270 74 L280 60 H360"
              stroke="#00E5C4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,196,0.7))' }}
            />
          </svg>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-5xl font-500 tabular-nums tracking-tight text-bone">
              {count}
            </span>
            <span className="font-body text-[11px] uppercase tracking-[0.5em] text-bone/40">
              establishing signal
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
