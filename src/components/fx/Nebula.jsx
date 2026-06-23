import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

/**
 * Atmosphere — a procedural, domain-warped fbm nebula rendered as a single
 * fullscreen quad. No texture, no asset to host; the whole field is generated
 * on the GPU and drifts slowly, its palette travelling teal → violet → crimson
 * with scroll. Parked at the far plane, behind everything.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0); // fill the screen, sit at the far plane
  }
`

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  uniform vec3 uVoid;
  uniform vec3 uTeal;
  uniform vec3 uViolet;
  uniform vec3 uCrimson;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    uv.x *= uAspect;
    uv *= 2.4;
    float t = uTime * 0.045;

    // iq-style domain warp — two levels of fbm feeding the next
    vec2 q = vec2(fbm(uv + vec2(0.0, t)), fbm(uv + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(fbm(uv + 3.0 * q + vec2(1.7, 9.2) + 0.12 * t),
                  fbm(uv + 3.0 * q + vec2(8.3, 2.8) - 0.10 * t));
    float f = fbm(uv + 3.4 * r);

    // palette drifts with scroll
    vec3 hot = mix(uTeal, uViolet, smoothstep(0.0, 0.55, uScroll));
    hot = mix(hot, uCrimson, smoothstep(0.55, 1.0, uScroll));

    vec3 col = uVoid;
    col = mix(col, hot * 0.45, clamp(f * f * 1.7, 0.0, 1.0));
    col = mix(col, hot, clamp(dot(r, r) * 0.42, 0.0, 1.0));
    col += hot * 0.10 * pow(clamp(q.x * q.y, 0.0, 1.0), 1.5); // faint filaments

    // settle toward void at the edges so UI text always reads
    float vig = smoothstep(1.3, 0.18, length(vUv - 0.5));
    col *= 0.30 + 0.62 * vig;

    gl_FragColor = vec4(col * 0.85, 1.0); // keep it atmospheric, never loud
  }
`

export default function Nebula() {
  const mat = useRef()
  const { size } = useThree()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
      uVoid: { value: new THREE.Color('#05080b') },
      uTeal: { value: new THREE.Color('#00E5C4') },
      uViolet: { value: new THREE.Color('#8b7bd8') },
      uCrimson: { value: new THREE.Color('#C1121F') },
    }),
    []
  )

  useFrame((state) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value += (scrollState.progress - u.uScroll.value) * 0.05
    u.uAspect.value = size.width / size.height
  })

  return (
    <mesh renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} depthTest={false} depthWrite={false} />
    </mesh>
  )
}
