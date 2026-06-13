import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/scroll'

/**
 * Wires Lenis inertia scrolling into GSAP's ticker + ScrollTrigger so every
 * pinned / scrubbed animation reads the smoothed scroll position. Returns the
 * live Lenis instance via the `onReady` callback (for programmatic scrollTo).
 */
export function useSmoothScroll({ enabled = true, onReady } = {}) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    onReady?.(lenis)

    // settle pins/positions after fonts + layout
    const refresh = () => ScrollTrigger.refresh()
    const t = setTimeout(refresh, 350)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [enabled])
}
