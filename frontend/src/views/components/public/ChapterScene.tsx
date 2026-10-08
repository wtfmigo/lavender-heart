import { HeartFallback } from '@/three/components/HeartFallback'
import '@/styles/chapter-scenes.css'

export function ChapterScene({
  heading,
  headingId,
  label,
  variant = '',
}: {
  heading: string
  headingId: string
  label: string
  variant?: string
}) {
  return (
    <div
      className={`chapter-scene${variant ? ` chapter-scene--${variant}` : ''}`}
    >
      <span className="chapter-scene-label">{label}</span>
      <div className="chapter-heart" aria-hidden="true">
        <HeartFallback />
      </div>
      <h2 id={headingId} className="chapter-heading">
        {heading}
      </h2>
    </div>
  )
}
