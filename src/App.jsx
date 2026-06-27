import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'

import Loader from './components/Loader'
import Nav from './components/Nav'
import ScrollHud from './components/ScrollHud'
import VitalHud from './components/VitalHud'
import ProjectDetail from './components/ProjectDetail'
import { projects } from './data/projects'

import Hero from './sections/Hero'
import Tagline from './sections/Tagline'
import Works from './sections/Works'
import Research from './sections/Research'
import Skills from './sections/Skills'
import Origin from './sections/Origin'
import Recognition from './sections/Recognition'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useAmbientSound } from './hooks/useAmbientSound'
import { usePrefersReducedMotion } from './hooks/useMediaQuery'
import { scrollState } from './lib/scrollState'
import { sfx } from './lib/sfx'

const BackgroundFX = lazy(() => import('./components/fx/BackgroundFX'))

export default function App() {
  const [ready, setReady] = useState(false)
  const [openIdx, setOpenIdx] = useState(null)
  const reducedMotion = usePrefersReducedMotion()
  const { on: soundOn, toggle: toggleSound } = useAmbientSound()
  const lenisRef = useRef(null)

  useEffect(() => {
    sfx.setEnabled(soundOn)
  }, [soundOn])

  // warm the heavy WebGL chunk while the loader plays, so it mounts instantly
  // once `ready` flips — without competing for the hero's first paint
  useEffect(() => {
    if (reducedMotion) return
    const warm = () => import('./components/fx/BackgroundFX')
    const ric = window.requestIdleCallback
    const id = ric ? ric(warm) : setTimeout(warm, 800)
    return () => (ric ? window.cancelIdleCallback?.(id) : clearTimeout(id))
  }, [reducedMotion])

  const openProject = useCallback((i) => {
    setOpenIdx(i)
    sfx.whoosh()
    lenisRef.current?.stop()
  }, [])
  const closeProject = useCallback(() => {
    setOpenIdx(null)
    lenisRef.current?.start()
  }, [])
  const navProject = useCallback(
    (dir) => setOpenIdx((idx) => (idx + dir + projects.length) % projects.length),
    []
  )

  useSmoothScroll({
    enabled: !reducedMotion,
    onReady: (lenis) => {
      lenisRef.current = lenis
      lenis.on('scroll', ({ progress }) => {
        scrollState.progress = progress || 0
      })
    },
  })

  // native-scroll fallback for reduced motion (Lenis is disabled there)
  useEffect(() => {
    if (!reducedMotion) return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.progress = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion])

  // heart presence: slides up from below as Work approaches, out the top after
  useEffect(() => {
    let raf = 0
    const cl = (v) => Math.max(0, Math.min(1, v))
    const compute = () => {
      raf = 0
      const work = document.getElementById('work')
      if (!work) return
      const r = work.getBoundingClientRect()
      const vh = window.innerHeight
      // rise from below as Work approaches, exit up as it leaves — no pop
      const enter = cl(1 - r.top / (vh * 0.6))
      const exit = cl(1 - r.bottom / (vh * 0.6))
      scrollState.heartReveal = enter * (1 - exit)
      scrollState.heartY = (1 - enter) * -6 + exit * 6
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const t = setTimeout(compute, 400)
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [])

  const scrollTo = useCallback((target) => {
    const lenis = lenisRef.current
    if (target === 0) {
      lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.querySelector(target)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 8
    if (lenis) lenis.scrollTo(y)
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  return (
    <div className="grain relative">
      {!ready && <Loader onDone={() => setReady(true)} />}

      {/* atmospheric WebGL backdrop over a cheap CSS haze */}
      {!reducedMotion ? (
        <div
          className="fixed inset-0 z-0 bg-void"
          style={{
            backgroundImage:
              'radial-gradient(70% 55% at 72% 38%, rgba(0,229,196,0.10), transparent 60%), radial-gradient(50% 50% at 25% 80%, rgba(139,123,216,0.07), transparent 70%)',
          }}
        >
          {/* mount the heavy WebGL scene only after the loader — keeps three.js
              init + shader compile off the hero's paint/interaction path */}
          {ready && (
            <Suspense fallback={<div className="h-full w-full bg-void" />}>
              <BackgroundFX />
            </Suspense>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-void">
          <div className="absolute left-1/2 top-1/3 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
        </div>
      )}

      {/* readability scrim — darkens the text side, lets the helix glow on the right */}
      <div className="pointer-events-none fixed inset-0 z-[5] bg-gradient-to-r from-void/85 via-void/35 to-transparent" />

      {/* cinematic vignette — binds the imagery + UI into one frame */}
      <div
        className="pointer-events-none fixed inset-0 z-[45]"
        style={{ background: 'radial-gradient(125% 100% at 50% 42%, transparent 56%, rgba(0,0,0,0.5) 100%)' }}
      />

      <Nav scrollTo={scrollTo} soundOn={soundOn} onToggleSound={toggleSound} />
      <ScrollHud />
      <VitalHud beating={soundOn} />

      <main className="relative z-10">
        <Hero ready={ready} scrollTo={scrollTo} />
        <Tagline />
        <Works onOpen={openProject} />
        <Research />
        <Skills />
        <Origin />
        <Recognition />
        <Contact />
        <Footer scrollTo={scrollTo} />
      </main>

      <ProjectDetail
        project={openIdx != null ? projects[openIdx] : null}
        index={openIdx ?? 0}
        total={projects.length}
        onClose={closeProject}
        onNav={navProject}
      />
    </div>
  )
}
