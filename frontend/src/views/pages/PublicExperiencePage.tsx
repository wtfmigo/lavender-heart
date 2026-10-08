import { useCallback, useRef, useState } from 'react'
import type { ExperienceSlice } from '@/features/public/experience'
import { useReducedMotion } from '@/controllers/hooks/useReducedMotion'
import { useExperienceAnimation } from '@/animations/gsap/useExperienceAnimation'
import { Hero } from '@/views/components/public/Hero'
import { Intro } from '@/views/components/public/Intro'
import { Navigation } from '@/views/components/public/Navigation'

export function PublicExperiencePage({ data }: { data: ExperienceSlice }) {
  const container = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [canvasEnabled, setCanvasEnabled] = useState(false)
  const revealCanvas = useCallback(() => setCanvasEnabled(true), [])
  const reducedMotion = prefersReducedMotion || paused
  useExperienceAnimation(container, progress, reducedMotion, revealCanvas)
  return (
    <div
      className="experience"
      ref={container}
      data-motion={reducedMotion ? 'reduced' : 'full'}
    >
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Navigation
        paused={paused}
        onToggleMotion={() => setPaused((value) => !value)}
      />
      <main id="content" tabIndex={-1}>
        <Hero
          data={data}
          reducedMotion={reducedMotion}
          progress={progress}
          canvasEnabled={canvasEnabled}
        />
        <Intro content={data.intro} />
      </main>
      <div className="opening" aria-hidden="true">
        <p className="opening-label">For {data.settings.recipientName}</p>
        <span className="opening-line" />
      </div>
    </div>
  )
}
