import { useEffect, type RefObject } from 'react'

export function useScrollParallax(
  root: RefObject<HTMLDivElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    const element = root.current
    if (!element || reduced) return
    const native = CSS.supports('animation-timeline', '--chapter-parallax')
    element.setAttribute('data-parallax', native ? 'native' : 'fallback')
    if (native) return () => element.removeAttribute('data-parallax')

    const chapters = element.querySelectorAll<HTMLElement>(
      '.hero, .intro, .chapter-scene, .collection-spread, .collection-closing, .full-memory, .love-entry, .timeline-moment, .letter-introduction, .finale',
    )
    const visible = new Set<HTMLElement>()
    let frame = 0
    const update = () => {
      frame = 0
      for (const chapter of visible) {
        const rect = chapter.getBoundingClientRect()
        const progress = chapter.classList.contains('hero')
          ? -rect.top / rect.height
          : (innerHeight - rect.top) / (innerHeight + rect.height)
        chapter.style.setProperty(
          '--parallax-progress',
          String(Math.max(0, Math.min(1, progress))),
        )
      }
    }
    const schedule = () => {
      if (!frame && visible.size) frame = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const chapter = entry.target as HTMLElement
        if (entry.isIntersecting) visible.add(chapter)
        else visible.delete(chapter)
      }
      schedule()
    })
    chapters.forEach((chapter) => observer.observe(chapter))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      chapters.forEach((chapter) =>
        chapter.style.removeProperty('--parallax-progress'),
      )
      element.removeAttribute('data-parallax')
    }
  }, [root, reduced])
}
