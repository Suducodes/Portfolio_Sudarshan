import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'
import { asset } from '../../lib/asset'

const DEG = Math.PI / 180
// 62 BPM squeeze — a faint pulse, never a real size change
const g = (x, c, s, a) => a * Math.exp(-((x - c) * (x - c)) / (2 * s * s))
const beat = (p) => g(((p % 1) + 1) % 1, 0.34, 0.05, 1)
const lerp = THREE.MathUtils.lerp

const SCALE = 4.6 // the dive: big enough that the descent reads it top→bottom
const TOP_Y = -3.2 // wp=0 → the top of the heart sits at screen centre
const BOTTOM_Y = 3.2 // wp=1 → the bottom (apex) reaches screen centre

/**
 * Two acts. In the premise the heart is a planet — whole, centred in its orbit
 * rings, turning slowly. As the works section arrives it dives: grows until
 * only its crown fills the frame, then screws upward through the descent with
 * its rotation pinned to the project ring. heartMode blends the two.
 */
export default function Heart({ url = asset('heart.glb') }) {
  const group = useRef()
  const { scene } = useGLTF(url)
  const cur = useRef({ y: -5, rot: 0, idle: 0, scale: 1 })
  const vw = useThree((s) => s.size.width)
  const narrow = vw < 880
  const planet = narrow ? 1.45 : 2.05
  // a phone's frustum is ~3 units wide at this camera distance, so the dive is
  // smaller there; and since vertical FOV is aspect-independent, ±3.2 is one
  // screen — phones drift half of that behind their long list.
  const dive = narrow ? 2.5 : SCALE
  const span = narrow ? 0.5 : 1

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const mode = scrollState.heartMode
    const reveal = scrollState.heartReveal
    group.current.visible = reveal > 0.01

    const c = cur.current
    // idle drift only while it's a planet; it banks, never unwinds
    c.idle += Math.min(delta, 0.05) * 0.16 * (1 - mode)
    const worksY = lerp(TOP_Y * span, BOTTOM_Y * span, scrollState.worksProgress)
    const tY = lerp(0, worksY, mode) + scrollState.heartY
    const tRot = c.idle + scrollState.premiseP * Math.PI * 0.75 - scrollState.worksRot * DEG
    const tScale = lerp(planet, dive, mode)

    c.y = lerp(c.y, tY, 0.12)
    c.rot += (tRot - c.rot) * 0.1
    c.scale = lerp(c.scale, tScale, 0.1)

    group.current.position.y = c.y
    group.current.rotation.y = c.rot
    group.current.rotation.x = lerp(-0.12, -0.02, mode)
    group.current.scale.setScalar(c.scale * (1 + 0.015 * beat(t * (62 / 60))))
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

useGLTF.preload(asset('heart.glb'))
