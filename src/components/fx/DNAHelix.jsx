import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

/* parametric helix strand */
class HelixCurve extends THREE.Curve {
  constructor(radius, height, turns, phase = 0) {
    super()
    this.radius = radius
    this.height = height
    this.turns = turns
    this.phase = phase
  }
  getPoint(t, target = new THREE.Vector3()) {
    const a = this.phase + t * this.turns * Math.PI * 2
    const y = (t - 0.5) * this.height
    return target.set(Math.cos(a) * this.radius, y, Math.sin(a) * this.radius)
  }
}

const TEAL = new THREE.Color('#00E5C4')
const ICE = new THREE.Color('#bfeee7')
// dimmed instance colours so the helix sits behind text, not on top of it
const dTEAL = new THREE.Color('#00E5C4').multiplyScalar(0.5)
const dICE = new THREE.Color('#bfeee7').multiplyScalar(0.42)
const dVIOLET = new THREE.Color('#8b7bd8').multiplyScalar(0.52)
const dCRIMSON = new THREE.Color('#ff5566').multiplyScalar(0.52)

/**
 * A dense, glowing DNA double helix — twin tube backbones, hundreds of
 * instanced nucleotides and two-tone base-pair rungs, with a halo of
 * molecular dust. Bloom (in BackgroundFX) does the glow.
 */
export default function DNAHelix({
  radius = 1.25,
  height = 30,
  turns = 11,
  pairs = 150,
}) {
  const group = useRef()
  const rungs = useRef()
  const nodesA = useRef()
  const nodesB = useRef()

  const curveA = useMemo(() => new HelixCurve(radius, height, turns, 0), [radius, height, turns])
  const curveB = useMemo(() => new HelixCurve(radius, height, turns, Math.PI), [radius, height, turns])

  const tubeA = useMemo(() => new THREE.TubeGeometry(curveA, 360, 0.04, 7, false), [curveA])
  const tubeB = useMemo(() => new THREE.TubeGeometry(curveB, 360, 0.04, 7, false), [curveB])

  // dust halo
  const dust = useMemo(() => {
    const n = 600
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = radius * (0.4 + Math.random() * 1.7)
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * height
      pos[i * 3 + 2] = Math.sin(a) * r
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [radius, height])

  // place instances along the helix
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    const pA = new THREE.Vector3()
    const pB = new THREE.Vector3()
    const mid = new THREE.Vector3()

    for (let i = 0; i < pairs; i++) {
      const t = i / (pairs - 1)
      curveA.getPoint(t, pA)
      curveB.getPoint(t, pB)

      // nucleotide nodes
      dummy.position.copy(pA)
      dummy.scale.setScalar(0.85 + Math.random() * 0.4)
      dummy.updateMatrix()
      nodesA.current.setMatrixAt(i, dummy.matrix)

      dummy.position.copy(pB)
      dummy.scale.setScalar(0.85 + Math.random() * 0.4)
      dummy.updateMatrix()
      nodesB.current.setMatrixAt(i, dummy.matrix)

      // base-pair rung (oriented cylinder)
      mid.addVectors(pA, pB).multiplyScalar(0.5)
      const len = pA.distanceTo(pB)
      dummy.position.copy(mid)
      dummy.scale.set(1, len, 1)
      dummy.lookAt(pB)
      dummy.rotateX(Math.PI / 2)
      dummy.updateMatrix()
      rungs.current.setMatrixAt(i, dummy.matrix)

      // base-pair colouring (A·T teal/ice, G·C violet, occasional crimson)
      const r = Math.random()
      const c = r > 0.9 ? dCRIMSON : r > 0.62 ? dVIOLET : dTEAL
      rungs.current.setColorAt(i, c)
      nodesA.current.setColorAt(i, dTEAL)
      nodesB.current.setColorAt(i, dICE)
    }
    nodesA.current.instanceMatrix.needsUpdate = true
    nodesB.current.instanceMatrix.needsUpdate = true
    rungs.current.instanceMatrix.needsUpdate = true
    if (rungs.current.instanceColor) rungs.current.instanceColor.needsUpdate = true
  }, [curveA, curveB, pairs])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const s = scrollState.progress
    const g = group.current
    g.rotation.y = t * 0.09 + s * Math.PI * 3
    // organic sway + breathing so it never feels like a rigid prop
    g.rotation.z = 0.2 + Math.sin(t * 0.33) * 0.07
    g.rotation.x = 0.3 + Math.sin(t * 0.47) * 0.05
    const breathe = 1 + Math.sin(t * 0.6) * 0.025
    g.scale.set(breathe, 1, breathe)
    // scroll the helix upward so new turns keep entering frame
    g.position.y = -height * 0.18 + s * height * 0.5
    // keep it framed to the right — a dense background detail, not the subject
    const aspect = state.size.width / state.size.height
    const targetX = THREE.MathUtils.lerp(2.6, 4.0, THREE.MathUtils.clamp((aspect - 0.55) / 1.25, 0, 1))
    g.position.x += (targetX - g.position.x) * 0.08
  })

  return (
    <group ref={group} position={[1.6, 0, -2.4]} rotation={[0.32, 0, 0.22]}>
      {/* backbones */}
      <mesh geometry={tubeA}>
        <meshBasicMaterial color={TEAL} transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <mesh geometry={tubeB}>
        <meshBasicMaterial color={ICE} transparent opacity={0.24} toneMapped={false} />
      </mesh>

      {/* base-pair rungs */}
      <instancedMesh ref={rungs} args={[undefined, undefined, pairs]}>
        <cylinderGeometry args={[0.018, 0.018, 1, 6]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* nucleotide nodes */}
      <instancedMesh ref={nodesA} args={[undefined, undefined, pairs]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={nodesB} args={[undefined, undefined, pairs]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* molecular dust */}
      <points geometry={dust}>
        <pointsMaterial color={TEAL} size={0.025} sizeAttenuation transparent opacity={0.32} toneMapped={false} />
      </points>
    </group>
  )
}
