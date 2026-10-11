import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollPosition } from './scrollPosition'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function useExperienceAnimation(
  container: RefObject<HTMLDivElement | null>,
  _progressRef: RefObject<number>,
  reducedMotion: boolean,
  onReveal: () => void,
) {
  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set('.opening', { display: 'none' })
        onReveal()
        return
      }
      let repeatVisit = false
      try {
        repeatVisit = sessionStorage.getItem('lavender-heart:opened') === '1'
      } catch {
        /* Private browsing may disable session storage; the reveal remains bounded. */
      }
      const opening = gsap.timeline({ defaults: { ease: 'power2.out' } })
      opening
        .from('.opening-label', {
          opacity: 0,
          y: 10,
          duration: repeatVisit ? 0.15 : 0.7,
        })
        .to('.opening', {
          opacity: 0,
          duration: repeatVisit ? 0.2 : 0.8,
          delay: repeatVisit ? 0 : 0.5,
        })
        .set('.opening', { display: 'none' })
        .call(onReveal)
        .from(
          '.hero-type-reveal',
          { opacity: 0, y: 22, duration: 0.9 },
          '-=0.4',
        )
        .from(
          '.cloud-drift',
          { opacity: 0, y: 35, duration: 1.1, stagger: 0.1 },
          '<',
        )
        .from(
          '.heart-reveal',
          { opacity: 0, scale: 0.9, duration: 1.1 },
          '<0.2',
        )
        .call(() => {
          try {
            sessionStorage.setItem('lavender-heart:opened', '1')
          } catch {
            /* The reveal also works without storage. */
          }
        })
      // Keep GSAP ticker lag from extending the opening on a busy GPU.
      const openingLimit = window.setTimeout(
        () => opening.progress(1),
        repeatVisit ? 1200 : 3500,
      )
      const context = gsap.context(() => {
        const travel = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65,
          },
        })
        travel
          .to(
            '.cloud-layer--background',
            { yPercent: -12, xPercent: 3, ease: 'none' },
            0,
          )
          .to(
            '.cloud-layer--midground',
            { yPercent: -23, xPercent: -4, ease: 'none' },
            0,
          )
          .to(
            '.cloud-layer--foreground',
            {
              yPercent: -68,
              xPercent: 6,
              scale: 1.16,
              ease: 'none',
            },
            0,
          )
          .to(
            '.hero-love, .hero-footnote',
            { opacity: 0, ease: 'none', duration: 0.3 },
            0,
          )
          .to('.hero-sky', { opacity: 0, ease: 'none' }, 0)
        if (!container.current?.querySelector('[data-long-name="true"]')) {
          travel.to(
            '.hero-type-travel',
            {
              y: -40,
              clipPath: 'inset(0 0 100% 0)',
              opacity: 0,
              ease: 'none',
              duration: 0.65,
            },
            0.1,
          )
        }
        if (container.current?.querySelector('.intro-message-wrap'))
          gsap.from('.intro-message-wrap', {
            y: 55,
            clipPath: 'inset(0 0 100% 0)',
            duration: 1.1,
            scrollTrigger: {
              trigger: '.intro',
              start: () =>
                scrollPosition(
                  container.current!.querySelector('.intro')!,
                  0.7,
                ),
              toggleActions: 'play none none reverse',
            },
          })
        const drift = gsap.to('.cloud-drift', {
          x: (index) => (index + 1) * 10,
          duration: 30,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !document.hidden) drift.play()
          else drift.pause()
        })
        const hero = container.current?.querySelector('.hero')
        if (hero) observer.observe(hero)
        const visibility = () => {
          if (document.hidden) drift.pause()
          else if (hero && hero.getBoundingClientRect().bottom > 0) drift.play()
        }
        document.addEventListener('visibilitychange', visibility)
        return () => {
          observer.disconnect()
          document.removeEventListener('visibilitychange', visibility)
        }
      }, container)
      return () => {
        window.clearTimeout(openingLimit)
        context.revert()
      }
    },
    {
      scope: container,
      dependencies: [reducedMotion, onReveal],
      revertOnUpdate: true,
    },
  )
}
