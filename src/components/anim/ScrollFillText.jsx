import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/scroll'

/**
 * Big editorial copy that lights word-by-word as it scrolls through the
 * viewport — the Parallel-Universe "reading" effect. Accepts a string;
 * wrap emphasis words in <em>…</em> by passing JSX via `segments` instead.
 */
export default function ScrollFillText({
  text,
  className = '',
  dim = 0.14,
  start = 'top 78%',
  end = 'bottom 55%',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll('[data-word]')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: dim },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.5,
          scrollTrigger: { trigger: el, start, end, scrub: true },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [text, dim, start, end])

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-word className="inline-block">
          {w}
          {' '}
        </span>
      ))}
    </p>
  )
}
