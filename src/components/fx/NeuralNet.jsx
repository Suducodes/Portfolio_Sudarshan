import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

// palette the whole net travels through as you scroll (teal → violet → crimson)
const A0 = new THREE.Color('#00E5C4')
const A1 = new THREE.Color('#8b7bd8')
const A2 = new THREE.Color('#ff5566')
const B0 = new THREE.Color('#9fffe9')
const B1 = new THREE.Color('#b9a8ff')
const B2 = new THREE.Color('#ff97a0')

/**
 * Ambient neural network — neuron nodes wired by pulsing synapses, dim and set
 * deep in the background, its colour drifting with scroll. GPU-driven; 2 draws.
 */
export default function NeuralNet({ count = 46, spread = [11, 7, 4] }) {
  const group = useRef()
  const nodeMat = useRef()
  const lineMat = useRef()
  const tmpA = useMemo(() => new THREE.Color(), [])
  const tmpB = useMemo(() => new THREE.Color(), [])

  const { nodeGeo, lineGeo } = useMemo(() => {
    const pts = []
    for (let i = 0; i < count; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * spread[0],
          (Math.random() - 0.5) * spread[1],
          (Math.random() - 0.5) * spread[2] - 1.5
        )
      )
    }
    const nPos = new Float32Array(count * 3)
    const nSeed = new Float32Array(count)
    pts.forEach((p, i) => {
      nPos.set([p.x, p.y, p.z], i * 3)
      nSeed[i] = Math.random()
    })
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3))
    nodeGeo.setAttribute('aSeed', new THREE.BufferAttribute(nSeed, 1))

    const seen = new Set()
    const conns = []
    for (let i = 0; i < count; i++) {
      pts
        .map((p, j) => ({ j, d: p.distanceTo(pts[i]) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`
          if (!seen.has(key) && pts[i].distanceTo(pts[j]) < 5) {
            seen.add(key)
            conns.push([i, j])
          }
        })
    }
    const lPos = new Float32Array(conns.length * 6)
    const lT = new Float32Array(conns.length * 2)
    const lSeed = new Float32Array(conns.length * 2)
    conns.forEach(([a, b], k) => {
      lPos.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], k * 6)
      lT.set([0, 1], k * 2)
      const s = Math.random()
      lSeed.set([s, s], k * 2)
    })
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3))
    lineGeo.setAttribute('aT', new THREE.BufferAttribute(lT, 1))
    lineGeo.setAttribute('aSeed', new THREE.BufferAttribute(lSeed, 1))
    return { nodeGeo, lineGeo }
  }, [count, spread[0], spread[1], spread[2]])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const s = scrollState.progress
    // travel the palette with scroll
    if (s < 0.5) {
      const k = s / 0.5
      tmpA.copy(A0).lerp(A1, k)
      tmpB.copy(B0).lerp(B1, k)
    } else {
      const k = (s - 0.5) / 0.5
      tmpA.copy(A1).lerp(A2, k)
      tmpB.copy(B1).lerp(B2, k)
    }
    for (const m of [nodeMat.current, lineMat.current]) {
      if (!m) continue
      m.uniforms.uTime.value = t
      m.uniforms.uColA.value.lerp(tmpA, 0.05)
      m.uniforms.uColB.value.lerp(tmpB, 0.05)
    }
    if (group.current) {
      group.current.rotation.y = t * 0.022 + s * 0.5
      group.current.rotation.x = Math.sin(t * 0.1) * 0.05
      group.current.position.y = s * 1.2
    }
  })

  const uniforms = () => ({
    uTime: { value: 0 },
    uColA: { value: A0.clone() },
    uColB: { value: B0.clone() },
  })

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <shaderMaterial
          ref={lineMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms()}
          vertexShader={`
            attribute float aT; attribute float aSeed;
            varying float vT; varying float vSeed;
            void main(){ vT=aT; vSeed=aSeed;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
          `}
          fragmentShader={`
            varying float vT; varying float vSeed; uniform float uTime;
            uniform vec3 uColA; uniform vec3 uColB;
            void main(){
              float pulse = fract(uTime*0.2 + vSeed);
              float d = abs(vT - pulse); d = min(d, 1.0-d);
              float p = smoothstep(0.09, 0.0, d);
              vec3 col = mix(uColA, uColB, vSeed);
              gl_FragColor = vec4(col, 0.025 + p*0.42);
            }
          `}
        />
      </lineSegments>

      <points geometry={nodeGeo}>
        <shaderMaterial
          ref={nodeMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms()}
          vertexShader={`
            attribute float aSeed; varying float vSeed; uniform float uTime;
            void main(){ vSeed=aSeed;
              vec4 mv = modelViewMatrix * vec4(position,1.0);
              float tw = 0.6 + 0.4*sin(uTime*1.5 + aSeed*6.2831);
              gl_PointSize = (1.1 + 2.2*aSeed) * tw * (300.0 / -mv.z);
              gl_Position = projectionMatrix * mv; }
          `}
          fragmentShader={`
            varying float vSeed; uniform float uTime;
            uniform vec3 uColA; uniform vec3 uColB;
            void main(){
              vec2 c = gl_PointCoord - 0.5; float d = length(c);
              if(d>0.5) discard;
              float glow = smoothstep(0.5, 0.0, d);
              float tw = 0.5 + 0.5*sin(uTime*1.8 + vSeed*6.2831);
              vec3 col = mix(uColA, uColB, step(0.5, fract(vSeed*3.7)));
              gl_FragColor = vec4(col, glow*(0.08 + 0.22*tw));
            }
          `}
        />
      </points>
    </group>
  )
}
