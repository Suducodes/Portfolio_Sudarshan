import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/scroll'

/**
 * Fades/slides an element in once as it enters the viewport.
 */
export function Reveal({
  as: Tag = 'div',
  y = 40,
  delay = 0,
  duration = 1.1,
  start = 'top 85%',
  blur = false,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, ...(blur ? { filter: 'blur(14px)' } : {}) },
        {
          autoAlpha: 1,
          y: 0,
          ...(blur ? { filter: 'blur(0px)' } : {}),
          duration,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start },
        }
      )
    }, el)
    return () => ctx.revert()
  }, [y, delay, duration, start, blur])

  return (
    <Tag ref={ref} className={className} style={{ visibility: 'hidden' }} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Line-by-line mask reveal for big editorial type.
 * `lines` is an array of strings (or JSX); each rises from its own clip.
 */
export function RevealLines({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  stagger = 0.12,
  start = 'top 82%',
  duration = 1.15,
  blur = false,
}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const inners = el.querySelectorAll('[data-line-inner]')
    const ctx = gsap.context(() => {
      if (blur) {
        // Parallel-Universe "unveil": out of focus + dim, then snaps sharp.
        gsap.fromTo(
          inners,
          { autoAlpha: 0, filter: 'blur(16px)', y: 24 },
          {
            autoAlpha: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: duration + 0.3,
            ease: 'power2.out',
            stagger,
            scrollTrigger: { trigger: el, start },
          }
        )
      } else {
        gsap.fromTo(
          inners,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration,
            ease: 'expo.out',
            stagger,
            scrollTrigger: { trigger: el, start },
          }
        )
      }
    }, el)
    return () => ctx.revert()
  }, [lines, stagger, start, duration, blur])

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={blur ? 'block' : 'reveal-line'}>
          <span data-line-inner className={`block will-change-[transform,filter] ${lineClassName}`}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
