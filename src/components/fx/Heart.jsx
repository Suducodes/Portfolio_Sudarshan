import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

// 62 BPM squeeze
const g = (x, c, s, a) => a * Math.exp(-((x - c) * (x - c)) / (2 * s * s))
const beat = (p) => g(((p % 1) + 1) % 1, 0.34, 0.05, 1)
const lerp = THREE.MathUtils.lerp

/**
 * The heart. Ambient & centered most of the time; during the Works descent it
 * zooms in (top first) and the "camera" pans down it as you scroll, rotating.
 */
export default function Heart({ url = '/heart.glb' }) {
  const group = useRef()
  const { scene } = useGLTF(url)
  const cur = useRef({ scale: 2.4, y: 0, rot: 0 })

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const wa = scrollState.worksActive
    const wp = scrollState.worksProgress

    // targets
    const tScale = wa ? 3.8 : 2.4
    const tY = wa ? lerp(-2.8, 2.4, wp) : 0 // pan: top visible → apex visible
    const tRot = wa ? wp * Math.PI * 2.2 : scrollState.progress * Math.PI * 5

    const c = cur.current
    c.scale = lerp(c.scale, tScale, 0.06)
    c.y = lerp(c.y, tY, 0.08)
    c.rot += (tRot - c.rot) * 0.08

    group.current.rotation.y = c.rot
    group.current.rotation.x = wa ? lerp(group.current.rotation.x, -0.05, 0.06) : 0.12
    group.current.position.y = c.y
    group.current.scale.setScalar(c.scale * (1 + 0.04 * beat(t * (62 / 60))))
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

useGLTF.preload('/heart.glb')
