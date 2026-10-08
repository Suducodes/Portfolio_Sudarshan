import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

const g = (x, c, s, a) => a * Math.exp(-((x - c) * (x - c)) / (2 * s * s))
const beat = (p) => g(((p % 1) + 1) % 1, 0.34, 0.05, 1)

const vert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vW;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vW = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const frag = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPulse;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vW;
  // iq cosine palette — a thin-film sheen
  vec3 film(float t) {
    return 0.5 + 0.5 * cos(6.2831 * (vec3(1.0, 1.0, 1.0) * t + vec3(0.0, 0.33, 0.67)));
  }
  void main() {
    float nv = clamp(dot(vN, vV), 0.0, 1.0);
    float fres = pow(1.0 - nv, 2.2);
    // chrome: a fake environment from the reflected direction
    vec3 r = reflect(-vV, vN);
    float sky = smoothstep(-0.2, 0.9, r.y);
    vec3 env = mix(vec3(0.02, 0.03, 0.04), vec3(0.75, 0.78, 0.8), sky);
    env += vec3(1.0) * pow(max(0.0, r.y), 24.0) * 1.6; // a hard studio highlight
    vec3 sheen = film(fres * 1.2 + vW.x * 0.08 + uTime * 0.04);
    // pull the sheen toward the site's own teal / violet / crimson
    sheen = mix(sheen, vec3(0.0, 0.9, 0.77) * sheen.g + vec3(0.88, 0.19, 0.23) * sheen.r + vec3(0.55, 0.48, 0.85) * sheen.b, 0.6);
    vec3 col = env * 0.55 + sheen * fres * 0.9;
    col += vec3(0.88, 0.19, 0.23) * uPulse * 0.35 * fres;
    gl_FragColor = vec4(col, uOpacity);
  }
`

/**
 * The signal's portal — a thin chrome ring with a thin-film sheen, the
 * invitation sits inside it. It beats with the heart (62 BPM) and arrives
 * as the contact chapter does.
 */
export default function Portal() {
  const ring = useRef()
  const vw = useThree((s) => s.size.width)
  const narrow = vw < 880
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOpacity: { value: 0 }, uPulse: { value: 0 } }), [])
  const cur = useRef({ op: 0 })

  useFrame((state) => {
    const r = ring.current
    if (!r) return
    const t = state.clock.elapsedTime
    const c = cur.current
    const target = scrollState.portalReveal
    c.op += (target - c.op) * 0.06
    r.visible = c.op > 0.01
    if (!r.visible) return
    const b = beat(t * (62 / 60))
    uniforms.uTime.value = t
    uniforms.uOpacity.value = Math.min(1, c.op * 1.2)
    uniforms.uPulse.value = b
    // rises into place as you arrive, then idles: a slow turn and a wobble
    r.position.y = (1 - c.op) * -2.2 + (narrow ? 0.25 : 0.05)
    // phones: tilt less, so the ring circles the words instead of slicing
    // through them as a flat ellipse wider than the screen
    r.rotation.x = (narrow ? 0.55 : 1.18) + Math.sin(t * 0.3) * 0.05
    r.rotation.y = Math.sin(t * 0.21) * 0.12
    r.rotation.z = t * 0.06
    const s = (narrow ? 0.47 : 1) * (1 + b * 0.012)
    r.scale.setScalar(s)
  })

  return (
    <mesh ref={ring} renderOrder={1}>
      <torusGeometry args={[3.55, 0.055, 24, 220]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  )
}
