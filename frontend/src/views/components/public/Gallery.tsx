import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { ExperiencePhoto } from '@/features/public/experience'
import { useReducedMotion } from '@/controllers/hooks/useReducedMotion'
import '@/styles/gallery.css'
import { HeartFallback } from '@/three/components/HeartFallback'
import { collectionContent } from '@/features/public/collectionContent'
import { PhotoGalaxy } from './PhotoGalaxy'

export function Gallery({
  heading,
  photos,
  reducedMotion = false,
}: {
  heading: string
  photos: ExperiencePhoto[]
  reducedMotion?: boolean
}) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLButtonElement | null>(null)
  const touchStart = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const reduced = prefersReducedMotion || reducedMotion
  if (!photos.length) return null
  const current = photos[selected] ?? photos[0]
  function move(offset: number) {
    setSelected((index) => (index + offset + photos.length) % photos.length)
  }
  function open(index: number, button: HTMLButtonElement) {
    returnFocus.current = button
    setSelected(index)
    dialog.current?.showModal()
    setLightboxOpen(true)
  }
  function photo(index: number, role: string) {
    const item = photos[index]
    if (!item) return null
    return (
      <figure
        key={item.id}
        className={`gallery-photo collection-photo--${role}`}
        data-orientation={item.height > item.width ? 'portrait' : 'landscape'}
      >
        <button
          type="button"
          aria-label={`Open photo ${index + 1}: ${item.alt}`}
          aria-describedby={
            item.caption && role === 'keepsake'
              ? `photo-caption-${item.id}`
              : undefined
          }
          onClick={(event) => open(index, event.currentTarget)}
        >
          <img
            src={item.src}
            srcSet={
              item.smallSrc
                ? `${item.smallSrc} 600w, ${item.src} ${item.width}w`
                : undefined
            }
            sizes={
              role === 'keepsake'
                ? '(max-width: 700px) 45vw, 240px'
                : '(max-width: 700px) 90vw, 60vw'
            }
            width={item.width}
            height={item.height}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            style={{
              objectPosition: `${item.focalX * 100}% ${item.focalY * 100}%`,
              aspectRatio:
                role === 'keepsake'
                  ? '3 / 4'
                  : `${item.width} / ${item.height}`,
            }}
          />
        </button>
        {item.caption && role !== 'lead' && (
          <figcaption id={`photo-caption-${item.id}`}>
            {item.caption}
          </figcaption>
        )}
      </figure>
    )
  }
  function note(index: number, number: string) {
    const [title, ...body] = photos[index].caption.split('\n')
    return (
      <div className="collection-note">
        <span className="collection-number">
          {number}
          <span aria-hidden="true" />
        </span>
        {title && <h3>{title}</h3>}
        {body.length > 0 && <p>{body.join(' ')}</p>}
      </div>
    )
  }
  return (
    <>
      <section
        id="gallery"
        className="gallery-chapter"
        aria-labelledby="gallery-heading"
      >
        <header className="collection-opening chapter-scene">
          <div
            className="collection-cloud collection-cloud--opening"
            aria-hidden="true"
          />
          <div className="collection-intro">
            <span className="chapter-scene-label">03 /</span>
            <h2 id="gallery-heading" className="chapter-heading">
              {heading}
            </h2>
            <p>{collectionContent.intro}</p>
          </div>
          <div className="chapter-heart" aria-hidden="true">
            <HeartFallback />
          </div>
          <div className="collection-opening-photos">
            {photo(0, 'portrait')}
            {photo(1, 'opening-detail')}
          </div>
        </header>
        <div className="gallery-composition">
          {photos[2] && (
            <article className="collection-spread collection-spread--air">
              {photo(2, 'lead')}
              {note(2, '01')}
              {photo(3, 'support')}
            </article>
          )}
          {photos[4] && (
            <article className="collection-spread collection-spread--moments">
              {photo(4, 'lead')}
              {note(4, '02')}
              {photo(5, 'detail')}
              {photo(6, 'landscape')}
            </article>
          )}
          {photos[7] && (
            <article className="collection-spread collection-spread--wander">
              {photo(7, 'lead')}
              {note(7, '03')}
              {photo(8, 'street')}
              {photo(9, 'postcard')}
            </article>
          )}
          {photos.length > 10 && (
            <PhotoGalaxy
              photos={photos.slice(10)}
              renderPhoto={(index) => photo(index + 10, 'keepsake')}
              reducedMotion={reduced}
              lightboxOpen={lightboxOpen}
            />
          )}
        </div>
        <footer className="collection-closing">
          <div
            className="collection-cloud collection-cloud--closing"
            aria-hidden="true"
          >
            <span className="collection-cloud-bank collection-cloud-bank--left" />
            <span className="collection-cloud-bank collection-cloud-bank--right" />
          </div>
          <span className="chapter-scene-label">
            {collectionContent.closingLabel}
          </span>
          <span className="collection-closing-line" aria-hidden="true" />
          <p>{collectionContent.closing}</p>
          <span className="collection-signoff" aria-hidden="true">
            ♡
          </span>
        </footer>
        <dialog
          ref={dialog}
          className="gallery-lightbox"
          aria-label="Photographs"
          onClose={() => {
            setLightboxOpen(false)
            returnFocus.current?.focus()
          }}
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
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => move(1)}
            >
              Next →
            </button>
          </div>
        </dialog>
      </section>
    </>
  )
}
