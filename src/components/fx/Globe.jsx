import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'
import { LAND, LAND_W, LAND_H } from '../../data/landmask'
import { home, publications } from '../../data/resume'

const D2R = Math.PI / 180
const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// lat/lng → unit vector; lng 0 faces +z (the camera) at rotation 0
const vec = (lat, lng) =>
  new THREE.Vector3(Math.cos(lat * D2R) * Math.sin(lng * D2R), Math.sin(lat * D2R), Math.cos(lat * D2R) * Math.cos(lng * D2R))

const bits = (() => {
  const s = atob(LAND)
  const b = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i)
  return b
})()
const isLand = (lat, lng) => {
  const row = Math.min(LAND_H - 1, Math.max(0, Math.floor(90 - lat)))
  const col = Math.min(LAND_W - 1, Math.max(0, Math.floor(lng + 180)))
  const i = row * LAND_W + col
  return (bits[i >> 3] >> (i & 7)) & 1
}

// great-circle arc lifted off the surface, as a curve for a tube
function arcCurve(a, b) {
  const pts = []
  const ang = a.angleTo(b)
  const lift = 0.05 + ang * 0.055 // long hauls arch higher, but stay near the skin
  const s = Math.sin(ang)
  for (let i = 0; i <= 64; i++) {
    const t = i / 64
    // slerp keeps the arc on the great circle; the sine lift arches it
    const p = a
      .clone()
      .multiplyScalar(Math.sin((1 - t) * ang) / s)
      .add(b.clone().multiplyScalar(Math.sin(t * ang) / s))
    pts.push(p.multiplyScalar(1 + Math.sin(Math.PI * t) * lift))
  }
  return new THREE.CatmullRomCurve3(pts)
}

const slerp = (a, b, t) => {
  const ang = a.angleTo(b)
  if (ang < 1e-4) return a.clone()
  const s = Math.sin(ang)
  return a
    .clone()
    .multiplyScalar(Math.sin((1 - t) * ang) / s)
    .add(b.clone().multiplyScalar(Math.sin(t * ang) / s))
}

const dotsVert = /* glsl */ `
  attribute float aSeed;
  uniform float uSize;
  uniform float uTime;
  varying float vFacing;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelViewMatrix) * position);
    vFacing = n.z; // > 0 faces the camera
    gl_PointSize = uSize * (0.75 + 0.5 * aSeed) * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const dotsFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFacing;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    float front = smoothstep(-0.15, 0.55, vFacing);
    // a soft terminator — the lit hemisphere reads, the far side whispers
    float a = mix(0.05, 0.85, front) * (0.7 + 0.3 * vSeed);
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`
const atmoVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const atmoFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    // a thin limb only — bloom picks this up, so it has to stay faint
    float f = pow(1.0 - abs(dot(vN, vV)), 6.0);
    gl_FragColor = vec4(uColor, f * 0.16 * uOpacity);
  }
`
const arcVert = /* glsl */ `
  varying float vT;
  varying float vFacing;
  void main() {
    vT = uv.x;
    // the arc hugs the sphere, so its own direction is its surface normal
    vFacing = normalize(mat3(modelViewMatrix) * position).z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const arcFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uDraw;
  uniform float uOpacity;
  varying float vT;
  varying float vFacing;
  void main() {
    if (vT > uDraw) discard;
    float head = smoothstep(uDraw - 0.08, uDraw, vT);
    float tail = smoothstep(0.0, 0.06, vT);
    // nothing occludes an additive line, so fade it round the far side
    float front = smoothstep(-0.25, 0.2, vFacing);
    vec3 col = mix(uColor, vec3(1.0), head * 0.7);
    gl_FragColor = vec4(col, (0.55 + 0.45 * head) * tail * front * uOpacity);
  }
`

/**
 * The flight log's globe. Land as dots, a fresnel atmosphere, and two
 * great-circle arcs flown out of Coimbatore. Scroll draws each flight while
 * the globe turns to follow the plane's head.
 */
export default function Globe() {
  const group = useRef()
  const spin = useRef()
  const vw = useThree((s) => s.size.width)
  const narrow = vw < 880

  const CBE = useMemo(() => vec(home.lat, home.lng), [])
  const dests = useMemo(() => publications.filter((p) => p.lat != null), [])
  const YYZ = useMemo(() => vec(dests[0].lat, dests[0].lng), [dests])
  const DPS = useMemo(() => vec(dests[1].lat, dests[1].lng), [dests])

  const dots = useMemo(() => {
    const N = 16000
    const pos = []
    const seed = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      const x = Math.cos(th) * r
      const z = Math.sin(th) * r
      const lat = Math.asin(y) / D2R
      const lng = Math.atan2(x, z) / D2R
      if (isLand(lat, lng)) {
        pos.push(x * 1.001, y * 1.001, z * 1.001)
        seed.push(Math.random())
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1))
    return g
  }, [])

  const arcs = useMemo(
    () =>
      [YYZ, DPS].map((b, i) => ({
        geo: new THREE.TubeGeometry(arcCurve(CBE, b), 96, 0.0075, 6, false),
        color: new THREE.Color(dests[i].ink),
      })),
    [CBE, YYZ, DPS, dests]
  )

  const mats = useMemo(
    () => ({
      dots: new THREE.ShaderMaterial({
        vertexShader: dotsVert,
        fragmentShader: dotsFrag,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color('#ECE6DA') }, uOpacity: { value: 0 }, uSize: { value: 2.4 }, uTime: { value: 0 } },
      }),
      atmo: new THREE.ShaderMaterial({
        vertexShader: atmoVert,
        fragmentShader: atmoFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color('#00E5C4') }, uOpacity: { value: 0 } },
      }),
      arcs: arcs.map(
        (a) =>
          new THREE.ShaderMaterial({
            vertexShader: arcVert,
            fragmentShader: arcFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: { uColor: { value: a.color }, uDraw: { value: 0 }, uOpacity: { value: 0 } },
          })
      ),
      pin: new THREE.MeshBasicMaterial({ color: '#ECE6DA', transparent: true, opacity: 0 }),
    }),
    [arcs]
  )

  const cur = useRef({ rx: 0, ry: 0, op: 0 })
  const head = useRef()
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const reveal = scrollState.flightReveal
    const c = cur.current
    c.op += (reveal - c.op) * 0.08
    g.visible = c.op > 0.01
    if (!g.visible) return

    if (narrow) {
      // phones: a header image for the chapter — it scrolls with the page
      // (visible height at the globe's depth is 2·6.6·tan 27.5° ≈ 6.87 units),
      // both flights already flown, turning slowly on its own
      g.position.y = (0.5 - (scrollState.flightTop + 0.47)) * 6.87
      c.ry += Math.min(delta, 0.05) * 0.18
      spin.current.rotation.set(0.32, c.ry - 1.1, 0, 'XYZ')
      mats.dots.uniforms.uOpacity.value = c.op
      mats.atmo.uniforms.uOpacity.value = c.op
      mats.arcs.forEach((m) => {
        m.uniforms.uDraw.value = 1
        m.uniforms.uOpacity.value = c.op
      })
      mats.pin.opacity = c.op
      if (head.current) head.current.visible = false
      return
    }

    const p = scrollState.flightP
    const d1 = smooth(0.12, 0.42, p)
    const back = smooth(0.55, 0.62, p)
    const d2 = smooth(0.62, 0.88, p)

    // where the camera should be looking: the plane's head
    let focus
    if (p < 0.55) focus = slerp(CBE, YYZ, d1)
    else if (p < 0.62) focus = slerp(YYZ, CBE, back)
    else focus = slerp(CBE, DPS, d2)
    const lat = Math.asin(focus.y)
    const lng = Math.atan2(focus.x, focus.z)
    // shortest way round, so it never spins the long way
    let ry = -lng
    while (ry - c.ry > Math.PI) ry -= Math.PI * 2
    while (ry - c.ry < -Math.PI) ry += Math.PI * 2
    c.ry += (ry - c.ry) * 0.07
    c.rx += (lat * 0.85 - c.rx) * 0.07
    spin.current.rotation.set(c.rx, c.ry, 0, 'XYZ')

    const op = c.op
    mats.dots.uniforms.uOpacity.value = op
    mats.atmo.uniforms.uOpacity.value = op
    mats.arcs[0].uniforms.uDraw.value = d1
    mats.arcs[1].uniforms.uDraw.value = d2
    mats.arcs.forEach((m) => (m.uniforms.uOpacity.value = op))
    mats.pin.opacity = op

    // the plane: a bright bead at the head of whichever flight is drawing
    const drawing = p < 0.55 ? d1 : d2
    const curve = p < 0.55 ? 0 : 1
    if (head.current) {
      const flying = drawing > 0.01 && drawing < 0.99 && !(p >= 0.55 && p < 0.62)
      head.current.visible = flying
      if (flying) {
        tmp.copy(arcs[curve].geo.parameters.path.getPointAt(drawing))
        head.current.position.copy(tmp)
        head.current.material.color.copy(arcs[curve].color)
        head.current.material.opacity = op
      }
    }
  })

  const R = narrow ? 1.12 : 2.15
  return (
    <group ref={group} position={narrow ? [0, -9, 0] : [1.75, 0.05, 0]} scale={R}>
      <group ref={spin}>
        <points geometry={dots} material={mats.dots} />
        {arcs.map((a, i) => (
          <mesh key={i} geometry={a.geo} material={mats.arcs[i]} />
        ))}
        {[CBE, YYZ, DPS].map((v, i) => (
          <mesh key={i} position={v.clone().multiplyScalar(1.004)} material={mats.pin}>
            <sphereGeometry args={[0.014, 10, 10]} />
          </mesh>
        ))}
        <mesh ref={head}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial transparent opacity={1} />
        </mesh>
      </group>
      <mesh material={mats.atmo} scale={1.05}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>
    </group>
  )
}
