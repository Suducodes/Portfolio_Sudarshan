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

const SCALE = 4.6 // FIXED — the heart never grows, shrinks or pops
const TOP_Y = -3.2 // wp=0 → the top of the heart sits at screen centre
const BOTTOM_Y = 3.2 // wp=1 → the bottom (apex) reaches screen centre

/**
 * The heart is a screw thread: a fixed-size object that rotates *as* it rises,
 * so you read it top→bottom across the Works descent. Its rotation is locked to
 * the panel ring (scrollState.worksRot) so the project panels stay pinned to it.
 * No scale ramp, no pop — it simply screws upward, revealing itself.
 */
export default function Heart({ url = asset('heart.glb') }) {
  const group = useRef()
  const { scene } = useGLTF(url)
  const cur = useRef({ y: TOP_Y, rot: 0 })
  const vw = useThree((s) => s.size.width)
  // a phone's view frustum is ~3 units wide at this camera distance — the
  // desktop scale would spill far past both edges, so size it to the viewport
  const scale = vw < 880 ? 2.5 : SCALE
  // vertical FOV is aspect-independent, so ±3.2 is already ~one screen height.
  // On phones the heart is a backdrop to a long list — it should drift, not
  // leave, so it travels roughly half a screen across the whole descent.
  const span = vw < 880 ? 0.5 : 1

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const wp = scrollState.worksProgress
    const reveal = scrollState.heartReveal
    const slide = scrollState.heartY // slides in from below / out the top

    group.current.visible = reveal > 0.01

    const tY = lerp(TOP_Y * span, BOTTOM_Y * span, wp) + slide
    const tRot = -scrollState.worksRot * DEG // pinned to the panels

    const c = cur.current
    c.y = lerp(c.y, tY, 0.12)
    c.rot += (tRot - c.rot) * 0.1

    group.current.position.y = c.y
    group.current.rotation.y = c.rot
    group.current.rotation.x = -0.02
    group.current.scale.setScalar(scale * (1 + 0.015 * beat(t * (62 / 60))))
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
