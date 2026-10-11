import type { RefObject } from 'react'
import type { ExperienceSlice } from '@/features/public/experience'
import { CloudAtmosphere } from './CloudAtmosphere'

export function Hero({
  data,
  nextAnchor = '#intro',
}: {
  data: ExperienceSlice
  reducedMotion: boolean
  progress: RefObject<number>
  canvasEnabled?: boolean
  nextAnchor?: string
}) {
  const [first, ...rest] = data.settings.recipientName.split(' ')
  return (
    <section
      id="home"
      className="hero"
      aria-labelledby="recipient"
      data-long-name={data.settings.recipientName.length > 24}
    >
      <div className="hero-stage">
        <div className="hero-sky" aria-hidden="true" />
        <CloudAtmosphere />
        <div className="hero-type-travel">
          <div className="hero-type-reveal">
            <p className="hero-for editorial-label">{data.hero.title}</p>
            <h1 id="recipient">
              <span>{first}</span>
              {rest.length > 0 && <span> {rest.join(' ')}</span>}
            </h1>
          </div>
        </div>
        <p className="hero-love editorial-label">{data.hero.subtitle}</p>
        <div className="hero-footnote">
          <a href={nextAnchor} className="scroll-cue">
            Scroll to begin <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}
