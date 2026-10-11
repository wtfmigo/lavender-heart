import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import type { ExperiencePhoto } from '@/features/public/experience'

export function PhotoGalaxy({
  photos,
  renderPhoto,
  reducedMotion,
  lightboxOpen,
}: {
  photos: ExperiencePhoto[]
  renderPhoto: (index: number) => ReactNode
  reducedMotion: boolean
  lightboxOpen: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const rotor = useRef<HTMLDivElement>(null)
  const angle = useRef({ yaw: 0, pitch: 0 })
  const pointer = useRef<{
    x: number
    y: number
    yaw: number
    pitch: number
  } | null>(null)
  const dragged = useRef(false)
  const [paused, setPaused] = useState(false)
  const [list, setList] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [interacting, setInteracting] = useState(false)
  const instructions = useId()
  function rotate(yaw: number, pitch: number) {
    angle.current = { yaw, pitch: Math.max(-65, Math.min(65, pitch)) }
    rotor.current?.style.setProperty('--galaxy-yaw', `${yaw}deg`)
    rotor.current?.style.setProperty(
      '--galaxy-pitch',
      `${angle.current.pitch}deg`,
    )
  }
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    )
    if (root.current) observer.observe(root.current)
    const visibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])
  useEffect(() => {
    if (
      paused ||
      list ||
      reducedMotion ||
      lightboxOpen ||
      !visible ||
      hidden ||
      interacting
    )
      return
    let frame = 0
    let previous: number | undefined
    const tick = (time: number) => {
      if (previous !== undefined)
        rotate(
          angle.current.yaw + Math.min(time - previous, 50) * 0.004,
          angle.current.pitch,
        )
      previous = time
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [paused, list, reducedMotion, lightboxOpen, visible, hidden, interacting])
  return (
    <div
      ref={root}
      className="photo-galaxy collection-details"
      data-view={list ? 'list' : 'sphere'}
    >
      <div className="photo-galaxy-controls">
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          disabled={reducedMotion}
        >
          {paused ? 'Resume rotation' : 'Pause rotation'}
        </button>
        <button
          type="button"
          onClick={() => setList(!list)}
          aria-pressed={list}
        >
          {list ? 'Show galaxy' : 'Show photo list'}
        </button>
      </div>
      <p id={instructions} className="photo-galaxy-instructions">
        {list
          ? 'Select a photo to view it.'
          : 'Drag to explore. Use arrow keys to rotate, or show the photo list.'}
      </p>
      <div
        className="photo-galaxy-stage"
        role="group"
        aria-label="Rotate photo galaxy"
        aria-describedby={instructions}
        tabIndex={list ? -1 : 0}
        data-lenis-prevent
        onPointerEnter={() => setInteracting(true)}
        onPointerLeave={() => {
          if (!pointer.current) setInteracting(false)
        }}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setInteracting(false)
        }}
        onKeyDown={(event) => {
          if (
            list ||
            !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
              event.key,
            )
          )
            return
          event.preventDefault()
          rotate(
            angle.current.yaw +
              (event.key === 'ArrowLeft'
                ? -12
                : event.key === 'ArrowRight'
                  ? 12
                  : 0),
            angle.current.pitch +
              (event.key === 'ArrowUp'
                ? -12
                : event.key === 'ArrowDown'
                  ? 12
                  : 0),
          )
        }}
        onPointerDown={(event) => {
          if (list || event.button !== 0) return
          dragged.current = false
          pointer.current = {
            x: event.clientX,
            y: event.clientY,
            ...angle.current,
          }
          setInteracting(true)
        }}
        onPointerMove={(event) => {
          const start = pointer.current
          if (!start) return
          const dx = event.clientX - start.x,
            dy = event.clientY - start.y
          if (Math.hypot(dx, dy) > 6) {
            dragged.current = true
            event.currentTarget.setPointerCapture?.(event.pointerId)
            rotate(start.yaw + dx * 0.35, start.pitch - dy * 0.35)
          }
        }}
        onPointerUp={(event) => {
          pointer.current = null
          if (event.currentTarget.hasPointerCapture?.(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId)
          setInteracting(event.currentTarget.contains(document.activeElement))
        }}
        onPointerCancel={() => {
          pointer.current = null
          dragged.current = false
          setInteracting(false)
        }}
        onClickCapture={(event) => {
          if (!list && dragged.current && event.detail !== 0) {
            event.preventDefault()
            event.stopPropagation()
            dragged.current = false
          }
        }}
      >
        <div
          ref={rotor}
          className="photo-galaxy-rotor"
          style={
            {
              '--galaxy-yaw': '0deg',
              '--galaxy-pitch': '0deg',
              '--galaxy-card-width': `${Math.max(44, Math.min(120, 420 / Math.sqrt(photos.length)))}px`,
            } as CSSProperties
          }
        >
          {photos.map((photo, index) => {
            const y =
              photos.length === 1 ? 0 : 1 - (2 * (index + 0.5)) / photos.length
            const ring = Math.sqrt(1 - y * y)
            const theta = index * Math.PI * (3 - Math.sqrt(5))
            return (
              <div
                key={photo.id}
                className="photo-galaxy-position"
                onFocus={() => {
                  if (!list && !pointer.current)
                    rotate(
                      (-theta * 180) / Math.PI,
                      (Math.atan2(y, ring) * 180) / Math.PI,
                    )
                }}
                style={
                  {
                    '--photo-x': Math.sin(theta) * ring,
                    '--photo-y': y,
                    '--photo-z': Math.cos(theta) * ring,
                  } as CSSProperties
                }
              >
                <div className="photo-galaxy-facing">{renderPhoto(index)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
