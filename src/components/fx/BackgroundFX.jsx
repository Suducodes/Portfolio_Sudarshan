import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import Nebula from './Nebula'
import Heart from './Heart'
import SafeModel from './SafeModel'
import { scrollState } from '../../lib/scrollState'

/**
 * Caps the WebGL backing-buffer *width* so render cost stops scaling with the
 * display — a 4K screen renders the heart at the same fragment count as 1080p.
 * The cap tightens while the heart section is on screen (big heart + Bloom +
 * the CSS-3D orbit composite together there). Switches only when the cap or the
 * section state changes, never per frame.
 */
function AdaptiveResolution({ capIdle = 1600, capHeart = 1200 }) {
  const gl = useThree((s) => s.gl)
  const width = useThree((s) => s.size.width)
  const cur = useRef(-1)
  useFrame(() => {
    const cap = scrollState.heartReveal > 0.08 ? capHeart : capIdle
    const want = Math.min(1, cap / width)
    if (Math.abs(cur.current - want) > 0.01) {
      cur.current = want
      gl.setPixelRatio(want)
    }
  })
  return null
}

export default function BackgroundFX() {
  return (
    <Canvas
      dpr={1}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.6], fov: 55 }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
    >
      <AdaptiveResolution />
      <fog attach="fog" args={['#070a0d', 6, 18]} />
      {/* cinematic key + teal rim + crimson core light */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 4]} intensity={2.0} color="#fff1e6" />
      <directionalLight position={[-5, 1, -3]} intensity={2.4} color="#00E5C4" />
      <pointLight position={[0, -1.2, 2.5]} intensity={7} distance={9} color="#C1121F" />
      {/* procedural atmosphere — hidden while the heart dominates the screen */}
      <Nebula />
      {/* the centerpiece — a real beating heart, screwing up through the works */}
      <SafeModel>
        <Suspense fallback={null}>
          <Heart />
        </Suspense>
      </SafeModel>
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom luminanceThreshold={0.62} intensity={0.34} kernelSize={KernelSize.SMALL} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
