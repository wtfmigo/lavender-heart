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
      const tick = (time: number) => lenis.raf(time * 1000)
      const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
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
              { yPercent: -8, scale: 1.03 },
              {
                yPercent: 8,
                scale: 1.03,
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
          if (desktop && stage && track) {
            gsap.to(track, {
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
              },
            })
          }
          const centerWidth = () =>
            desktop
              ? Math.min(window.innerWidth * 0.52, 760)
              : Math.min(window.innerWidth * 0.92, 440)
          const centerHeight = () =>
            window.innerHeight * (desktop ? 0.72 : 0.52)
          const position = (index: number) => {
            const central = index === 0 || index === 8
            const hidden = index === 3 || index === 7 || (!desktop && !central)
            const left = index === 3 || index === 5
            return {
              left: central
                ? '50%'
                : left
                  ? desktop
                    ? '72px'
                    : '50px'
                  : `calc(100% - ${desktop ? 72 : 50}px)`,
              top:
                index === 8 ? '30%' : central ? '49%' : desktop ? '38%' : '20%',
              width: central ? centerWidth() : desktop ? 144 : 100,
              height:
                index === 8
                  ? window.innerHeight * 0.45
                  : central
                    ? centerHeight()
                    : desktop
                      ? 180
                      : 125,
              opacity: hidden ? 0 : central ? 1 : desktop ? 0.75 : 0.48,
              rotation: central ? 0 : left ? -8 : 8,
            }
          }
          const visibleChapters = chapters
            .map((id, index) => ({
              index,
              section: container.current?.querySelector(`#${id}`),
            }))
            .filter((chapter) => chapter.section)
          if (visibleChapters.length)
            gsap.set(heart, {
              ...position(visibleChapters[0].index),
              x: 0,
              y: 0,
              xPercent: -50,
              yPercent: -50,
            })
          let visible = true
          const updateVisibility = () => {
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
            if (visibleChapters.length)
              journey.set(heart, position(visibleChapters[0].index), 0)
            visibleChapters.slice(1).forEach(({ section, index }) => {
              const top = section!.getBoundingClientRect().top + window.scrollY
              const start = Math.min(
                scrollLimit() - 1,
                Math.max(
                  0,
                  top - window.innerHeight * (index === 8 ? 0.3 : 0.95),
                ),
              )
              const end = Math.min(
                scrollLimit(),
                Math.max(
                  start + 1,
                  top - window.innerHeight * (index === 8 ? 0.1 : 0.35),
                ),
              )
              journey.to(
                heart,
                { ...position(index), duration: end - start, ease: 'none' },
                start,
              )
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
            onUpdate: (self) => {
              progressRef.current = self.progress
            },
          })
          gsap.ticker.add(updateVisibility)
          return () => {
            gsap.ticker.remove(updateVisibility)
            journey.kill()
          }
        },
      )
      let disposed = false
      let refreshFrame = 0
      const loaded = (event: Event) => {
        if (!(event.target instanceof HTMLImageElement)) return
        window.cancelAnimationFrame(refreshFrame)
        refreshFrame = window.requestAnimationFrame(() => {
          if (!disposed) {
            lenis.resize()
            ScrollTrigger.refresh()
          }
        })
      }
      const target = container.current
      target?.addEventListener('load', loaded, true)
      void document.fonts?.ready.then(() => {
        if (!disposed) {
          lenis.resize()
          ScrollTrigger.refresh()
        }
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
