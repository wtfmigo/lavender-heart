import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollPosition } from './scrollPosition'

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
      const root = container.current
      const heart = root?.querySelector<HTMLElement>('.persistent-heart')
      if (!root || !heart || reducedMotion) return
      // Our native stages need measurement refreshes, never a global scroll reset.
      ScrollTrigger.config({ autoRefreshEvents: 'none' })
      const query = (selector: string) =>
        root.querySelector<HTMLElement>(selector)
      const top = (element: Element) =>
        element.getBoundingClientRect().top + scrollY
      const viewportHeight = () =>
        query('.hero-stage')?.clientHeight || innerHeight
      const limit = () =>
        Math.max(1, document.documentElement.scrollHeight - innerHeight)
      const clampedPosition = (element: Element, ratio: number) =>
        Math.max(0, Math.min(limit(), scrollPosition(element, ratio)))

      // Native sticky owns horizontal travel; GSAP owns each composition's reveal.
      const stage = query('.story-stage')
      root
        .querySelectorAll<HTMLElement>('.story-spread')
        .forEach((spread, index) => {
          const composition = spread.querySelector('.story-memory')
          if (!composition || !stage) return
          const horizontal = () => stage.dataset.storyFlow === 'horizontal'
          const focus = () => top(stage) + index * stage.clientWidth
          const trigger = {
            trigger: spread,
            start: () =>
              horizontal()
                ? focus() - stage.clientWidth * 0.85
                : clampedPosition(spread, 0.95),
            end: () =>
              horizontal()
                ? focus() - stage.clientWidth * 0.1
                : Math.max(
                    clampedPosition(spread, 0.65),
                    clampedPosition(spread, 0.95) + 1,
                  ),
            scrub: true,
            invalidateOnRefresh: true,
          }
          gsap.fromTo(
            composition,
            {
              y: 64,
              scale: 0.94,
              clipPath: spread.classList.contains('story-spread--date')
                ? 'inset(100% 0 0 0)'
                : 'inset(0 100% 0 0)',
            },
            {
              y: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'power2.out',
              scrollTrigger: trigger,
            },
          )
          gsap.fromTo(
            spread,
            { '--story-depth': '36px' },
            {
              '--story-depth': '-36px',
              ease: 'none',
              scrollTrigger: {
                ...trigger,
                start: () =>
                  horizontal()
                    ? focus() - stage.clientWidth
                    : scrollPosition(spread, 1),
                end: () =>
                  horizontal()
                    ? focus() + stage.clientWidth
                    : scrollPosition(spread, 0, 'bottom'),
              },
            },
          )
          const photo = spread.querySelector('.chapter-photo')
          if (photo)
            gsap.fromTo(
              photo,
              { translate: '0 2svh' },
              {
                translate: '0 -2svh',
                ease: 'none',
                scrollTrigger: {
                  ...trigger,
                  start: () =>
                    horizontal()
                      ? focus() - stage.clientWidth
                      : scrollPosition(spread, 1),
                  end: () =>
                    horizontal()
                      ? focus() + stage.clientWidth
                      : scrollPosition(spread, 0, 'bottom'),
                },
              },
            )
        })

      const memory = query('#memory')
      const depth = query('.memory-depth')
      if (memory && depth)
        gsap.fromTo(
          depth,
          { scale: 1.08, yPercent: 2 },
          {
            scale: 1,
            yPercent: -2,
            ease: 'none',
            scrollTrigger: {
              trigger: memory,
              start: () => scrollPosition(memory, 1),
              end: () => scrollPosition(memory, 0, 'bottom'),
              scrub: true,
            },
          },
        )
      const memoryImage = query('.memory-image')
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
              start: () => scrollPosition(memory!, 1),
              end: () => scrollPosition(memory!, 0, 'bottom'),
              scrub: 0.7,
            },
          },
        )
      }
      root
        .querySelectorAll<HTMLElement>(
          '.collection-cloud, .intro-haze, .finale-haze',
        )
        .forEach((cloud) => {
          const opening = cloud.classList.contains('collection-cloud--opening')
          gsap.fromTo(
            cloud,
            { yPercent: 8, xPercent: opening ? -2 : 2 },
            {
              yPercent: -23,
              xPercent: opening ? 3 : -3,
              ease: 'none',
              scrollTrigger: {
                trigger: cloud.parentElement,
                start: () => scrollPosition(cloud.parentElement!, 1),
                end: () => scrollPosition(cloud.parentElement!, 0, 'bottom'),
                scrub: 0.65,
              },
            },
          )
        })
      root
        .querySelectorAll<HTMLElement>(
          '.gallery-photo, .collection-note, .collection-closing > p, .chapter-photo, .chapter-scene .chapter-heading, .intro-support, .full-memory-copy, .love-entry > *, .timeline-date, .timeline-copy > *, .letter-introduction, .letter-opening, .letter-body > *, .letter-signature, .finale h2, .finale-message, .finale-signature',
        )
        .forEach((element) => {
          if (element.closest('.photo-galaxy, .story-spread')) return
          const collection = !!element.closest('#gallery')
          const headline = element.matches(
            '.chapter-heading, .timeline-date, .full-memory-copy, .letter-introduction, .letter-opening',
          )
          const frame = element.matches('.gallery-photo, .chapter-photo')
          const loveEntry = element.closest<HTMLElement>('.love-entry')
          const loveStage = query('.love-stage')
          const loveWindow = query('.love-window')
          const stagedLove = () =>
            !!loveEntry && loveStage?.dataset.loveFlow === 'staged'
          const loveFocus = () =>
            top(loveStage!) +
            [...root.querySelectorAll('.love-entry')].indexOf(loveEntry!) *
              loveWindow!.clientHeight
          const revealTarget = element.closest('.collection-spread') || element
          const trigger = {
            trigger: element.closest('.collection-spread') || element,
            start: () =>
              stagedLove()
                ? loveFocus() - loveWindow!.clientHeight * 0.85
                : clampedPosition(revealTarget, 0.95),
            end: () =>
              stagedLove()
                ? loveFocus() - loveWindow!.clientHeight * 0.45
                : Math.max(
                    clampedPosition(revealTarget, 0.65),
                    clampedPosition(revealTarget, 0.95) + 1,
                  ),
            invalidateOnRefresh: true,
            scrub: 0.45,
          }
          if (loveEntry) {
            const number = element.matches('.love-number')
            const direction =
              [...root.querySelectorAll('.love-entry')].indexOf(loveEntry) % 2
                ? -1
                : 1
            const reveal = gsap.timeline({ scrollTrigger: trigger })
            reveal.fromTo(
              element,
              {
                opacity: 0.08,
                x: number ? direction * -90 : direction * 32,
                y: number ? 45 : 0,
                rotation: number ? direction * -9 : 0,
                scale: number ? 0.84 : 1,
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                ease: 'power2.out',
              },
            )
            if (!number) {
              reveal.fromTo(
                element.querySelectorAll('.love-word'),
                { yPercent: 115, rotation: direction * 5 },
                {
                  yPercent: 0,
                  rotation: 0,
                  stagger: 0.06,
                  duration: 0.6,
                  ease: 'power3.out',
                },
                0,
              )
              const supporting = element.querySelector('p')
              if (supporting)
                reveal.fromTo(
                  supporting,
                  { opacity: 0, y: 22 },
                  { opacity: 1, y: 0, duration: 0.3, ease: 'none' },
                  0.35,
                )
            }
            return
          }
          gsap.fromTo(
            element,
            {
              opacity: collection ? 0 : 0.08,
              y: headline ? 64 : frame ? 44 : 24,
              ...(frame ? { scale: 0.96 } : {}),
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
              scrollTrigger: trigger,
            },
          )
          if (frame)
            gsap.fromTo(
              element,
              { translate: '0 2svh' },
              {
                translate: '0 -2svh',
                ease: 'none',
                scrollTrigger: {
                  ...trigger,
                  start: () => scrollPosition(revealTarget, 1),
                  end: () => scrollPosition(revealTarget, 0, 'bottom'),
                },
              },
            )
          const image = frame ? element.querySelector('img') : null
          if (
            image &&
            !image.getAttribute('src')?.startsWith('/photos/personal/')
          )
            gsap.fromTo(
              image,
              { yPercent: -1, scale: 1.05 },
              {
                yPercent: 1,
                scale: 1.025,
                ease: 'none',
                scrollTrigger: {
                  ...trigger,
                  start: () => scrollPosition(revealTarget, 1),
                  end: () => scrollPosition(revealTarget, 0, 'bottom'),
                },
              },
            )
        })

      const loveStage = query('.love-stage')
      const loveFill = query('.love-progress-fill')
      if (loveStage && loveFill)
        gsap.fromTo(
          loveFill,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: loveStage,
              start: () => top(loveStage),
              end: () =>
                top(loveStage) +
                Math.max(1, loveStage.offsetHeight - viewportHeight()),
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          },
        )

      const visibleChapters = chapters.flatMap((id, index) => {
        const section = query(`#${id}`)
        return section ? [{ id, index, section }] : []
      })
      const finaleSpace = query('.finale-heart-space')
      const position = (id: string, reading = false) => {
        const height = viewportHeight()
        const small = {
          left: '50%',
          top: height * 0.1,
          scale: Math.min(140, innerWidth * 0.2) / 750,
          opacity: 0.55,
        }
        if (id === 'home')
          return {
            ...small,
            top: height * 0.49,
            scale: Math.min(innerWidth * 0.52, height * 0.72, 760) / 750,
            opacity: 1,
          }
        if (id === 'finale')
          return {
            ...small,
            top: finaleSpace
              ? finaleSpace.offsetTop + finaleSpace.clientHeight / 2
              : height * 0.38,
            scale:
              Math.min(
                innerWidth * 0.7,
                finaleSpace?.clientHeight || height * 0.72,
                940,
              ) / 750,
            opacity: 1,
          }
        if (id === 'intro')
          return {
            ...small,
            top: height * 0.2,
            scale: Math.min(180, innerWidth * 0.25) / 750,
            opacity: 0.75,
          }
        return {
          ...small,
          opacity:
            (reading && id !== 'story') ||
            ['memory', 'gallery', 'letter'].includes(id)
              ? 0
              : 0.55,
        }
      }
      // Scale a stable frame rather than resizing the GPU canvas during every scroll frame.
      gsap.set(heart, {
        width: 750,
        height: 750,
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        ...position(visibleChapters[0]?.id || 'home'),
      })
      visibleChapters.forEach(({ id, section }) => {
        section.dataset.liveHeart = String(id !== 'gallery')
      })
      let visible = true
      let anchors: { index: number; top: number }[] = []
      let finaleStart = Infinity
      const journey = gsap.timeline({ paused: true })
      const rebuild = () => {
        journey.clear()
        const height = viewportHeight()
        const finale = query('#finale')
        finaleStart = finale ? top(finale) : Infinity
        anchors = visibleChapters.map(({ section, index }) => ({
          index,
          top: Math.min(limit(), top(section)),
        }))
        journey.set(heart, position(visibleChapters[0]?.id || 'home'), 0)
        const transition = (id: string, targetTop: number, reading = false) => {
          const start = Math.max(
            0,
            Math.min(
              limit() - 1,
              targetTop -
                height * (id === 'finale' ? 0.3 : reading ? 0.55 : 0.95),
            ),
          )
          const end = Math.max(
            start + 1,
            Math.min(
              limit(),
              targetTop -
                height * (id === 'finale' ? 0 : reading ? 0.38 : 0.35),
            ),
          )
          journey.to(
            heart,
            { ...position(id, reading), duration: end - start, ease: 'none' },
            start,
          )
        }
        visibleChapters.slice(1).forEach(({ id, section }) => {
          transition(id, top(section))
          const body =
            section.querySelector('.chapter-scene')?.nextElementSibling ||
            section.querySelector('.intro-reading')
          if (body && ['story', 'love', 'timeline'].includes(id))
            transition(id, top(body), true)
        })
        journey.set({}, {}, limit())
      }
      const follow = gsap.quickSetter(heart, 'y', 'px')
      const update = () => {
        follow(Math.min(0, finaleStart - scrollY))
        const next = anchors.findIndex((anchor) => anchor.top > scrollY)
        const previous =
          anchors[Math.max(0, next === -1 ? anchors.length - 1 : next - 1)]
        const following = next > 0 ? anchors[next] : previous
        if (previous)
          progressRef.current =
            previous.index +
            (following.index - previous.index) *
              Math.max(
                0,
                Math.min(
                  1,
                  (scrollY - previous.top) /
                    Math.max(1, following.top - previous.top),
                ),
              )
        const nextVisible = Number(gsap.getProperty(heart, 'opacity')) > 0.04
        if (nextVisible !== visible) {
          visible = nextVisible
          heart.dataset.heartVisible = String(visible)
          heart.dispatchEvent(
            new CustomEvent('heartvisibility', { detail: visible }),
          )
        }
      }
      journey.eventCallback('onUpdate', update)
      rebuild()
      ScrollTrigger.create({
        trigger: root,
        animation: journey,
        start: 0,
        end: limit,
        scrub: 0.45,
        onUpdate: update,
        onRefresh: (self) => {
          rebuild()
          journey.progress(self.progress)
          update()
        },
      })

      let disposed = false
      let timer = 0
      let width = innerWidth
      let height = innerHeight
      const refresh = () => {
        clearTimeout(timer)
        timer = window.setTimeout(() => {
          if (!disposed)
            ScrollTrigger.getAll().forEach((trigger) => {
              if (trigger.trigger && root.contains(trigger.trigger))
                trigger.refresh()
            })
        }, 160)
      }
      const resize = () => {
        if (innerWidth === width && innerHeight === height) return
        width = innerWidth
        height = innerHeight
        refresh()
      }
      // Coalesce viewport/font changes into one measurement pass without rebuilding pins.
      window.addEventListener('resize', resize)
      void document.fonts.ready.then(() => {
        if (!disposed) refresh()
      })
      return () => {
        disposed = true
        clearTimeout(timer)
        window.removeEventListener('resize', resize)
        visibleChapters.forEach(({ section }) => {
          delete section.dataset.liveHeart
        })
        progressRef.current = 0
        heart.dataset.heartVisible = 'true'
        heart.dispatchEvent(
          new CustomEvent('heartvisibility', { detail: true }),
        )
      }
    },
    { scope: container, dependencies: [reducedMotion], revertOnUpdate: true },
  )
}
