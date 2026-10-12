import { useCallback, useLayoutEffect, useRef, useState } from 'react'
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
import { useReducedMotion } from '@/controllers/hooks/useReducedMotion'
import { Hero } from '@/views/components/public/Hero'
import { Intro } from '@/views/components/public/Intro'
import { Navigation } from '@/views/components/public/Navigation'
import { useReadingPosition } from '@/controllers/hooks/useReadingPosition'
import { useExperienceAnimation } from '@/animations/gsap/useExperienceAnimation'
import { useJourneyAnimation } from '@/animations/gsap/useJourneyAnimation'
import { FolderOpening } from '@/views/components/public/FolderOpening'

export function PublicExperiencePage({ data }: { data: PublicExperience }) {
  const root = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const [previewMotion] = useState(() =>
    new URLSearchParams(window.location.search).get('motion'),
  )
  const [paused, setPaused] = useState(previewMotion === 'off')
  const [canvasEnabled, setCanvasEnabled] = useState(false)
  const [entered, setEntered] = useState(false)
  const enter = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setEntered(true)
  }, [])
  const revealCanvas = useCallback(() => setCanvasEnabled(true), [])
  const reducedMotion = prefersReducedMotion || paused
  useExperienceAnimation(root, reducedMotion, revealCanvas, entered)
  useJourneyAnimation(root, progress, reducedMotion || !entered)
  useReadingPosition(root)
  useLayoutEffect(() => {
    if (entered) {
      root.current
        ?.querySelector<HTMLElement>('#content')
        ?.focus({ preventScroll: true })
      return
    }
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previous
    }
  }, [entered])
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
      ref={root}
      className="experience"
      data-motion={reducedMotion ? 'reduced' : 'full'}
      data-scroll="native"
    >
      <div
        className="experience-content"
        inert={!entered}
        aria-hidden={!entered}
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
          enabled={
            canvasEnabled && previewMotion !== 'off' && previewMotion !== 'css'
          }
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
                    reducedMotion={reducedMotion}
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
                    reducedMotion={reducedMotion}
                  />
                )
              case 'things_i_love':
                return (
                  <LoveChapter
                    key={section.key}
                    reducedMotion={reducedMotion}
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
      </div>
      {!entered && (
        <FolderOpening
          recipientName={data.settings.recipientName}
          reducedMotion={reducedMotion}
          onEnter={enter}
        />
      )}
    </div>
  )
}
