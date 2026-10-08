import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { CrystalHeart } from '@/three/components/CrystalHeart'

export function PersistentHeart({
  reducedMotion,
  progress,
  enabled,
}: {
  reducedMotion: boolean
  progress: RefObject<number>
  enabled: boolean
}) {
  const element = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const target = element.current
    if (!target) return
    setVisible(target.dataset.heartVisible !== 'false')
    const update = (event: Event) =>
      setVisible((event as CustomEvent<boolean>).detail)
    target.addEventListener('heartvisibility', update)
    return () => target.removeEventListener('heartvisibility', update)
  }, [])
  return (
    <div
      ref={element}
      className="persistent-heart heart-travel"
      aria-hidden="true"
    >
      <div className="heart-reveal">
        <CrystalHeart
          reducedMotion={reducedMotion || !visible}
          progress={progress}
          enabled={enabled}
        />
      </div>
    </div>
  )
}
