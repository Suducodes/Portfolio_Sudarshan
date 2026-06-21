import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

const PALETTE = [
  new THREE.Color('#00E5C4'),
  new THREE.Color('#8b7bd8'),
  new THREE.Color('#ff5566'),
  new THREE.Color('#E8A33D'),
  new THREE.Color('#bfeee7'),
]

/**
 * A dense, multi-colour particle cloud that fades in with the heart — the
 * Active-Theory "confetti" field swirling around the centerpiece.
 */
export default function HeartDust({ count = 190 }) {
  const ref = useRef()
  const matRef = useRef()

  const geom = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // shell-ish cloud around the heart
      const r = 1.8 + Math.random() * 2.6
      const th = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(th) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = Math.sin(th) * r - 1.5 // pushed back so none get huge near camera
      const c = PALETTE[(Math.random() * PALETTE.length) | 0]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      seed[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y = t * 0.04 + scrollState.worksProgress * 1.5
      ref.current.position.y = scrollState.heartY * 0.8 // rise/exit with the heart
      ref.current.visible = scrollState.heartReveal > 0.01
    }
    if (matRef.current) {
      const target = scrollState.heartReveal * (0.55 + 0.35 * scrollState.worksProgress)
      matRef.current.uniforms.uOpacity.value += (target - matRef.current.uniforms.uOpacity.value) * 0.08
      matRef.current.uniforms.uTime.value = t
    }
  })

  return (
    <points ref={ref} geometry={geom}>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        uniforms={{ uOpacity: { value: 0 }, uTime: { value: 0 } }}
        vertexShader={`
          attribute float aSeed; varying vec3 vC; varying float vTw; uniform float uTime;
          void main(){
            vC = color;
            vTw = 0.5 + 0.5*sin(uTime*1.4 + aSeed*6.2831);
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            gl_PointSize = min((0.7 + 1.8*aSeed) * vTw * (150.0 / -mv.z), 14.0);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying vec3 vC; varying float vTw; uniform float uOpacity;
          void main(){
            vec2 c = gl_PointCoord - 0.5; float d = length(c);
            if(d>0.5) discard;
            float glow = smoothstep(0.5,0.0,d);
            gl_FragColor = vec4(vC, glow * vTw * uOpacity);
          }
        `}
      />
    </points>
  )
}
