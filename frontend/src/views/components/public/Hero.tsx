import type { RefObject } from 'react'
import type { ExperienceSlice } from '@/features/public/experience'
import { CrystalHeart } from '@/three/components/CrystalHeart'
import { CloudAtmosphere } from './CloudAtmosphere'

export function Hero({
  data,
  reducedMotion,
  progress,
  canvasEnabled = true,
}: {
  data: ExperienceSlice
  reducedMotion: boolean
  progress: RefObject<number>
  canvasEnabled?: boolean
}) {
  const [first, ...rest] = data.settings.recipientName.split(' ')
  return (
    <section
      id="home"
      className="hero"
      aria-labelledby="recipient"
      data-long-name={data.settings.recipientName.length > 28}
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
        <div className="heart-travel">
          <div className="heart-reveal">
            <CrystalHeart
              reducedMotion={reducedMotion}
              progress={progress}
              enabled={canvasEnabled}
            />
          </div>
        </div>
        <p className="hero-love editorial-label">{data.hero.subtitle}</p>
        <div className="hero-footnote">
          <span className="editorial-label">A BIRTHDAY EXPERIENCE</span>
          <a href="#intro" className="scroll-cue">
            Scroll to begin <span aria-hidden="true">↓</span>
          </a>
          <span className="editorial-label hero-demo">DEMO EDITION</span>
        </div>
      </div>
    </section>
  )
}
