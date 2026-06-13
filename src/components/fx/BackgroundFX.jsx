import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import NeuralNet from './NeuralNet'
import Heart from './Heart'

export default function BackgroundFX() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.6], fov: 55 }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
    >
      <fog attach="fog" args={['#070a0d', 6, 18]} />
      {/* cinematic key + teal rim + crimson core light */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} color="#fff1e6" />
      <directionalLight position={[-5, 1, -3]} intensity={2.6} color="#00E5C4" />
      <pointLight position={[0, -1.2, 2.5]} intensity={9} distance={9} color="#C1121F" />
      {/* faint ambient depth */}
      <NeuralNet count={34} />
      {/* the centerpiece — a real beating heart */}
      <Suspense fallback={null}>
        <Heart />
      </Suspense>
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom luminanceThreshold={0.55} intensity={0.6} radius={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
