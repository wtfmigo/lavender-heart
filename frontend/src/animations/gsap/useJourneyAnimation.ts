import type { RefObject } from 'react'
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
  useGSAP(
    () => {
      const heart =
        container.current?.querySelector<HTMLElement>('.persistent-heart')
      if (!heart) return
      progressRef.current = 0
      heart.dataset.heartVisible = 'true'
      heart.dispatchEvent(new CustomEvent('heartvisibility', { detail: true }))
      if (reducedMotion) return
      const lenis = new Lenis({ anchors: true, lerp: 0.085, syncTouch: false })
      let closingStart = Infinity
      let closingEnd = Infinity
      const tick = (time: number) => {
        lenis.raf(time * 1000)
        const travel = window.scrollY / window.innerHeight
        const closingProgress = Math.min(
          1,
          Math.max(
            0,
            (window.scrollY - closingStart) /
              Math.max(1, closingEnd - closingStart),
          ),
        )
        const startPhase = closingStart / window.innerHeight
        const frontPhase =
          (Math.ceil((startPhase * 1.8) / (Math.PI * 2)) * Math.PI * 2) / 1.8
        progressRef.current =
          window.scrollY > closingStart
            ? startPhase + (frontPhase - startPhase) * closingProgress
            : travel
      }
      const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      let disposed = false
      let refreshFrame = 0
      const scheduleRefresh = () => {
        window.cancelAnimationFrame(refreshFrame)
        refreshFrame = window.requestAnimationFrame(() => {
          if (!disposed) {
            lenis.resize()
            ScrollTrigger.refresh()
          }
        })
      }
      const match = gsap.matchMedia()
      match.add(
        { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' },
        (context) => {
          const desktop = !!context.conditions?.desktop
          const memory = container.current?.querySelector('#memory')
          const memoryImage =
            memory?.querySelector<HTMLElement>('.memory-image')
          if (memoryImage) {
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
          const stage =
            container.current?.querySelector<HTMLElement>('.story-stage')
          const track = stage?.querySelector<HTMLElement>('.story-track')
          let storyPan: gsap.core.Tween | undefined
          const nativeStory = () => {
            if (!stage || !track) return
            stage.dataset.storyFlow = 'vertical'
            gsap.set(track, { x: 0 })
          }
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
                  `+=${Math.max(window.innerHeight, track.scrollWidth - stage.clientWidth)}`,
                pin: true,
                scrub: 0.7,
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
          const motionTargets =
            container.current?.querySelectorAll<HTMLElement>(
              '.gallery-photo, .chapter-photo, .chapter-scene .chapter-heading, .intro-support, .story-copy > *, .full-memory-copy, .love-entry > *, .timeline-date, .timeline-copy > *, .letter-introduction, .letter-opening, .letter-body > *, .letter-signature, .finale h2, .finale-message, .finale-signature',
            )
          motionTargets?.forEach((element) => {
            const photoFrame = element.querySelector<HTMLElement>(
              'button, .photo-window',
            )
            const story = element.closest('.story-spread')
            const love = element.closest<HTMLElement>('.love-entry')
            const loveStart = () =>
              (lovePan?.scrollTrigger?.start ?? 0) +
              love!.getBoundingClientRect().top -
              loveSequence!.getBoundingClientRect().top
            const pinnedLove = !!lovePan && love
            const scrollTrigger = {
              trigger: element,
              start: pinnedLove
                ? () => loveStart() - window.innerHeight * 0.85
                : story && storyPan
                  ? 'left 95%'
                  : 'clamp(top 95%)',
              end: pinnedLove
                ? () => loveStart() - window.innerHeight * 0.45
                : story && storyPan
                  ? 'left 65%'
                  : 'clamp(top 65%)',
              ...(story && storyPan ? { containerAnimation: storyPan } : {}),
              scrub: 0.45,
              invalidateOnRefresh: true,
            }
            gsap.fromTo(
              photoFrame ?? element,
              { opacity: 0.08, y: desktop ? 110 : 64 },
              {
                opacity: 1,
                y: 0,
                ease: 'none',
                scrollTrigger,
              },
            )
            const image = element.matches('.gallery-photo, .chapter-photo')
              ? element.querySelector('img')
              : null
            if (image)
              gsap.fromTo(
                image,
                { yPercent: -12, scale: 1.42 },
                {
                  yPercent: 12,
                  scale: 1.3,
                  ease: 'none',
                  scrollTrigger: {
                    ...scrollTrigger,
                    start: story && storyPan ? 'left right' : 'top bottom',
                    end: story && storyPan ? 'right left' : 'bottom top',
                  },
                },
              )
          })
          const position = (id: string) => {
            const companion = (
              width: number,
              opacity: number,
              left = false,
            ) => ({
              left: desktop
                ? left
                  ? '110px'
                  : 'calc(100% - 110px)'
                : 'calc(100% - 72px)',
              top: desktop ? '32%' : '28%',
              width: desktop ? width : 110,
              height: desktop ? width * 1.25 : 145,
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
              intro: {
                ...companion(350, 0.9),
                left: desktop ? '77%' : 'calc(100% - 72px)',
                top: desktop ? '45%' : '28%',
              },
              story: companion(200, 0.8),
              memory: companion(140, 0.5),
              gallery: {
                ...companion(300, 0.9),
                left: desktop ? '74%' : 'calc(100% - 90px)',
                top: desktop ? '32%' : '26%',
              },
              love: companion(180, 0.85, desktop),
              timeline: companion(180, 0.75),
              letter: companion(140, 0),
              finale: {
                left: '50%',
                top: '38%',
                width: desktop
                  ? Math.min(window.innerWidth * 0.7, 940)
                  : window.innerWidth * 0.92,
                height: window.innerHeight * (desktop ? 0.72 : 0.62),
                opacity: 1,
                rotation: 0,
              },
            }
            return states[id as keyof typeof states]
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
          const echoes = visibleChapters.flatMap(({ section }) => {
            const element =
              section!.querySelector<HTMLElement>('.chapter-heart')
            return element
              ? [{ section: section!, element, top: 0, bottom: 0 }]
              : []
          })
          const updateVisibility = () => {
            const next = Number(gsap.getProperty(heart, 'opacity')) > 0.04
            const candidates = next
              ? echoes.filter(
                  (echo) =>
                    echo.top < window.scrollY + window.innerHeight &&
                    echo.bottom > window.scrollY,
                )
              : []
            echoes.forEach(({ section, element }) => {
              const live = candidates.some(
                (candidate) => candidate.element === element,
              )
              if (section.dataset.liveHeart !== String(live))
                section.dataset.liveHeart = String(live)
            })
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
            closingStart = closing
              ? closing.getBoundingClientRect().top +
                window.scrollY -
                window.innerHeight * 0.3
              : Infinity
            closingEnd = scrollLimit()
            echoes.forEach((echo) => {
              const bounds = echo.element.getBoundingClientRect()
              echo.top = bounds.top + window.scrollY
              echo.bottom = bounds.bottom + window.scrollY
            })
            if (visibleChapters.length)
              journey.set(heart, position(visibleChapters[0].id), 0)
            const documentTop = (element: Element) =>
              element.getBoundingClientRect().top + window.scrollY
            const transition = (id: string, top: number, opacity?: number) => {
              const entry = !desktop && opacity === undefined && id !== 'finale'
              const start = Math.min(
                scrollLimit() - 1,
                Math.max(
                  0,
                  top -
                    window.innerHeight *
                      (id === 'finale'
                        ? 0.3
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
                  ...position(id),
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
              if (
                desktop ||
                id === 'home' ||
                id === 'letter' ||
                id === 'finale'
              )
                return
              const scene = section!.querySelector('.chapter-scene')
              const body =
                scene?.nextElementSibling ??
                section!.querySelector('.intro-reading, .full-memory-copy')
              if (body) transition(id, documentTop(body), 0)
              else if (id === 'intro' || id === 'memory')
                transition(
                  id,
                  documentTop(section!) + window.innerHeight * 0.7,
                  0,
                )
              section!
                .querySelectorAll('.timeline-moment')
                .forEach((moment) => {
                  transition(id, documentTop(moment))
                  const reading = moment.querySelector(
                    '.timeline-date strong, .timeline-content',
                  )
                  transition(
                    id,
                    reading
                      ? documentTop(reading)
                      : documentTop(moment) +
                          Math.min(
                            moment.getBoundingClientRect().height * 0.45,
                            window.innerHeight * 0.65,
                          ),
                    0,
                  )
                })
            })
            journey.set({}, {}, scrollLimit())
          }
          rebuild()
          ScrollTrigger.create({
            animation: journey,
            start: 0,
            end: scrollLimit,
            scrub: true,
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
      void document.fonts?.ready.then(() => {
        if (!disposed) scheduleRefresh()
      })
      return () => {
        disposed = true
        window.cancelAnimationFrame(refreshFrame)
        target?.removeEventListener('load', loaded, true)
        match.revert()
        gsap.ticker.remove(tick)
        unsubscribe()
        lenis.destroy()
        progressRef.current = 0
      }
    },
    { scope: container, dependencies: [reducedMotion], revertOnUpdate: true },
  )
}
