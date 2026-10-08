// Headless-Chrome capture over the DevTools protocol, no dependencies (Node 24 has
// a global WebSocket + fetch). The Browser pane throttles rAF when it isn't on
// screen, which freezes this site's WebGL and gate — this doesn't. It drives
// REAL wheel events so Lenis moves, and renders on the machine's integrated
// GPU, which makes it a fair performance check too.
//
//   node scripts/shot.mjs "http://localhost:5173/?nogate" shots/d [--w 1440] [--h 900]
//        [--dpr 1] [--mobile] [--wait 9000] [--settle 1600] [--steps "0,q:#work;1.4"]
//
// step syntax:  0              just shoot
//               w<px>          wheel down <px> (chunks of 100px, like a trackpad)
//               s<y>           window.scrollTo(0,y)
//               q:<sel>;<f>    scroll to an element's top + f viewport heights
//               h:<x>;<y>;<ms> press and hold (shoots mid-hold) — the pulse gate
//               c:<x>;<y>      click
//               e:<js>         evaluate js (result printed), no shot
// Separate steps with "," — or with " | " when a step contains commas (JS).
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const argv = process.argv.slice(2)
const url = argv[0]
const out = argv[1]
const opt = (k, d) => {
  const i = argv.indexOf('--' + k)
  return i > -1 ? argv[i + 1] : d
}
const W = +opt('w', 1440), H = +opt('h', 900), DPR = +opt('dpr', 1)
const MOBILE = argv.includes('--mobile')
const WAIT = +opt('wait', 9000), SETTLE = +opt('settle', 1600)
const rawSteps = opt('steps', '0')
// " | " separates steps when they contain commas (e.g. JS to evaluate)
const steps = (rawSteps.includes(' | ') ? rawSteps.split(' | ') : rawSteps.split(',')).map((s) => s.trim())
const PORT = 9400 + Math.floor(Math.random() * 400)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--hide-scrollbars', '--mute-audio', '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${process.env.TEMP}\\cdp-shot-${PORT}`,
  `--window-size=${W},${H}`,
  '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows', 'about:blank',
], { stdio: 'ignore' })

let ws, nextId = 1
const pending = new Map()
const events = []
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const id = nextId++
    pending.set(id, { res, rej })
    ws.send(JSON.stringify({ id, method, params }))
  })

async function main() {
  let target
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250)
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      target = list.find((t) => t.type === 'page')
    } catch {}
  }
  if (!target) throw new Error('chrome did not come up')
  ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) {
      const p = pending.get(d.id)
      pending.delete(d.id)
      d.error ? p.rej(new Error(d.error.message)) : p.res(d.result)
    } else if (d.method) events.push(d)
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: MOBILE })
  if (MOBILE) {
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
    await send('Emulation.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36',
    })
  }
  await send('Page.navigate', { url })
  await sleep(WAIT)

  let shot = 0
  const snap = async (label) => {
    const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 })
    const f = `${out}-${String(shot++).padStart(2, '0')}${label ? '-' + label : ''}.jpg`
    mkdirSync(dirname(f), { recursive: true })
    writeFileSync(f, Buffer.from(r.data, 'base64'))
    console.log(f)
  }
  for (const s of steps) {
    if (s === '0') {
      await snap()
    } else if (s[0] === 'w') {
      let left = +s.slice(1)
      while (left > 0) {
        const d = Math.min(100, left)
        await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: W / 2, y: H / 2, deltaX: 0, deltaY: d })
        left -= d
        await sleep(45)
      }
      await sleep(SETTLE)
      await snap('w')
    } else if (s[0] === 's') {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0,${+s.slice(1)})` })
      await sleep(SETTLE)
      await snap('s')
    } else if (s.startsWith('e:')) {
      const r = await send('Runtime.evaluate', { expression: s.slice(2), returnByValue: true, awaitPromise: true })
      console.log('eval>', JSON.stringify(r.result?.value ?? r.result?.description).slice(0, 2000))
    } else if (s.startsWith('q:')) {
      // q:<selector>;<fraction of viewport past its top>
      const [sel, frac = '0'] = s.slice(2).split(';')
      await send('Runtime.evaluate', {
        expression: `(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(e)window.scrollTo(0,e.getBoundingClientRect().top+scrollY+innerHeight*${+frac})})()`,
      })
      await sleep(SETTLE)
      await snap('q')
    } else if (s.startsWith('h:')) {
      // h:<x>;<y>;<holdMs> — press, shoot mid-hold, release
      const [x, y, ms] = s.slice(2).split(';').map(Number)
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 })
      await sleep(ms)
      await snap('hold')
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 })
    } else if (s.startsWith('c:')) {
      const [x, y] = s.slice(2).split(/[;x]/).map(Number)
      for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased'])
        await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 })
      await sleep(SETTLE)
      await snap('c')
    }
  }
}

main()
  .catch((e) => console.error('ERR', e.message))
  .finally(() => {
    try { ws?.close() } catch {}
    chrome.kill()
    setTimeout(() => process.exit(0), 300)
  })
