import { useCallback, useEffect, useRef, useState } from 'react'
import OrbitRings from './OrbitRings'
import { sfx } from '../lib/sfx'

const HOLD_MS = 1100 // a full press fills the ring in this long
const TAP_MS = 520 // a tap auto-completes, faster — nobody should get stuck
const R = 86
const C = 2 * Math.PI * R

// one beat of a lead-II ECG, drawn across the strip above the ring
const ECG =
  'M0 30 L60 30 L70 30 L78 26 L86 30 L100 30 L106 34 L114 4 L122 52 L128 30 L150 30 L164 22 L178 30 L240 30 L250 30 L258 26 L266 30 L280 30 L286 34 L294 4 L302 52 L308 30 L330 30 L344 22 L358 30 L420 30'

/**
 * The threshold. Parallel Universe makes you enter; this makes you take a
 * pulse. Press and hold: the oximeter ring fills, the flatline becomes an
 * ECG, the readout locks at 62 BPM, and the site opens. Nothing here uses
 * requestAnimationFrame — CSS transitions and timers only — so a background
 * tab can never strand it half-done.
 */
export default function Gate({ onEnter, onGone }) {
  const [phase, setPhase] = useState('idle') // idle | holding | tap | acquired | leaving
  const timer = useRef(0)
  const downAt = useRef(0)
  const doneRef = useRef(false)
  // callbacks through refs: the parent re-renders as the site arrives, and a
  // changed identity must never cancel the pending timers below
  const cb = useRef({ onEnter, onGone })
  cb.current = { onEnter, onGone }
  useEffect(() => () => clearTimeout(timer.current), [])

  const acquire = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setPhase('acquired')
    sfx.confirm()
    try {
      sessionStorage.setItem('sv-pulse', '1')
    } catch {}
    timer.current = setTimeout(() => {
      // the site starts arriving as the gate dissolves, not after it
      setPhase('leaving')
      cb.current.onEnter()
      timer.current = setTimeout(() => cb.current.onGone(), 950)
    }, 800)
  }, [])

  const press = useCallback(() => {
    if (doneRef.current) return
    downAt.current = performance.now()
    setPhase('holding')
    clearTimeout(timer.current)
    timer.current = setTimeout(acquire, HOLD_MS)
  }, [acquire])

  const release = useCallback(() => {
    if (doneRef.current) return
    clearTimeout(timer.current)
    if (performance.now() - downAt.current < 260) {
      // a tap: finish it for them
      setPhase('tap')
      timer.current = setTimeout(acquire, TAP_MS)
    } else {
      setPhase('idle')
    }
  }, [acquire])

  useEffect(() => {
    const key = (e) => {
      if (e.repeat) return
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        e.type === 'keydown' ? press() : release()
      }
    }
    window.addEventListener('keydown', key)
    window.addEventListener('keyup', key)
    return () => {
      window.removeEventListener('keydown', key)
      window.removeEventListener('keyup', key)
    }
  }, [press, release])

  const filling = phase === 'holding' || phase === 'tap'
  const full = phase === 'acquired' || phase === 'leaving'
  const dur = phase === 'holding' ? HOLD_MS : phase === 'tap' ? TAP_MS : 420
  const offset = filling || full ? 0 : C

  return (
    <div
      className="fixed inset-0 z-[100] flex select-none flex-col items-center justify-center bg-void"
      style={{
        opacity: phase === 'leaving' ? 0 : 1,
        transform: phase === 'leaving' ? 'scale(1.06)' : 'none',
        filter: phase === 'leaving' ? 'blur(8px)' : 'none',
        transition: 'opacity .9s cubic-bezier(.7,0,.3,1), transform .9s cubic-bezier(.7,0,.3,1), filter .9s',
        pointerEvents: phase === 'leaving' ? 'none' : 'auto',
      }}
    >
      {/* atmosphere + the instrument */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: full
            ? 'radial-gradient(40% 40% at 50% 52%, rgba(224,48,58,0.18), transparent 70%)'
            : 'radial-gradient(40% 40% at 50% 52%, rgba(0,229,196,0.07), transparent 70%)',
          transition: 'background .6s',
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(150vw,92vh)] -translate-x-1/2 -translate-y-1/2 opacity-70">
        <OrbitRings className="h-full w-full" rings={[0.3, 0.5, 0.72]} />
      </div>

      <p className="label-sm absolute left-6 top-6 text-bone/45 sm:left-10 sm:top-8">Specimen 01</p>
      <p className="label-sm absolute right-6 top-6 text-bone/45 sm:right-10 sm:top-8">
        {full ? '62' : '--'} BPM
      </p>

      <p className="label relative text-bone/60">Sudarshan Vasanthakumar</p>

      {/* the strip: a flatline that becomes a beat as you hold */}
      <svg viewBox="0 0 420 60" className="relative mt-6 h-[40px] w-[min(320px,78vw)]" aria-hidden>
        <path d="M0 30 L420 30" stroke="rgba(236,230,218,0.14)" strokeWidth="1.2" fill="none" />
        <path
          d={ECG}
          fill="none"
          stroke={full ? '#E0303A' : '#00E5C4'}
          strokeWidth="1.8"
          strokeLinejoin="round"
          pathLength="1"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: filling || full ? 0 : 1,
            transition: `stroke-dashoffset ${dur}ms linear, stroke .4s`,
            filter: `drop-shadow(0 0 6px ${full ? 'rgba(224,48,58,.8)' : 'rgba(0,229,196,.7)'})`,
          }}
        />
      </svg>

      <button
        type="button"
        aria-label="Hold to take a pulse and enter the site"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId)
          press()
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}
        className="group relative mt-6 flex h-[200px] w-[200px] touch-none items-center justify-center rounded-full outline-none"
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(236,230,218,0.12)" strokeWidth="2" />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={full ? '#E0303A' : '#00E5C4'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={C}
            style={{
              strokeDashoffset: offset,
              transition: `stroke-dashoffset ${dur}ms ${filling ? 'linear' : 'cubic-bezier(.2,.8,.2,1)'}, stroke .4s`,
              filter: `drop-shadow(0 0 8px ${full ? 'rgba(224,48,58,.9)' : 'rgba(0,229,196,.8)'})`,
            }}
          />
        </svg>
        {/* the sensor pad */}
        <span
          className="flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full transition-transform duration-300 group-active:scale-95"
          style={{
            background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 70%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          {/* fingertip */}
          <svg width="30" height="38" viewBox="0 0 30 38" fill="none" stroke={full ? '#E0303A' : '#ECE6DA'} strokeWidth="1.4" opacity="0.8">
            <path d="M8 36V14a7 7 0 0 1 14 0v22" />
            <path d="M12 36V15a3 3 0 0 1 6 0v21" opacity="0.6" />
            <path d="M15 13v-1" />
          </svg>
          <span className="label mt-3 text-[10px] text-bone/80">{full ? 'Acquired' : filling ? 'Reading…' : 'Hold'}</span>
        </span>
      </button>

      <p className="label-sm relative mt-8 text-center text-bone/45">
        {full ? 'Signal acquired · 62 BPM' : 'Press & hold to take a pulse'}
      </p>
      <p className="label-sm absolute bottom-7 text-center text-bone/25 sm:bottom-9">
        Biomedical engineer · Coimbatore → Toronto → Bali
      </p>
    </div>
  )
}
