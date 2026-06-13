import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Generative ambient bed — a low teal-cool drone plus a slow ~62 BPM
 * heartbeat. No audio asset; everything synthesized via WebAudio.
 * Off by default; user opt-in only.
 */
export function useAmbientSound() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef(null)
  const nodesRef = useRef(null)
  const beatTimer = useRef(null)

  const buildGraph = useCallback((ctx) => {
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    // --- drone: two detuned oscillators through a lowpass ---
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 420
    filter.Q.value = 0.6
    filter.connect(master)

    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.08
    droneGain.connect(filter)

    const o1 = ctx.createOscillator()
    o1.type = 'sine'
    o1.frequency.value = 55
    const o2 = ctx.createOscillator()
    o2.type = 'sine'
    o2.frequency.value = 55 * 1.5
    o2.detune.value = 6
    o1.connect(droneGain)
    o2.connect(droneGain)
    o1.start()
    o2.start()

    // slow filter sweep for "breathing"
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 180
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    return { master, nodes: [o1, o2, lfo] }
  }, [])

  const playBeat = useCallback((ctx, master) => {
    const now = ctx.currentTime
    const thump = (at, freq, gain) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(freq, at)
      o.frequency.exponentialRampToValueAtTime(freq * 0.5, at + 0.12)
      g.gain.setValueAtTime(0.0001, at)
      g.gain.exponentialRampToValueAtTime(gain, at + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22)
      o.connect(g)
      g.connect(master)
      o.start(at)
      o.stop(at + 0.3)
    }
    thump(now, 80, 0.18) // "lub"
    thump(now + 0.16, 64, 0.12) // "dub"
  }, [])

  const enable = useCallback(async () => {
    let ctx = ctxRef.current
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
      ctxRef.current = ctx
      nodesRef.current = buildGraph(ctx)
    }
    if (ctx.state === 'suspended') await ctx.resume()
    const { master } = nodesRef.current
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2)

    playBeat(ctx, master)
    beatTimer.current = setInterval(() => playBeat(ctx, master), 60000 / 62)
  }, [buildGraph, playBeat])

  const disable = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx || !nodesRef.current) return
    const { master } = nodesRef.current
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    if (beatTimer.current) clearInterval(beatTimer.current)
  }, [])

  const toggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev
      if (next) enable()
      else disable()
      return next
    })
  }, [enable, disable])

  useEffect(() => {
    return () => {
      if (beatTimer.current) clearInterval(beatTimer.current)
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [])

  return { on, toggle }
}
