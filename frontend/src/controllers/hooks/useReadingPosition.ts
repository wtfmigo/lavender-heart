import { useEffect, type RefObject } from 'react'

export function useReadingPosition(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let reading:
      | { element: HTMLElement; fraction: number; horizontal: boolean }
      | undefined
    let width = innerWidth
    let height = innerHeight
    let frame = 0
    let timer = 0
    const capture = () => {
      frame = 0
      if (timer) return
      const point = innerHeight * 0.4
      let element = document
        .elementFromPoint(innerWidth / 2, point)
        ?.closest<HTMLElement>(
          'section[id], .chapter-scene, .story-spread, .collection-spread, .photo-galaxy, .love-entry, .timeline-moment, .letter-body p',
        )
      if (!element || !root.current?.contains(element)) return
      const horizontalStage = element.closest<HTMLElement>(
        '.story-stage[data-story-flow="horizontal"], .love-stage[data-love-flow="staged"]',
      )
      const horizontal = !!horizontalStage
      if (horizontalStage) element = horizontalStage
      const rect = element.getBoundingClientRect()
      const windowHeight =
        horizontalStage?.querySelector<HTMLElement>(
          '.story-window, .love-window',
        )?.offsetHeight ?? innerHeight
      if (rect.height)
        reading = {
          element,
          fraction: Math.max(
            0,
            Math.min(
              1,
              horizontal
                ? -rect.top / Math.max(1, rect.height - windowHeight)
                : (point - rect.top) / rect.height,
            ),
          ),
          horizontal,
        }
    }
    const scroll = () => {
      if (!frame && !timer) frame = requestAnimationFrame(capture)
    }
    const resize = () => {
      const changedWidth = width !== innerWidth
      const changedHeight = Math.abs(height - innerHeight)
      width = innerWidth
      height = innerHeight
      // Address-bar changes must not fight native touch scrolling.
      if (
        !changedWidth &&
        (changedHeight === 0 || (width < 1024 && changedHeight < height * 0.25))
      )
        return
      cancelAnimationFrame(frame)
      frame = 0
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        timer = 0
        if (reading?.element.isConnected) {
          const rect = reading.element.getBoundingClientRect()
          const windowHeight =
            reading.element.dataset.storyFlow === 'horizontal' ||
            reading.element.dataset.loveFlow === 'staged'
              ? (reading.element.querySelector<HTMLElement>(
                  '.story-window, .love-window',
                )?.offsetHeight ?? innerHeight)
              : innerHeight
          window.scrollTo({
            top:
              scrollY +
              rect.top +
              (reading.horizontal
                ? (rect.height - windowHeight) * reading.fraction
                : rect.height * reading.fraction - innerHeight * 0.4),
            behavior: 'instant',
          })
        }
        capture()
      }, 120)
    }
    capture()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', resize)
    }
  }, [root])
}
