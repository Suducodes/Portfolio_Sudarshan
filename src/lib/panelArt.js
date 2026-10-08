import * as THREE from 'three'
import { asset } from './asset'

const W = 1024
const H = 640

const loadImg = (src) =>
  new Promise((res) => {
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.onload = () => res(im)
    im.onerror = () => res(null)
    im.src = src
  })

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/**
 * Compose one glass plate's face on a 2D canvas: the project's key art, a
 * dark fall-off so type reads, the venue, the status and the title — set in
 * the site's own fonts — then hand it to WebGL as a texture.
 */
export async function makePanelTexture(p, index) {
  await Promise.all([
    document.fonts.load('600 88px "Unbounded Variable"'),
    document.fonts.load('500 22px "Martian Mono Variable"'),
  ]).catch(() => {})

  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d')

  ctx.fillStyle = '#0c1116'
  ctx.fillRect(0, 0, W, H)
  const im = p.image ? await loadImg(asset(p.image)) : null
  if (im) {
    // cover-fit
    const s = Math.max(W / im.width, H / im.height)
    const w = im.width * s
    const h = im.height * s
    ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h)
  }

  // fall-off for the type
  let g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, 'rgba(6,8,10,0.35)')
  g.addColorStop(0.32, 'rgba(6,8,10,0)')
  g.addColorStop(0.62, 'rgba(6,8,10,0.25)')
  g.addColorStop(1, 'rgba(6,8,10,0.92)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // labels
  ctx.font = '500 22px "Martian Mono Variable", monospace'
  ctx.textBaseline = 'top'
  ctx.fillStyle = p.color
  ctx.fillText((p.kicker || '').toUpperCase(), 44, 40)
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(236,230,218,0.75)'
  ctx.fillText(`${String(index + 1).padStart(2, '0')} · ${p.status.toUpperCase()}`, W - 44, 40)

  // the name, on the glass
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ECE6DA'
  let size = 84
  ctx.font = `640 ${size}px "Unbounded Variable", sans-serif`
  const title = p.title.toUpperCase()
  while (ctx.measureText(title).width > W - 88 && size > 40) {
    size -= 4
    ctx.font = `640 ${size}px "Unbounded Variable", sans-serif`
  }
  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 24
  ctx.fillText(title, 42, H - 92)
  ctx.shadowBlur = 0
  ctx.font = '400 26px Satoshi, sans-serif'
  ctx.fillStyle = 'rgba(236,230,218,0.62)'
  ctx.fillText(p.subtitle, 44, H - 46)

  // a hairline frame inside the plate
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 2
  roundRect(ctx, 14, 14, W - 28, H - 28, 26)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

export const PANEL_ASPECT = W / H
