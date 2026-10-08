import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

const vert = /* glsl */ `
  attribute float aSeed;
  attribute float aDepth;
  uniform float uTime;
  uniform float uScroll;
  uniform float uPx;
  varying float vSeed;
  varying float vNear;
  const float H = 14.0;
  void main() {
    vSeed = aSeed;
    vNear = aDepth;
    vec3 p = position;
    // near motes travel further with the scroll than far ones — parallax
    p.y = mod(p.y + uScroll * (6.0 + aDepth * 22.0) + uTime * (0.05 + aSeed * 0.06), H) - H * 0.5;
    p.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // the nearest few are big, soft, out-of-focus discs
    gl_PointSize = uPx * (1.4 + aDepth * aDepth * 16.0) * (4.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const frag = /* glsl */ `
  uniform float uOpacity;
  varying float vSeed;
  varying float vNear;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // focused motes are crisp points; near ones are bokeh with a soft rim
    float soft = mix(smoothstep(0.5, 0.0, d), smoothstep(0.5, 0.36, d) * 0.55 + smoothstep(0.5, 0.0, d) * 0.25, step(0.85, vNear));
    vec3 col = vSeed < 0.12 ? vec3(0.88, 0.19, 0.23) : vSeed < 0.42 ? vec3(0.0, 0.9, 0.77) : vec3(0.93, 0.9, 0.85);
    float a = soft * mix(0.55, 0.16, vNear) * uOpacity;
    gl_FragColor = vec4(col, a);
  }
`

/** Drifting motes at many depths, moving with the scroll — depth, not decoration. */
export default function Dust({ count = 520 }) {
  const mat = useRef()
  const vw = useThree((s) => s.size.width)
  const n = vw < 880 ? Math.round(count * 0.55) : count

  const geo = useMemo(() => {
    const pos = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    const depth = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const d = Math.pow(Math.random(), 1.6) // most are far
      depth[i] = d
      seed[i] = Math.random()
      // spread far motes wide, near ones closer to the lens
      pos[i * 3] = (Math.random() - 0.5) * (16 - d * 6)
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = -6 + d * 10.5
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aDepth', new THREE.BufferAttribute(depth, 1))
    return g
  }, [n])

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 }, uOpacity: { value: 0 }, uPx: { value: 1 } }),
    []
  )

  useFrame((state, delta) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value += (scrollState.progress - u.uScroll.value) * 0.08
    u.uPx.value = state.gl.getPixelRatio()
    // a touch more present when the specimen or the globe is on stage
    const stage = Math.max(scrollState.heartReveal, scrollState.flightReveal, 0.45)
    u.uOpacity.value += (stage - u.uOpacity.value) * Math.min(1, delta * 2)
  })

  return (
    <points geometry={geo} frustumCulled={false} renderOrder={1}>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
