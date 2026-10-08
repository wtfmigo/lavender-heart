import { useEffect, useRef, useState } from 'react'

export function Navigation({
  paused,
  onToggleMotion,
}: {
  paused: boolean
  onToggleMotion: () => void
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
      data-hidden={hidden}
      onFocusCapture={() => setHidden(false)}
    >
      <a href="#home" className="wordmark">
        Lavender Heart<span aria-hidden="true"> / </span>
      </a>
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#intro">Intro</a>
      </div>
      <button
        type="button"
        className="motion-toggle"
        aria-pressed={paused}
        onClick={onToggleMotion}
      >
        {paused ? 'Resume motion' : 'Pause motion'}
      </button>
    </nav>
  )
}
