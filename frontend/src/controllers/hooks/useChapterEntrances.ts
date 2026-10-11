import { useEffect, type RefObject } from 'react'

export function useChapterEntrances(
  root: RefObject<HTMLDivElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    if (reduced || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement
          if (
            target.classList.contains('chapter-heart') ||
            target.classList.contains('finale-static-heart')
          ) {
            target.dataset.visible = String(entry.isIntersecting)
            continue
          }
          if (!entry.isIntersecting) continue
          target.dataset.entered = 'true'
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    root.current
      ?.querySelectorAll(
        '.intro-reading, .chapter-scene, .story-memory, .collection-spread, .collection-closing, .love-entry, .timeline-moment, .letter-introduction, .letter-body, .finale-message, .chapter-heart, .finale-static-heart',
      )
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [root, reduced])
}
