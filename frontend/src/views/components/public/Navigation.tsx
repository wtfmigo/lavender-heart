import { useEffect, useRef, useState } from 'react'
import type { SectionKey } from '@/models/types/experience'

export function Navigation({
  paused,
  onToggleMotion,
  chapters = ['hero', 'intro'],
}: {
  paused: boolean
  onToggleMotion: () => void
  chapters?: SectionKey[]
}) {
  const nav = useRef<HTMLElement>(null)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let previous = window.scrollY
    const onScroll = () => {
      const current = window.scrollY
      if (Math.abs(current - previous) < 8) return
      setHidden(
        current > 90 &&
          current > previous &&
          !nav.current?.contains(document.activeElement),
      )
      previous = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav
      ref={nav}
      aria-label="Main"
      className="navigation"
      data-complete={chapters.length > 2}
      data-hidden={hidden}
      onFocusCapture={() => setHidden(false)}
    >
      <a href="#home" className="wordmark">
        Lavender Heart
      </a>
      <div className="nav-links">
        <a href="#home">Home</a>
        {chapters.includes('intro') && <a href="#intro">Intro</a>}
        {chapters.includes('gallery') && <a href="#gallery">Photos</a>}
        {chapters.includes('birthday_letter') && <a href="#letter">Letter</a>}
      </div>
      <button
        type="button"
        className="motion-toggle"
        aria-pressed={paused}
        aria-label={paused ? 'Resume motion' : 'Pause motion'}
        title={paused ? 'Resume motion' : 'Pause motion'}
        onClick={onToggleMotion}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          aria-hidden="true"
        >
          {paused ? (
            <path d="m9 6 9 6-9 6Z" stroke="currentColor" strokeWidth="1.4" />
          ) : (
            <path d="M9 6v12M15 6v12" stroke="currentColor" strokeWidth="1.4" />
          )}
        </svg>
      </button>
    </nav>
  )
}
