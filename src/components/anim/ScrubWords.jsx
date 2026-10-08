import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/scroll'

/**
 * The Parallel Universe read: every word sits out of focus and dim until the
 * scroll reaches it, then snaps sharp — so the eye is pulled along the line at
 * the pace you scroll. `parts` is [{ t: 'text', accent?: true }]; a plain
 * string works too.
 */
export default function ScrubWords({
  parts,
  as: Tag = 'p',
  className = '',
  accentClass = 'text-teal',
  start = 'top 80%',
  end = 'bottom 45%',
  scrub = 0.6,
  trigger, // selector — use the section when this sits inside a sticky scene
}) {
  const ref = useRef(null)
  const segs = typeof parts === 'string' ? [{ t: parts }] : parts

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll('[data-w]')
    const trig = (trigger && document.querySelector(trigger)) || el
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.1, filter: 'blur(7px)', y: 6 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          ease: 'none',
          stagger: 0.6,
          scrollTrigger: { trigger: trig, start, end, scrub },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [start, end, scrub, trigger])

  let k = 0
  return (
    <Tag ref={ref} className={className}>
      {segs.map((s, si) =>
        s.t.split(/(\s+)/).map((w, wi) =>
          /^\s+$/.test(w) || !w ? (
            w
          ) : (
            <span key={`${si}-${wi}-${k++}`} data-w className={`inline-block ${s.accent ? accentClass : ''}`}>
              {w}
            </span>
          )
        )
      )}
    </Tag>
  )
}
