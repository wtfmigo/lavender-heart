import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { HeartFallback } from './HeartFallback'

const HeartCanvas = lazy(() => import('@/three/scenes/HeartScene'))

class HeartBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <HeartFallback /> : this.props.children
  }
}

export function CrystalHeart({
  reducedMotion,
  progress,
  enabled = true,
}: {
  reducedMotion: boolean
  progress: RefObject<number>
  enabled?: boolean
}) {
  const element = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const supported = typeof window.WebGL2RenderingContext !== 'undefined'
  useEffect(() => {
    const target = element.current
    if (!target) return
    const fit = () => {
      target.style.setProperty(
        '--heart-render-scale',
        String(Math.min(target.clientWidth / 750, target.clientHeight / 750)),
      )
    }
    fit()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(fit)
    observer.observe(target)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const target = element.current
    if (!target) return
    let visible = true
    const update = () => setActive(visible && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(target)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return (
    <div
      ref={element}
      className="crystal-heart"
      aria-hidden="true"
      data-ready={ready && !failed}
    >
      <div className="heart-loading-fallback">
        <HeartFallback />
      </div>
      {enabled && supported && !failed && (
        <HeartBoundary>
          <Suspense fallback={null}>
            <HeartCanvas
              reducedMotion={reducedMotion}
              progress={progress}
              active={active}
              onReady={() => setReady(true)}
              onFailure={() => setFailed(true)}
            />
          </Suspense>
        </HeartBoundary>
      )}
    </div>
  )
}
