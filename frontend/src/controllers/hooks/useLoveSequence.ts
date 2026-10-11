import { useLayoutEffect, useRef, type RefObject } from 'react'

export function useLoveSequence(
  stageRef: RefObject<HTMLDivElement | null>,
  reduced: boolean,
  count: number,
) {
  const readingEntry = useRef<number | null>(null)
  useLayoutEffect(() => {
    const stage = stageRef.current
    const viewport = stage?.querySelector<HTMLElement>('.love-window')
    const sequence = stage?.querySelector<HTMLElement>('.love-sequence')
    if (!stage || !viewport || !sequence) return
    const entries = [...sequence.querySelectorAll<HTMLElement>('.love-entry')]
    const native = CSS.supports('animation-timeline', '--love-progress')
    if (!native) sequence.style.animation = 'none'
    let frame = 0
    let start = 0
    let distance = 0
    let budget = 0
    let disposed = false
    const update = () => {
      frame = 0
      if (stage.dataset.loveFlow !== 'staged') return
      const progress = Math.max(0, Math.min(distance, scrollY - start))
      sequence.style.transform = `translateY(${-progress}px)`
    }
    const measure = () => {
      if (disposed || !stage.isConnected) return
      budget = Number.parseFloat(getComputedStyle(viewport).minHeight)
      const fits = entries.every((entry) => entry.offsetHeight <= budget + 2)
      stage.dataset.loveFlow =
        !reduced && count > 1 && fits ? 'staged' : 'vertical'
      start = scrollY + stage.getBoundingClientRect().top
      distance = Math.max(0, count - 1) * budget
      stage.style.setProperty('--love-distance', `${distance}px`)
      sequence.style.removeProperty('transform')
      if (!native) update()
    }
    measure()
    if (readingEntry.current !== null && entries[readingEntry.current]) {
      const index = readingEntry.current
      const top =
        stage.dataset.loveFlow === 'staged'
          ? start + index * budget
          : scrollY + entries[index].getBoundingClientRect().top
      window.scrollTo({ top, behavior: 'instant' })
    }
    readingEntry.current = null
    const observer = new ResizeObserver(measure)
    entries.forEach((entry) => observer.observe(entry))
    void document.fonts.ready.then(measure)
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('resize', measure)
    if (!native) window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      readingEntry.current = entries.findIndex((entry) => {
        const rect = entry.getBoundingClientRect()
        return rect.top <= budget * 0.4 && rect.bottom > budget * 0.4
      })
      if (readingEntry.current < 0) readingEntry.current = null
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', scroll)
      sequence.style.removeProperty('transform')
      sequence.style.removeProperty('animation')
      stage.style.removeProperty('--love-distance')
      stage.removeAttribute('data-love-flow')
    }
  }, [stageRef, reduced, count])
}
