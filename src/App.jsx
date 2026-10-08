import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'

import Gate from './components/Gate'
import Nav from './components/Nav'
import ScrollHud from './components/ScrollHud'
import VitalHud from './components/VitalHud'
import ProjectDetail from './components/ProjectDetail'
import { projects } from './data/projects'

import Hero from './sections/Hero'
import Premise from './sections/Premise'
import Works from './sections/Works'
import Index from './sections/Index'
import FlightLog from './sections/FlightLog'
import Office from './sections/Office'
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

const cl = (v) => Math.max(0, Math.min(1, v))
const smooth = (v) => v * v * (3 - 2 * v)

// The pulse gate shows once per session; `?nogate` skips it (for previews).
const skipGate = (() => {
  try {
    return sessionStorage.getItem('sv-pulse') === '1' || new URLSearchParams(location.search).has('nogate')
  } catch {
    return false
  }
})()

export default function App() {
  const [ready, setReady] = useState(skipGate)
  const [gateUp, setGateUp] = useState(!skipGate)
  const [openId, setOpenId] = useState(null)
  const reducedMotion = usePrefersReducedMotion()
  const { on: soundOn, toggle: toggleSound } = useAmbientSound()
  const lenisRef = useRef(null)

  useEffect(() => {
    sfx.setEnabled(soundOn)
  }, [soundOn])

  // hold the page still while the gate is up (Lenis may not exist yet on the
  // first pass, so onReady below checks this ref too)
  const gateRef = useRef(gateUp)
  gateRef.current = gateUp
  useEffect(() => {
    if (gateUp) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [gateUp])
  const enter = useCallback(() => setReady(true), [])
  const gone = useCallback(() => setGateUp(false), [])

  // warm the heavy WebGL chunk while the loader plays, so it mounts instantly
  // once `ready` flips — without competing for the hero's first paint
  useEffect(() => {
    if (reducedMotion) return
    const warm = () => import('./components/fx/BackgroundFX')
    const ric = window.requestIdleCallback
    const id = ric ? ric(warm) : setTimeout(warm, 800)
    return () => (ric ? window.cancelIdleCallback?.(id) : clearTimeout(id))
  }, [reducedMotion])

  const openProject = useCallback((id) => {
    setOpenId(id)
    sfx.whoosh()
    lenisRef.current?.stop()
  }, [])
  const closeProject = useCallback(() => {
    setOpenId(null)
    lenisRef.current?.start()
  }, [])
  const navProject = useCallback((dir) => {
    setOpenId((id) => {
      const i = projects.findIndex((p) => p.id === id)
      return projects[(i + dir + projects.length) % projects.length].id
    })
  }, [])

  useSmoothScroll({
    enabled: !reducedMotion,
    onReady: (lenis) => {
      lenisRef.current = lenis
      if (gateRef.current) lenis.stop()
      lenis.on('scroll', ({ progress, velocity }) => {
        scrollState.progress = progress || 0
        scrollState.velocity = velocity || 0
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

  /* The WebGL layer's choreography, read straight off the chapters' positions.
     The heart rises into the premise as a planet, dives into the works
     descent, and leaves after the last project; the globe and the portal
     each own their chapter. */
  useEffect(() => {
    let raf = 0
    const compute = () => {
      raf = 0
      const vh = window.innerHeight
      const premise = document.getElementById('premise')
      const work = document.getElementById('work')
      if (premise && work) {
        const pr = premise.getBoundingClientRect()
        const wr = work.getBoundingClientRect()
        const pEnter = cl(1 - pr.top / (vh * 0.9))
        const wEnter = cl(1 - wr.top / vh)
        const exit = cl(1 - wr.bottom / (vh * 0.6))
        scrollState.premiseP = cl(-pr.top / Math.max(1, pr.height - vh))
        scrollState.heartMode = smooth(wEnter)
        scrollState.heartReveal = smooth(pEnter) * (1 - exit)
        scrollState.heartY = (1 - smooth(pEnter)) * -5 + exit * 6
      }
      const research = document.getElementById('research-pin')
      if (research) {
        const r = research.getBoundingClientRect()
        scrollState.flightReveal = cl(1 - r.top / (vh * 0.8)) * (1 - cl(1 - r.bottom / (vh * 0.7)))
        scrollState.flightP = cl(-r.top / Math.max(1, r.height - vh))
        scrollState.flightTop = r.top / vh // phones pin the globe to the chapter, not the screen
      }
      const contact = document.getElementById('contact')
      if (contact) {
        const r = contact.getBoundingClientRect()
        // in with the chapter, fully out before the footer's links arrive
        scrollState.portalReveal = cl(1 - r.top / vh) * (1 - cl(1 - (r.bottom - vh * 0.25) / (vh * 0.45)))
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const t = setTimeout(compute, 400)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(t)
    }
  }, [])

  const scrollTo = useCallback((target) => {
    const lenis = lenisRef.current
    if (typeof target === 'number') {
      lenis ? lenis.scrollTo(target) : window.scrollTo({ top: target, behavior: 'smooth' })
      return
    }
    const el = document.querySelector(target)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 8
    if (lenis) lenis.scrollTo(y)
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  const openIdx = openId ? projects.findIndex((p) => p.id === openId) : -1

  return (
    <div className="grain relative">
      {gateUp && <Gate onEnter={enter} onGone={gone} />}

      {/* one atmosphere, start to finish — colour is spent as light, not washes */}
      {!reducedMotion ? (
        <div
          className="fixed inset-0 z-0 bg-void"
          style={{ backgroundImage: 'radial-gradient(70% 55% at 70% 38%, rgba(0,229,196,0.05), transparent 62%)' }}
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

      {/* a light readability scrim: even on phones (a side scrim bands vertically
          on a narrow screen), a soft left fall-off on desktop */}
      <div className="pointer-events-none fixed inset-0 z-[5] bg-void/20 sm:hidden" />
      <div className="pointer-events-none fixed inset-0 z-[5] hidden bg-gradient-to-r from-void/50 via-transparent to-transparent sm:block" />

      {/* cinematic vignette — binds the imagery + UI into one frame */}
      <div
        className="pointer-events-none fixed inset-0 z-[45] hidden sm:block"
        style={{ background: 'radial-gradient(125% 100% at 50% 45%, transparent 58%, rgba(0,0,0,0.55) 100%)' }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[45] sm:hidden"
        style={{ background: 'radial-gradient(150% 78% at 50% 45%, transparent 72%, rgba(0,0,0,0.34) 100%)' }}
      />

      <Nav scrollTo={scrollTo} soundOn={soundOn} onToggleSound={toggleSound} />
      <ScrollHud />
      <VitalHud beating={soundOn} />

      <main className="relative z-10">
        <Hero ready={ready} scrollTo={scrollTo} />
        <Premise />
        <Works onOpen={openProject} scrollTo={scrollTo} glass={!reducedMotion} />
        <Index onOpen={openProject} />
        <FlightLog onOpen={openProject} />
        <Office />
        <Skills />
        <Origin />
        <Recognition />
        <Contact />
        <Footer scrollTo={scrollTo} />
      </main>

      <ProjectDetail
        project={openIdx > -1 ? projects[openIdx] : null}
        index={Math.max(0, openIdx)}
        total={projects.length}
        onClose={closeProject}
        onNav={navProject}
      />
    </div>
  )
}
