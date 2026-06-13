import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import { scrollState } from '../../lib/scrollState'

// 62 BPM squeeze
const g = (x, c, s, a) => a * Math.exp(-((x - c) * (x - c)) / (2 * s * s))
const beat = (p) => g(((p % 1) + 1) % 1, 0.34, 0.05, 1)

/**
 * The heart — its own real surface & colour, lit cinematically and beating at
 * ~62 BPM. Lights live in the scene (BackgroundFX) so the PBR material reads.
 */
export default function Heart({ url = '/heart.glb', scale = 2.4 }) {
  const group = useRef()
  const { scene } = useGLTF(url)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    // rotation follows the scroll, not its own clock — settles when you stop
    const target = scrollState.progress * Math.PI * 5
    group.current.rotation.y += (target - group.current.rotation.y) * 0.08
    group.current.rotation.x = 0.12
    // beating keeps it alive while anchored
    group.current.scale.setScalar(scale * (1 + 0.045 * beat(t * (62 / 60))))
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
