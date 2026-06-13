// Tiny synthesized UI sound kit. Off until the user enables sound (opt-in),
// so nothing autoplays. Mirrors the ambient toggle.
let ctx = null
let master = null
let enabled = false

function ensure() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain()
    master.gain.value = 0.22
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
}

function blip(freq, dur = 0.08, peak = 0.06, type = 'sine', at = 0) {
  const t0 = ctx.currentTime + at
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g)
  g.connect(master)
  o.start(t0)
  o.stop(t0 + dur + 0.02)
}

export const sfx = {
  setEnabled(v) {
    enabled = v
    if (v) ensure()
  },
  tick() {
    if (!enabled) return
    ensure()
    blip(1500, 0.05, 0.03, 'sine')
  },
  confirm() {
    if (!enabled) return
    ensure()
    blip(880, 0.18, 0.07)
    blip(1320, 0.2, 0.06, 'sine', 0.08)
  },
  whoosh() {
    if (!enabled) return
    ensure()
    const dur = 0.45
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.Q.value = 1.1
    f.frequency.setValueAtTime(280, ctx.currentTime)
    f.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.08)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
    src.connect(f)
    f.connect(g)
    g.connect(master)
    src.start()
    src.stop(ctx.currentTime + dur)
  },
}
