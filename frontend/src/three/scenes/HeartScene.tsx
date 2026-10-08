import { useMemo, useRef, useEffect, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { MathUtils, type Mesh } from 'three'
import { createHeartGeometry } from '@/three/utils/heartGeometry'
import { HeartFallback } from '@/three/components/HeartFallback'

type Props = {
  reducedMotion: boolean
  progress: RefObject<number>
  active: boolean
  onReady: () => void
  onFailure: () => void
}

function subscribeMobile(onChange: () => void) {
  const media = window.matchMedia('(max-width: 600px)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function Sculpture({
  reducedMotion,
  progress,
}: Pick<Props, 'reducedMotion' | 'progress'>) {
  const mesh = useRef<Mesh>(null)
  const geometry = useMemo(() => createHeartGeometry(), [])
  useEffect(() => () => geometry.dispose(), [geometry])
  const elapsed = useRef(0)
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    invalidate()
  }, [reducedMotion, invalidate])
  useFrame((state, delta) => {
    if (!mesh.current) return
    const travel = reducedMotion ? 0 : progress.current
    if (!reducedMotion) elapsed.current += Math.min(delta, 0.05)
    const time = elapsed.current
    mesh.current.rotation.y =
      -0.24 +
      (reducedMotion
        ? 0
        : Math.sin(time * 0.17) * 0.11 + state.pointer.x * 0.035) +
      travel * 0.5
    mesh.current.rotation.x =
      0.06 + (reducedMotion ? 0 : state.pointer.y * 0.02) - travel * 0.1
    mesh.current.rotation.z = -0.08 + travel * 0.15
    mesh.current.position.y = reducedMotion
      ? 0
      : Math.sin(time * 0.35) * 0.035 + travel * 0.2
    mesh.current.scale.setScalar(1 - travel * 0.2)
    state.camera.position.z = MathUtils.lerp(
      state.camera.position.z,
      5.1 + travel * 0.3,
      0.1,
    )
  })
  const palette = useMemo(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      tint: styles.getPropertyValue('--color-lavender-mist').trim(),
      pearl: styles.getPropertyValue('--color-pearl').trim(),
      lilac: styles.getPropertyValue('--color-lilac').trim(),
    }
  }, [])
  // ponytail: DOM clouds stay outside the refraction buffer; add scene textures only if true cloud refraction is needed.
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={3}
        color={palette.pearl}
      />
      <mesh ref={mesh} geometry={geometry} rotation={[0.06, -0.24, -0.08]}>
        <meshPhysicalMaterial
          color={palette.tint}
          metalness={0.02}
          roughness={0.075}
          transmission={0.96}
          thickness={1.1}
          ior={1.48}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.2}
        />
      </mesh>
      <Environment resolution={128} frames={1}>
        <Lightformer
          position={[-3, 4, 2]}
          rotation={[0, 0.4, 0]}
          scale={[3, 6, 1]}
          intensity={4}
          color={palette.pearl}
        />
        <Lightformer
          position={[4, 1, 3]}
          rotation={[0, -0.7, 0]}
          scale={[1, 5, 1]}
          intensity={3}
          color={palette.pearl}
        />
        <Lightformer
          position={[0, -3, -2]}
          scale={[5, 2, 1]}
          intensity={2}
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
    () => window.matchMedia('(max-width: 600px)').matches,
    () => true,
  )
  return (
    <Canvas
      camera={{ position: [0, 0, 5.1], fov: mobile ? 42 : 32 }}
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      frameloop={active && !reducedMotion ? 'always' : 'demand'}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      fallback={<HeartFallback />}
    >
      <Sculpture reducedMotion={reducedMotion} progress={progress} />
      <ContextLifecycle onReady={onReady} onFailure={onFailure} />
    </Canvas>
  )
}
