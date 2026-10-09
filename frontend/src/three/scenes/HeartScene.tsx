import { useMemo, useRef, useEffect, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  useTexture,
} from '@react-three/drei'
import {
  BackSide,
  CanvasTexture,
  MathUtils,
  SRGBColorSpace,
  type Mesh,
} from 'three'
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
  const media = window.matchMedia('(max-width: 768px)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function Sculpture({
  reducedMotion,
  progress,
  mobile,
}: Pick<Props, 'reducedMotion' | 'progress'> & { mobile: boolean }) {
  const mesh = useRef<Mesh>(null)
  const invalidate = useThree((state) => state.invalidate)
  const cloud = useTexture(
    mobile
      ? '/atmosphere/cloud-bank-small.webp'
      : '/atmosphere/cloud-bank.webp',
  )
  const geometry = useMemo(() => createHeartGeometry(), [])
  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => {
    invalidate()
  }, [reducedMotion, invalidate])
  useFrame((_, delta) => {
    if (!mesh.current) return
    const travel = reducedMotion ? 0 : progress.current
    const angle = -0.24 - travel * 1.8
    mesh.current.rotation.y = reducedMotion
      ? angle
      : MathUtils.damp(mesh.current.rotation.y, angle, 8, delta)
    mesh.current.rotation.x = 0.06
    mesh.current.rotation.z = -0.08
    mesh.current.position.y = 0
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
  const backdrop = useMemo(() => {
    const image = cloud.image
    if (!(image instanceof HTMLImageElement) || !image.naturalWidth)
      throw new Error('Crystal cloud backdrop is unavailable')
    const canvas = document.createElement('canvas')
    canvas.width = mobile ? 256 : 512
    canvas.height = Math.round(
      (canvas.width * image.naturalHeight) / image.naturalWidth,
    )
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Crystal backdrop canvas is unavailable')
    context.fillStyle = palette.pearl
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.filter = 'saturate(0.52)'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [cloud, mobile, palette.pearl])
  useEffect(() => {
    invalidate()
    return () => backdrop.dispose()
  }, [backdrop, invalidate])
  // ponytail: refraction contains the original cloud backdrop; DOM typography requires a future scene texture.
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
        color={palette.pearl}
      />
      <mesh ref={mesh} geometry={geometry} rotation={[0.06, -0.24, -0.08]}>
        <MeshTransmissionMaterial
          background={backdrop}
          samples={4}
          resolution={mobile ? 256 : 512}
          backside={false}
          chromaticAberration={0}
          distortion={0}
          temporalDistortion={0}
          color={palette.pearl}
          metalness={0}
          roughness={0.045}
          transmission={1}
          thickness={1.2}
          attenuationColor={palette.tint}
          attenuationDistance={2}
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
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      frameloop={active && !reducedMotion ? 'always' : 'demand'}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      fallback={<HeartFallback />}
    >
      <Sculpture
        reducedMotion={reducedMotion}
        progress={progress}
        mobile={mobile}
      />
      <ContextLifecycle onReady={onReady} onFailure={onFailure} />
    </Canvas>
  )
}
