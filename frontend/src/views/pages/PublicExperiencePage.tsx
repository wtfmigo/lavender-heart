import { useCallback, useRef, useState } from 'react'
import type { PublicExperience } from '@/features/public/experience'
import { sectionKeySchema } from '@/models/schemas/identifiers'
import { Gallery } from '@/views/components/public/Gallery'
import {
  StoryChapter,
  FullWidthMemory,
  LoveChapter,
  TimelineChapter,
  LetterChapter,
  FinaleChapter,
} from '@/views/components/public/StoryChapters'
import { PersistentHeart } from '@/views/components/public/PersistentHeart'
import { HeartFallback } from '@/three/components/HeartFallback'
import { useJourneyAnimation } from '@/animations/gsap/useJourneyAnimation'
import { useReducedMotion } from '@/controllers/hooks/useReducedMotion'
import { useExperienceAnimation } from '@/animations/gsap/useExperienceAnimation'
import { Hero } from '@/views/components/public/Hero'
import { Intro } from '@/views/components/public/Intro'
import { Navigation } from '@/views/components/public/Navigation'

export function PublicExperiencePage({ data }: { data: PublicExperience }) {
  const container = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [canvasEnabled, setCanvasEnabled] = useState(false)
  const revealCanvas = useCallback(() => setCanvasEnabled(true), [])
  const reducedMotion = prefersReducedMotion || paused
  useExperienceAnimation(container, progress, reducedMotion, revealCanvas)
  useJourneyAnimation(container, progress, reducedMotion)
  const sections = sectionKeySchema.options.flatMap((key) =>
    data.sections.filter(
      (section) =>
        section.key === key &&
        section.visible &&
        (key !== 'gallery' || data.gallery.length > 0) &&
        (key !== 'horizontal_story' || data.story.length > 0) &&
        (key !== 'things_i_love' || data.loveEntries.length > 0) &&
        (key !== 'timeline' || data.timeline.length > 0),
    ),
  )
  const ordered = <T extends { position: number }>(items: T[]) =>
    [...items].sort((a, b) => a.position - b.position)
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
        chapters={sections.map((section) => section.key)}
      />
      <PersistentHeart
        reducedMotion={reducedMotion}
        progress={progress}
        enabled={canvasEnabled}
      />
      <main id="content" tabIndex={-1}>
        {sections.map((section) => {
          switch (section.key) {
            case 'hero':
              return (
                <Hero
                  key={section.key}
                  data={{ ...data, hero: section.content }}
                  nextAnchor={`#${{ intro: 'intro', horizontal_story: 'story', full_width_memory: 'memory', gallery: 'gallery', things_i_love: 'love', timeline: 'timeline', birthday_letter: 'letter', final_closing: 'finale', hero: 'home' }[sections[1]?.key ?? 'final_closing']}`}
                  reducedMotion={reducedMotion}
                  progress={progress}
                  canvasEnabled={canvasEnabled}
                />
              )
            case 'intro':
              return <Intro key={section.key} content={section.content} />
            case 'horizontal_story':
              return (
                <StoryChapter
                  key={section.key}
                  heading={section.content.heading}
                  items={ordered(data.story)}
                />
              )
            case 'full_width_memory':
              return (
                <FullWidthMemory
                  key={section.key}
                  content={section.content}
                  photo={data.memoryPhoto}
                />
              )
            case 'gallery':
              return (
                <Gallery
                  key={section.key}
                  heading={section.content.heading}
                  photos={data.gallery}
                />
              )
            case 'things_i_love':
              return (
                <LoveChapter
                  key={section.key}
                  heading={section.content.heading}
                  items={ordered(data.loveEntries)}
                />
              )
            case 'timeline':
              return (
                <TimelineChapter
                  key={section.key}
                  heading={section.content.heading}
                  items={ordered(data.timeline)}
                />
              )
            case 'birthday_letter':
              return (
                <LetterChapter key={section.key} content={section.content} />
              )
            case 'final_closing':
              return (
                <div key={section.key} className="finale-wrap">
                  {reducedMotion && (
                    <div className="finale-static-heart" aria-hidden="true">
                      <HeartFallback />
                    </div>
                  )}
                  <FinaleChapter
                    content={section.content}
                    settings={data.settings}
                  />
                </div>
              )
          }
        })}
      </main>
      <div className="opening" aria-hidden="true">
        <p className="opening-label">For {data.settings.recipientName}</p>
        <span className="opening-line" />
      </div>
    </div>
  )
}
