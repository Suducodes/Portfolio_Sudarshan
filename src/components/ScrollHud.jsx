import { useEffect, useState } from 'react'

export default function ScrollHud() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      setPct(Math.max(0, Math.min(1, p)))
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* right-edge progress rail */}
      <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 bg-bone/10 md:block">
        <div
          className="absolute left-0 top-0 w-px bg-teal"
          style={{ height: `${pct * 100}%`, boxShadow: '0 0 8px rgba(0,229,196,0.8)' }}
        />
      </div>
      {/* numeric readout — tucked under the right rail */}
      <div
        className="pointer-events-none fixed right-5 z-40 hidden font-body text-[10px] tracking-[0.25em] text-bone/45 md:block"
        style={{ top: 'calc(50% + 6rem)' }}
      >
        {String(Math.round(pct * 100)).padStart(3, '0')}
        <span className="text-bone/25"> / 100</span>
      </div>
    </>
  )
}
