import { useMemo, useRef, useEffect, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { BackSide, MathUtils, type Mesh } from 'three'
import { createHeartGeometry } from '@/three/utils/heartGeometry'
import { heartYaw } from '@/three/utils/heartMotion'
import { HeartFallback } from '@/three/components/HeartFallback'

type Props = {
  reducedMotion: boolean
  progress: RefObject<number>
  active: boolean
  onReady: () => void
  onFailure: () => void
}

function subscribeMobile(onChange: () => void) {
  const media = window.matchMedia('(max-width: 768px)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function Sculpture({
  reducedMotion,
  progress,
}: Pick<Props, 'reducedMotion' | 'progress'>) {
  const mesh = useRef<Mesh>(null)
  const invalidate = useThree((state) => state.invalidate)
  const geometry = useMemo(() => createHeartGeometry(), [])
  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => {
    invalidate()
  }, [reducedMotion, invalidate])
  useFrame(({ clock }, delta) => {
    if (!mesh.current) return
    const angle = heartYaw(progress.current, clock.elapsedTime, reducedMotion)
    mesh.current.rotation.y = reducedMotion
      ? angle
      : MathUtils.damp(mesh.current.rotation.y, angle, 8, delta)
    mesh.current.rotation.x = reducedMotion
      ? 0.06
      : MathUtils.damp(
          mesh.current.rotation.x,
          0.06 + (angle + 0.24) * 0.12,
          8,
          delta,
        )
    mesh.current.rotation.z = reducedMotion
      ? -0.08
      : MathUtils.damp(
          mesh.current.rotation.z,
          -0.08 + (angle + 0.24) * 0.08,
          8,
          delta,
        )
    mesh.current.position.y = reducedMotion
      ? 0
      : Math.sin(clock.elapsedTime * 0.45) * 0.018
  })
  const palette = useMemo(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      tint: styles.getPropertyValue('--color-lavender-mist').trim(),
      pearl: styles.getPropertyValue('--color-pearl').trim(),
      lilac: styles.getPropertyValue('--color-lilac').trim(),
      dusty: styles.getPropertyValue('--color-purple-dusty').trim(),
    }
  }, [])
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
        color={palette.pearl}
      />
      <mesh ref={mesh} geometry={geometry} rotation={[0.06, -0.24, -0.08]}>
        <meshPhysicalMaterial
          color={palette.tint}
          metalness={0}
          roughness={0.1}
          transparent
          opacity={0.78}
          depthWrite={false}
          transmission={0}
          ior={1.58}
          clearcoat={1}
          clearcoatRoughness={0.045}
          envMapIntensity={1.5}
        />
      </mesh>
      <Environment resolution={128} frames={1} background={false}>
        <mesh scale={20}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshBasicMaterial color={palette.dusty} side={BackSide} />
        </mesh>
        <Lightformer
          position={[-3, 4, 2]}
          scale={[0.6, 6, 1]}
          intensity={5}
          color={palette.pearl}
        />
        <Lightformer
          position={[4, 1, 3]}
          scale={[0.35, 5, 1]}
          intensity={4}
          color={palette.pearl}
        />
        <Lightformer
          position={[-1, 3, 4]}
          scale={[3, 2, 1]}
          intensity={3}
          color={palette.pearl}
        />
        <Lightformer
          position={[0, -3, -2]}
          scale={[5, 2, 1]}
          intensity={1.5}
          color={palette.lilac}
        />
      </Environment>
    </>
  )
}

function ContextLifecycle({
  onReady,
  onFailure,
}: Pick<Props, 'onReady' | 'onFailure'>) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const canvas = gl.domElement
    canvas.setAttribute('data-webgl', 'ready')
    const lost = (event: Event) => {
      event.preventDefault()
      onFailure()
    }
    canvas.addEventListener('webglcontextlost', lost)
    onReady()
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [gl, onReady, onFailure])
  return null
}

export default function HeartScene({
  reducedMotion,
  progress,
  active,
  onReady,
  onFailure,
}: Props) {
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia('(max-width: 768px)').matches,
    () => true,
  )
  return (
    <Canvas
      // Keep the GPU viewport stable while the chapter frame animates its size.
      resize={{ offsetSize: true, scroll: false, debounce: 0 }}
      style={{
        width: 750,
        height: 750,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(var(--heart-render-scale, 1))',
      }}
      camera={{ position: [0, 0, 5.1], fov: mobile ? 42 : 32 }}
      dpr={[1, 1.25]}
      frameloop={active && !reducedMotion ? 'always' : 'demand'}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      fallback={<HeartFallback />}
    >
      <Sculpture reducedMotion={reducedMotion} progress={progress} />
      <ContextLifecycle onReady={onReady} onFailure={onFailure} />
    </Canvas>
  )
}
