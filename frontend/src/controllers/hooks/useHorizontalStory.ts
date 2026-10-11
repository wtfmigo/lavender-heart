import { useLayoutEffect, useRef, type RefObject } from 'react'

export function useHorizontalStory(
  stageRef: RefObject<HTMLDivElement | null>,
  reduced: boolean,
  count: number,
) {
  const readingPanel = useRef<number | null>(null)
  useLayoutEffect(() => {
    const stage = stageRef.current
    const track = stage?.querySelector<HTMLElement>('.story-track')
    if (!stage || !track) return
    const panels = [...track.querySelectorAll<HTMLElement>('.story-spread')]
    const nativeTimeline = CSS.supports(
      'animation-timeline',
      '--story-progress',
    )
    if (!nativeTimeline) track.style.animation = 'none'
    let frame = 0
    let start = 0
    let distance = 0
    let disposed = false
    const update = () => {
      frame = 0
      if (stage.dataset.storyFlow !== 'horizontal') return
      const progress = Math.max(0, Math.min(distance, scrollY - start))
      track.style.transform = `translateX(${-progress}px)`
    }
    const measure = () => {
      if (disposed || !stage.isConnected) return
      // The sticky window uses 100svh even when mobile browser bars collapse.
      const budget = panels[0]
        ? Number.parseFloat(getComputedStyle(panels[0]).minHeight)
        : innerHeight
      const fits = panels.every((panel) => panel.offsetHeight <= budget + 2)
      stage.dataset.storyFlow =
        !reduced && count > 1 && fits ? 'horizontal' : 'vertical'
      start = scrollY + stage.getBoundingClientRect().top
      distance = (count - 1) * innerWidth
      track.style.removeProperty('transform')
      if (!nativeTimeline) update()
    }
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    measure()
    if (readingPanel.current !== null && panels[readingPanel.current]) {
      const index = readingPanel.current
      const top =
        stage.dataset.storyFlow === 'horizontal'
          ? start + index * innerWidth
          : scrollY + panels[index].getBoundingClientRect().top
      window.scrollTo({ top, behavior: 'instant' })
    }
    readingPanel.current = null
    const observer = new ResizeObserver(measure)
    panels.forEach((panel) => observer.observe(panel))
    void document.fonts.ready.then(measure)
    window.addEventListener('resize', measure)
    if (!nativeTimeline)
      window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      readingPanel.current = panels.findIndex((panel) => {
        const rect = panel.getBoundingClientRect()
        return (
          rect.left <= innerWidth / 2 &&
          rect.right > innerWidth / 2 &&
          rect.top <= innerHeight / 2 &&
          rect.bottom > innerHeight / 2
        )
      })
      if (readingPanel.current < 0) readingPanel.current = null
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', scroll)
      track.style.removeProperty('transform')
      track.style.removeProperty('animation')
      stage.removeAttribute('data-story-flow')
    }
  }, [stageRef, reduced, count])
}
