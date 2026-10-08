import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as THREE from 'three'
import { featured } from '../../data/projects'
import { scrollState } from '../../lib/scrollState'
import { makePanelTexture, PANEL_ASPECT } from '../../lib/panelArt'
import { picker } from '../../lib/picker'

const N = featured.length
const STEP = (Math.PI * 2) / N
const RADIUS = 3.35
const GAP = 1.15 // vertical drop between consecutive plates in the helix
const PW = 2.35
const PH = PW / PANEL_ASPECT
const D2R = Math.PI / 180

const vert = /* glsl */ `
  uniform float uBend;
  varying vec2 vUv;
  varying vec4 vClip;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec3 p = position;
    // a faint cylindrical bow, like a curved sheet of glass
    float k = p.x / ${(PW / 2).toFixed(3)};
    p.z += (1.0 - k * k) * uBend;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    vClip = projectionMatrix * viewMatrix * wp;
    gl_Position = vClip;
  }
`

const frag = /* glsl */ `
  uniform sampler2D uBack;
  uniform sampler2D uArt;
  uniform float uOpacity;
  uniform float uFocus;
  uniform float uHover;
  uniform float uTime;
  uniform vec3 uTint;
  varying vec2 vUv;
  varying vec4 vClip;
  varying vec3 vN;
  varying vec3 vV;

  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(${PANEL_ASPECT.toFixed(4)}, 1.0);
    float d = sdRound(p, vec2(${(PANEL_ASPECT / 2).toFixed(4)}, 0.5), 0.07);
    if (d > 0.0) discard;
    float bevel = smoothstep(-0.03, 0.0, d);

    // what's behind the glass, bent like a lens toward the edges, with the
    // channels split the way thick glass splits them
    vec2 suv = vClip.xy / vClip.w * 0.5 + 0.5;
    vec2 bend = p * 0.045 + vN.xy * 0.02;
    vec3 back = vec3(
      texture2D(uBack, suv + bend).r,
      texture2D(uBack, suv + bend * 1.3).g,
      texture2D(uBack, suv + bend * 1.6).b
    );
    // a light frost — four taps, not a real blur
    vec3 frost = 0.25 * (
      texture2D(uBack, suv + bend + vec2(0.005, 0.002)).rgb +
      texture2D(uBack, suv + bend - vec2(0.005, 0.002)).rgb +
      texture2D(uBack, suv + bend + vec2(-0.002, 0.005)).rgb +
      texture2D(uBack, suv + bend + vec2(0.002, -0.005)).rgb
    );
    back = mix(back, frost, 0.55) * 1.12 + 0.015;

    // the plate in focus is mostly the project; the others are mostly glass
    vec3 art = texture2D(uArt, vUv).rgb;
    float show = mix(0.28, 0.94, uFocus);
    vec3 col = mix(back, art, show);

    float fres = pow(1.0 - clamp(dot(vN, vV), 0.0, 1.0), 3.0);
    col += uTint * bevel * 0.5 + vec3(1.0) * bevel * 0.22;
    col += vec3(0.86, 0.94, 1.0) * fres * 0.2;

    // a slow specular sweep across the glass
    float s = fract(vUv.x * 0.7 + vUv.y * 0.45 - uTime * 0.07);
    col += (1.0 - smoothstep(0.0, 0.035, abs(s - 0.5))) * 0.07;
    col += uTint * uHover * 0.08;

    gl_FragColor = vec4(col, uOpacity);
  }
`

/**
 * The works ring as real glass. Seven plates orbit the heart in a descending
 * helix; each refracts the scene behind it from one shared offscreen pass,
 * and carries the project's key art, brightest when it turns to face you.
 */
export default function GlassPanels() {
  const { gl, scene, camera, size } = useThree()
  const ring = useRef()
  const meshes = useRef([])
  const narrow = size.width < 880

  // the shared "what's behind the glass" buffer — half resolution is plenty
  // once it's been frosted and bent
  const dpr = gl.getPixelRatio()
  const fbo = useFBO(Math.max(2, Math.round(size.width * dpr * 0.5)), Math.max(2, Math.round(size.height * dpr * 0.5)), {
    depthBuffer: true,
  })

  const mats = useMemo(() => {
    const blank = new THREE.DataTexture(new Uint8Array([12, 17, 22, 255]), 1, 1)
    blank.needsUpdate = true
    return featured.map(
      (p) =>
        new THREE.ShaderMaterial({
          vertexShader: vert,
          fragmentShader: frag,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uBack: { value: fbo.texture },
            uArt: { value: blank },
            uOpacity: { value: 0 },
            uFocus: { value: 0 },
            uHover: { value: 0 },
            uTime: { value: 0 },
            uBend: { value: 0.05 },
            uTint: { value: new THREE.Color(p.color) },
          },
        })
    )
  }, [fbo])

  // key art arrives async; swap each plate's face in as it's ready
  useEffect(() => {
    let live = true
    featured.forEach((p, i) =>
      makePanelTexture(p, i).then((tex) => {
        if (live) mats[i].uniforms.uArt.value = tex
        else tex.dispose()
      })
    )
    return () => {
      live = false
    }
  }, [mats])

  const geo = useMemo(() => new THREE.PlaneGeometry(PW, PH, 24, 1), [])

  // clicks and hovers come from the DOM above; this answers "which plate?"
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  useEffect(() => {
    picker.pick = (x, y) => {
      if (!ring.current?.visible) return null
      ndc.set(x, y)
      ray.setFromCamera(ndc, camera)
      const hits = ray.intersectObjects(meshes.current.filter(Boolean), false)
      const h = hits.find((it) => it.object.material.uniforms.uOpacity.value > 0.35)
      return h ? h.object.userData.id : null
    }
    return () => {
      picker.pick = null
    }
  }, [camera, ray, ndc])

  const state = useRef({ op: 0, hover: [] })

  useFrame((st) => {
    const r = ring.current
    if (!r) return
    const s = state.current
    const target = narrow ? 0 : scrollState.heartReveal * Math.max(0, (scrollState.heartMode - 0.35) / 0.65)
    s.op += (target - s.op) * 0.12
    r.visible = s.op > 0.01
    if (!r.visible) return

    // the helix: turn with the descent, rise as you scroll
    const rot = scrollState.worksRot * D2R
    r.rotation.y = -rot
    r.position.y = scrollState.worksProgress * (N - 1) * GAP

    const t = st.clock.elapsedTime
    meshes.current.forEach((m, i) => {
      if (!m) return
      // angle of this plate from facing the camera, wrapped to ±π
      let a = i * STEP - rot
      a = Math.atan2(Math.sin(a), Math.cos(a))
      const face = Math.max(0, 1 - Math.abs(a) / (110 * D2R))
      const u = m.material.uniforms
      u.uOpacity.value = s.op * (0.12 + 0.88 * face)
      u.uFocus.value = Math.max(0, 1 - Math.abs(a) / (34 * D2R))
      const hv = scrollState.hoverPanel === featured[i].id ? 1 : 0
      u.uHover.value += (hv - u.uHover.value) * 0.15
      u.uTime.value = t
      const sc = 1 + u.uHover.value * 0.035
      m.scale.set(sc, sc, sc)
    })

    // one offscreen pass of everything except the glass, shared by every plate
    r.visible = false
    const prev = gl.getRenderTarget()
    gl.setRenderTarget(fbo)
    gl.clear()
    gl.render(scene, camera)
    gl.setRenderTarget(prev)
    r.visible = true
  })

  if (narrow) return null
  return (
    <group ref={ring}>
      {featured.map((p, i) => {
        const a = i * STEP
        return (
          <mesh
            key={p.id}
            ref={(el) => (meshes.current[i] = el)}
            geometry={geo}
            material={mats[i]}
            position={[Math.sin(a) * RADIUS, -i * GAP, Math.cos(a) * RADIUS]}
            rotation={[0, a, 0]}
            userData={{ id: p.id }}
            renderOrder={2}
          />
        )
      })}
    </group>
  )
}
