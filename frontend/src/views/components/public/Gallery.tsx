import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { ExperiencePhoto } from '@/features/public/experience'
import { useReducedMotion } from '@/controllers/hooks/useReducedMotion'
import '@/styles/gallery.css'

export function Gallery({
  heading,
  photos,
}: {
  heading: string
  photos: ExperiencePhoto[]
}) {
  const [selected, setSelected] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLButtonElement | null>(null)
  const touchStart = useRef<number | null>(null)
  const reduced = useReducedMotion()
  if (!photos.length) return null
  const current = photos[selected] ?? photos[0]
  function move(offset: number) {
    setSelected((index) => (index + offset + photos.length) % photos.length)
  }
  function open(index: number, button: HTMLButtonElement) {
    returnFocus.current = button
    setSelected(index)
    dialog.current?.showModal()
  }
  return (
    <section
      id="gallery"
      className="gallery-chapter"
      aria-labelledby="gallery-heading"
    >
      <h2 id="gallery-heading">{heading}</h2>
      <div className="gallery-composition">
        {photos.map((photo, index) => (
          <figure
            key={photo.id}
            className={`gallery-photo gallery-photo-${index % 8}`}
          >
            <button
              type="button"
              aria-label={`Open photo ${index + 1}: ${photo.alt}`}
              onClick={(event) => open(index, event.currentTarget)}
            >
              <img
                src={photo.src}
                srcSet={
                  photo.smallSrc
                    ? `${photo.smallSrc} 600w, ${photo.src} ${photo.width}w`
                    : undefined
                }
                sizes="(max-width: 700px) 85vw, 60vw"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                style={{
                  objectPosition: `${photo.focalX * 100}% ${photo.focalY * 100}%`,
                }}
              />
            </button>
            {photo.caption && <figcaption>{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-lightbox"
        aria-label="Photographs"
        data-lenis-prevent
        onClose={() => returnFocus.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            move(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return
          const delta =
            (event.changedTouches[0]?.clientX ?? touchStart.current) -
            touchStart.current
          if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1)
          touchStart.current = null
        }}
      >
        <button
          type="button"
          className="lightbox-close"
          aria-label="Close photographs"
          autoFocus
          onClick={() => dialog.current?.close()}
        >
          Close <span aria-hidden="true">×</span>
        </button>
        <motion.figure
          key={current.id}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
        >
          <img
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
          />
          {current.caption && <figcaption>{current.caption}</figcaption>}
        </motion.figure>
        <div className="lightbox-controls">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => move(-1)}
          >
            ← Previous
          </button>
          <span aria-live="polite" aria-atomic="true">
            {selected + 1} / {photos.length}
          </span>
          <button type="button" aria-label="Next photo" onClick={() => move(1)}>
            Next →
          </button>
        </div>
      </dialog>
    </section>
  )
}
