import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import Nebula from './Nebula'
import Heart from './Heart'
import SafeModel from './SafeModel'
import { scrollState } from '../../lib/scrollState'

/**
 * Renders the whole scene at full resolution normally, but drops the device
 * pixel ratio while the heart section is on screen — that's when the cost is
 * highest (big heart + Bloom + the CSS-3D orbit on top) and fragment count is
 * what kills FPS on large displays. Halving dpr ≈ a quarter of the fragments.
 * Only switches on section enter/exit, never per frame.
 */
function AdaptiveResolution({ base = 1, low = 0.62 }) {
  const gl = useThree((s) => s.gl)
  const cur = useRef(-1)
  useFrame(() => {
    const want = scrollState.heartReveal > 0.08 ? low : base
    if (cur.current !== want) {
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
