import { useEffect, useRef, useState, type RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const chapters = [
  'home',
  'intro',
  'story',
  'memory',
  'gallery',
  'love',
  'timeline',
  'letter',
  'finale',
]

export function useJourneyAnimation(
  container: RefObject<HTMLDivElement | null>,
  progressRef: RefObject<number>,
  reducedMotion: boolean,
) {
  const [viewportRevision, setViewportRevision] = useState(0)
  const resizing = useRef(false)
  const reading = useRef<{
    element: HTMLElement
    fraction: number
  } | null>(null)
  const restoreScroll = useRef<{
    top: number
    reading: typeof reading.current
  } | null>(null)
  useEffect(() => {
    let timer = 0
    const resize = () => {
      resizing.current = true
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        restoreScroll.current = {
          top: window.scrollY,
          reading: reading.current,
        }
        // A rapid resize can return to the original dimensions after the old pin fell back.
        setViewportRevision((revision) => revision + 1)
      }, 120)
    }
    window.addEventListener('resize', resize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', resize)
    }
  }, [])
  useGSAP(
    () => {
      const heart =
        container.current?.querySelector<HTMLElement>('.persistent-heart')
      if (!heart) return
      progressRef.current = 0
      heart.dataset.heartVisible = 'true'
      heart.dispatchEvent(new CustomEvent('heartvisibility', { detail: true }))
      if (reducedMotion) {
        reading.current = null
        restoreScroll.current = null
        resizing.current = false
        return
      }
      const lenis = new Lenis({ anchors: true, lerp: 0.085, syncTouch: false })
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      let heartAnchors: { top: number; chapter: number }[] = []
      let readingAnchors: {
        element: HTMLElement
        top: number
        height: number
      }[] = []
      const tick = (time: number) => {
        lenis.raf(time * 1000)
        const scroll = window.scrollY
        // Keep the last reading position before matchMedia removes the old pins.
        if (
          !resizing.current &&
          window.innerWidth === viewport.width &&
          window.innerHeight === viewport.height
        ) {
          const anchor = readingAnchors.findLast((entry) => entry.top <= scroll)
          if (anchor)
            reading.current = {
              element: anchor.element,
              fraction: Math.max(
                0,
                Math.min(1, (scroll - anchor.top) / anchor.height),
              ),
            }
        }
        const next = heartAnchors.findIndex((anchor) => anchor.top > scroll)
        if (next > 0) {
          const previous = heartAnchors[next - 1]
          const following = heartAnchors[next]
          progressRef.current =
            previous.chapter +
            ((following.chapter - previous.chapter) * (scroll - previous.top)) /
              Math.max(1, following.top - previous.top)
        } else if (heartAnchors.length) {
          progressRef.current =
            next === 0 ? heartAnchors[0].chapter : heartAnchors.at(-1)!.chapter
        }
      }
      const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      let disposed = false
      let refreshFrame = 0
      const scheduleRefresh = () => {
        window.cancelAnimationFrame(refreshFrame)
        refreshFrame = window.requestAnimationFrame(() => {
          if (!disposed) {
            ScrollTrigger.refresh()
            lenis.resize()
          }
        })
      }
      const match = gsap.matchMedia()
      match.add(
        { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' },
        (context) => {
          const desktop = !!context.conditions?.desktop
          const finaleSpace = container.current?.querySelector<HTMLElement>(
            '.finale-heart-space',
          )
          const stage =
            container.current?.querySelector<HTMLElement>('.story-stage')
          const track = stage?.querySelector<HTMLElement>('.story-track')
          const nativeStory = () => {
            if (!stage || !track) return
            stage.dataset.storyFlow = 'vertical'
            gsap.set(track, { x: 0 })
          }
          let storyPan: gsap.core.Tween | undefined
          if (
            desktop &&
            stage &&
            track &&
            track.scrollHeight > window.innerHeight + 2
          )
            nativeStory()
          else if (desktop && stage && track) {
            storyPan = gsap.to(track, {
              x: () => -Math.max(0, track.scrollWidth - stage.clientWidth),
              ease: 'none',
              scrollTrigger: {
                trigger: stage,
                start: 'top top',
                end: () =>
                  `+=${Math.max(1, track.scrollWidth - stage.clientWidth)}`,
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
                onRefresh: (self) => {
                  if (track.scrollHeight <= window.innerHeight + 2) return
                  self.kill(true)
                  nativeStory()
                  scheduleRefresh()
                },
              },
            })
          }
          track
            ?.querySelectorAll<HTMLElement>('.story-spread')
            .forEach((spread, index) => {
              const composition = spread.querySelector('.story-memory')
              if (!composition) return
              const pinned = () =>
                !!storyPan?.scrollTrigger &&
                stage?.dataset.storyFlow !== 'vertical'
              const focus = () =>
                (storyPan?.scrollTrigger?.start ?? 0) +
                index * stage!.clientWidth
              const sceneTrigger = {
                trigger: spread,
                start: () =>
                  pinned()
                    ? focus() - stage!.clientWidth * 0.85
                    : 'clamp(top 95%)',
                end: () =>
                  pinned()
                    ? focus() - stage!.clientWidth * 0.1
                    : 'clamp(top 65%)',
                scrub: true,
                invalidateOnRefresh: true,
              }
              gsap.fromTo(
                composition,
                {
                  y: desktop ? 64 : 24,
                  scale: desktop ? 0.94 : 1,
                  clipPath: spread.classList.contains('story-spread--date')
                    ? 'inset(100% 0 0 0)'
                    : 'inset(0 100% 0 0)',
                },
                {
                  y: 0,
                  scale: 1,
                  clipPath: 'inset(0% 0% 0% 0%)',
                  ease: 'power2.out',
                  scrollTrigger: sceneTrigger,
                },
              )
              gsap.fromTo(
                spread,
                { '--story-depth': '36px' },
                {
                  '--story-depth': '-36px',
                  ease: 'none',
                  scrollTrigger: {
                    ...sceneTrigger,
                    start: () =>
                      pinned() ? focus() - stage!.clientWidth : 'top bottom',
                    end: () =>
                      pinned() ? focus() + stage!.clientWidth : 'bottom top',
                  },
                },
              )
            })
          const loveStage =
            container.current?.querySelector<HTMLElement>('.love-stage')
          const loveSequence =
            loveStage?.querySelector<HTMLElement>('.love-sequence')
          let lovePan: gsap.core.Tween | undefined
          const loveOverflows = () =>
            !!loveSequence &&
            [...loveSequence.querySelectorAll<HTMLElement>('.love-entry')].some(
              (entry) => entry.scrollHeight > window.innerHeight + 2,
            )
          const nativeLove = () => {
            if (!loveStage || !loveSequence) return
            loveStage.dataset.loveFlow = 'vertical'
            gsap.set(loveSequence, { y: 0 })
          }
          if (desktop && loveOverflows()) nativeLove()
          else if (desktop && loveStage && loveSequence) {
            lovePan = gsap.to(loveSequence, {
              y: () =>
                -Math.max(
                  0,
                  loveSequence.scrollHeight - loveStage.clientHeight,
                ),
              ease: 'none',
              scrollTrigger: {
                trigger: loveStage,
                start: 'top top',
                end: () =>
                  `+=${Math.max(1, loveSequence.scrollHeight - loveStage.clientHeight)}`,
                pin: true,
                scrub: 0.7,
                invalidateOnRefresh: true,
                onRefresh: (self) => {
                  if (!loveOverflows()) return
                  self.kill(true)
                  nativeLove()
                  scheduleRefresh()
                },
              },
            })
          }
          const memory = container.current?.querySelector('#memory')
          const memoryImage =
            memory?.querySelector<HTMLElement>('.memory-image')
          const memoryDepth = memory?.querySelector('.memory-depth')
          if (memoryDepth) {
            gsap.fromTo(
              memoryDepth,
              { scale: desktop ? 1.08 : 1.025, yPercent: desktop ? 2 : 1 },
              {
                scale: 1,
                yPercent: desktop ? -2 : -1,
                ease: 'none',
                scrollTrigger: {
                  trigger: memory,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            )
          }
          if (
            memoryImage &&
            !memory?.classList.contains('full-memory--portrait') &&
            !memoryImage.getAttribute('src')?.startsWith('/photos/personal/')
          ) {
            gsap.fromTo(
              memoryImage,
              { yPercent: -12, scale: 1.18 },
              {
                yPercent: 12,
                scale: 1.18,
                ease: 'none',
                scrollTrigger: {
                  trigger: memory,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.7,
                },
              },
            )
          }
          // Earlier pinned chapters must exist before measuring collection cloud triggers.
          container.current
            ?.querySelectorAll<HTMLElement>('#gallery .collection-cloud')
            .forEach((cloud) => {
              const opening = cloud.classList.contains(
                'collection-cloud--opening',
              )
              gsap.fromTo(
                cloud,
                { yPercent: 8, xPercent: opening ? -2 : 2 },
                {
                  yPercent: desktop ? -23 : -16,
                  xPercent: opening ? 3 : -3,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: opening
                      ? cloud.parentElement?.querySelector(
                          '.collection-opening',
                        )
                      : cloud.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.65,
                    invalidateOnRefresh: true,
                  },
                },
              )
            })
          container.current
            ?.querySelectorAll<HTMLElement>('.cloud-passage-bank')
            .forEach((cloud) => {
              const front = cloud.classList.contains(
                'cloud-passage-bank--front',
              )
              gsap.fromTo(
                cloud,
                { yPercent: front ? 18 : 8 },
                {
                  yPercent: front ? -26 : -12,
                  xPercent: front ? -5 : 4,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: cloud.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.65,
                  },
                },
              )
            })
          const motionTargets =
            container.current?.querySelectorAll<HTMLElement>(
              '.gallery-photo, .collection-note, .collection-closing > p, .chapter-photo, .chapter-scene .chapter-heading, .intro-support, .full-memory-copy, .love-entry > *, .timeline-date, .timeline-copy > *, .letter-introduction, .letter-opening, .letter-body > *, .letter-signature, .finale h2, .finale-message, .finale-signature',
            )
          motionTargets?.forEach((element) => {
            if (element.closest('.photo-galaxy')) return
            const collection = !!element.closest('#gallery')
            const headline = element.matches(
              '.chapter-heading, .timeline-date, .full-memory-copy',
            )
            const frame = element.matches('.gallery-photo, .chapter-photo')
            const story = element.closest('.story-spread')
            // A spread travels as one composition; its photo and words never reveal separately.
            if (story) return
            const love = element.closest<HTMLElement>('.love-entry')
            const loveStart = () =>
              (lovePan?.scrollTrigger?.start ?? 0) +
              love!.getBoundingClientRect().top -
              loveSequence!.getBoundingClientRect().top
            const pinnedLove = !!lovePan && love
            const scrollTrigger = {
              trigger:
                (collection && element.closest('.collection-spread')) ||
                element,
              start: pinnedLove
                ? () => loveStart() - window.innerHeight * 0.85
                : 'clamp(top 95%)',
              end: pinnedLove
                ? () => loveStart() - window.innerHeight * 0.45
                : 'clamp(top 65%)',
              scrub: 0.45,
              invalidateOnRefresh: true,
            }
            gsap.fromTo(
              element,
              {
                opacity: collection ? 0 : 0.08,
                y: headline ? 64 : frame ? 44 : desktop ? 24 : 16,
                ...(frame ? { scale: desktop ? 0.96 : 1 } : {}),
                ...(headline || collection || frame
                  ? { clipPath: `inset(${headline ? 100 : 18}% 0 0 0)` }
                  : {}),
              },
              {
                opacity: 1,
                y: 0,
                ...(frame ? { scale: 1 } : {}),
                ...(headline || collection || frame
                  ? { clipPath: 'inset(0% 0 0 0)' }
                  : {}),
                ease: 'none',
                scrollTrigger,
              },
            )
            const image = element.matches('.gallery-photo, .chapter-photo')
              ? element.querySelector('img')
              : null
            if (
              image &&
              !image.getAttribute('src')?.startsWith('/photos/personal/')
            )
              gsap.fromTo(
                image,
                {
                  yPercent: -1,
                  scale: 1.05,
                },
                {
                  yPercent: 1,
                  scale: 1.025,
                  ease: 'none',
                  scrollTrigger: {
                    ...scrollTrigger,
                    start: 'top bottom',
                    end: 'bottom top',
                  },
                },
              )
          })
          const position = (id: string, reading = false) => {
            const small = (width: number, opacity: number) => ({
              left: '50%',
              top: '10%',
              width: desktop ? width : 90,
              height: desktop ? width * 1.25 : 112.5,
              opacity,
              rotation: 0,
            })
            const states = {
              home: {
                left: '50%',
                top: '49%',
                width: desktop
                  ? Math.min(window.innerWidth * 0.52, 760)
                  : Math.min(window.innerWidth * 0.92, 440),
                height: window.innerHeight * (desktop ? 0.72 : 0.52),
                opacity: 1,
                rotation: 0,
              },
              intro: { ...small(180, 0.75), top: '20%' },
              story: small(140, desktop ? 0.55 : 0.45),
              memory: small(140, 0),
              gallery: small(140, 0),
              love: small(140, 0.55),
              timeline: small(140, 0.55),
              letter: small(140, 0),
              finale: {
                left: '50%',
                top: finaleSpace
                  ? `${finaleSpace.offsetTop + finaleSpace.clientHeight / 2 + window.innerHeight * 0.1}px`
                  : '38%',
                width: desktop
                  ? Math.min(window.innerWidth * 0.7, 940)
                  : window.innerWidth * 0.92,
                height: Math.min(
                  window.innerHeight * (desktop ? 0.72 : 0.62),
                  finaleSpace ? finaleSpace.clientHeight * 0.95 : Infinity,
                ),
                opacity: 1,
                rotation: 0,
              },
            }
            const state = states[id as keyof typeof states]
            return reading && (!desktop || id === 'love' || id === 'timeline')
              ? { ...state, opacity: 0 }
              : state
          }
          const visibleChapters = chapters
            .map((id) => ({
              id,
              section: container.current?.querySelector<HTMLElement>(`#${id}`),
            }))
            .filter((chapter) => chapter.section)
          if (visibleChapters.length)
            gsap.set(heart, {
              ...position(visibleChapters[0].id),
              x: 0,
              y: 0,
              xPercent: -50,
              yPercent: -50,
            })
          let visible = true
          // Only the collection opening retains its static editorial heart motif.
          visibleChapters.forEach(({ section }) => {
            section!.dataset.liveHeart = String(section!.id !== 'gallery')
          })
          const setHeartY = gsap.quickSetter(heart, 'y', 'px')
          let finaleFollowStart = Infinity
          const updateVisibility = () => {
            // The final sculpture follows its reserved document space while the copy scrolls.
            setHeartY(
              window.scrollY >= finaleFollowStart
                ? finaleFollowStart - window.scrollY
                : 0,
            )
            const next = Number(gsap.getProperty(heart, 'opacity')) > 0.04
            if (next === visible) return
            visible = next
            heart.dataset.heartVisible = String(visible)
            heart.dispatchEvent(
              new CustomEvent('heartvisibility', { detail: visible }),
            )
          }
          const journey = gsap.timeline({ paused: true })
          const scrollLimit = () =>
            Math.max(
              1,
              document.documentElement.scrollHeight - window.innerHeight,
            )
          const rebuild = () => {
            journey.clear()
            const closing = container.current?.querySelector('#finale')
            if (closing && finaleSpace) {
              finaleFollowStart =
                closing.getBoundingClientRect().top +
                window.scrollY -
                window.innerHeight * 0.1
            }
            if (visibleChapters.length)
              journey.set(heart, position(visibleChapters[0].id), 0)
            const documentTop = (element: Element) =>
              element.getBoundingClientRect().top + window.scrollY
            readingAnchors = [
              ...container.current!.querySelectorAll<HTMLElement>(
                `${chapters.map((id) => `#${id}`).join(',')}, .story-spread, .love-entry, .collection-spread, .photo-galaxy, .timeline-moment, .letter-body`,
              ),
            ]
              .map((element) => {
                const pinnedStory =
                  element.matches('.story-spread') &&
                  storyPan?.scrollTrigger &&
                  stage?.dataset.storyFlow !== 'vertical'
                const pinnedLove =
                  element.matches('.love-entry') &&
                  lovePan?.scrollTrigger &&
                  loveStage?.dataset.loveFlow !== 'vertical'
                return {
                  element,
                  top: pinnedStory
                    ? storyPan!.scrollTrigger!.start +
                      [...track!.children].indexOf(element) * stage!.clientWidth
                    : pinnedLove
                      ? lovePan!.scrollTrigger!.start +
                        element.getBoundingClientRect().top -
                        loveSequence!.getBoundingClientRect().top
                      : documentTop(element),
                  height: Math.max(
                    1,
                    pinnedStory
                      ? stage!.clientWidth
                      : element.getBoundingClientRect().height,
                  ),
                }
              })
              .sort((a, b) => a.top - b.top)
            heartAnchors = visibleChapters.map(({ id, section }) => ({
              chapter: chapters.indexOf(id),
              top:
                id === 'home'
                  ? 0
                  : id === 'story' && storyPan?.scrollTrigger
                    ? storyPan.scrollTrigger.start
                    : Math.min(scrollLimit(), documentTop(section!)),
            }))
            const transition = (
              id: string,
              top: number,
              opacity?: number,
              reading = false,
            ) => {
              const entry = !desktop && opacity === undefined && id !== 'finale'
              const start = Math.min(
                scrollLimit() - 1,
                Math.max(
                  0,
                  top -
                    window.innerHeight *
                      (id === 'finale'
                        ? 0.3
                        : desktop && id === 'timeline' && reading
                          ? 0.75
                          : entry
                            ? 0.35
                            : opacity === 0
                              ? 0.55
                              : 0.95),
                ),
              )
              const end = Math.min(
                scrollLimit(),
                Math.max(
                  start + 1,
                  top -
                    window.innerHeight *
                      (id === 'finale'
                        ? 0.1
                        : desktop && id === 'timeline' && reading
                          ? 0.55
                          : entry
                            ? 0.05
                            : opacity === 0
                              ? 0.38
                              : 0.35),
                ),
              )
              journey.to(
                heart,
                {
                  ...position(id, reading),
                  ...(opacity === undefined ? {} : { opacity }),
                  duration: end - start,
                  ease: 'none',
                },
                start,
              )
            }
            visibleChapters.slice(1).forEach(({ section, id }) => {
              transition(id, documentTop(section!))
              if (id === 'gallery') {
                const collection = section!.querySelector(
                  '.gallery-composition',
                )
                if (collection) transition(id, documentTop(collection), 0)
                return
              }
              const scene = section!.querySelector('.chapter-scene')
              const body =
                scene?.nextElementSibling ??
                section!.querySelector('.intro-reading, .full-memory-copy')
              if (desktop && body && ['story', 'love', 'timeline'].includes(id))
                transition(id, documentTop(body), undefined, true)
              if (body && !desktop && id !== 'finale')
                transition(id, documentTop(body), 0, true)
            })
            journey.set({}, {}, scrollLimit())
          }
          rebuild()
          ScrollTrigger.create({
            animation: journey,
            start: 0,
            end: scrollLimit,
            scrub: 0.45,
            onRefresh: (self) => {
              rebuild()
              journey.progress(self.progress)
            },
          })
          gsap.ticker.add(updateVisibility)
          return () => {
            gsap.ticker.remove(updateVisibility)
            journey.kill()
            if (stage) delete stage.dataset.storyFlow
            if (loveStage) delete loveStage.dataset.loveFlow
            visibleChapters.forEach(
              ({ section }) => delete section!.dataset.liveHeart,
            )
          }
        },
      )
      const loaded = (event: Event) => {
        if (!(event.target instanceof HTMLImageElement)) return
        scheduleRefresh()
      }
      const target = container.current
      target?.addEventListener('load', loaded, true)
      const resizeObserver =
        typeof ResizeObserver === 'undefined'
          ? undefined
          : new ResizeObserver(scheduleRefresh)
      target
        ?.querySelectorAll('.story-track, .love-sequence, .photo-galaxy')
        .forEach((element) => resizeObserver?.observe(element))
      void document.fonts?.ready.then(() => {
        if (!disposed) scheduleRefresh()
      })
      if (restoreScroll.current !== null) {
        ScrollTrigger.refresh()
        lenis.resize()
        const saved = restoreScroll.current
        const anchor = readingAnchors.find(
          (entry) => entry.element === saved.reading?.element,
        )
        lenis.scrollTo(
          anchor && saved.reading
            ? anchor.top + anchor.height * saved.reading.fraction
            : saved.top,
          { immediate: true, force: true },
        )
        restoreScroll.current = null
      }
      resizing.current = false
      return () => {
        disposed = true
        window.cancelAnimationFrame(refreshFrame)
        target?.removeEventListener('load', loaded, true)
        resizeObserver?.disconnect()
        match.revert()
        gsap.ticker.remove(tick)
        unsubscribe()
        lenis.destroy()
        progressRef.current = 0
      }
    },
    {
      scope: container,
      dependencies: [reducedMotion, viewportRevision],
      revertOnUpdate: true,
    },
  )
}
