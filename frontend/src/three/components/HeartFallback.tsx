import { useId } from 'react'

export function HeartFallback() {
  const id = useId().replaceAll(':', '')
  const path =
    'M160 83 C205 9 317 25 297 125 C288 177 204 246 160 278 C116 246 32 177 23 125 C3 25 115 9 160 83Z'
  return (
    <div
      className="heart-fallback"
      data-testid="heart-fallback"
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 310" fill="none">
        <defs>
          <linearGradient
            id={`${id}-glass`}
            x1="43"
            y1="28"
            x2="265"
            y2="255"
            gradientUnits="userSpaceOnUse"
          >
            <stop className="glass-pearl" />
            <stop offset=".4" className="glass-lilac" />
            <stop offset=".65" className="glass-pale" />
            <stop offset="1" className="glass-dusty" />
          </linearGradient>
          <linearGradient id={`${id}-edge`} x1="37" y1="50" x2="265" y2="280">
            <stop className="glass-pearl" />
            <stop offset="1" className="glass-plum" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill={`url(#${id}-glass)`}
          fillOpacity=".83"
          stroke={`url(#${id}-edge)`}
          strokeWidth="2"
        />
        <path
          d="M160 83 L96 104 L59 66 M96 104 L64 162 L160 278 L238 167 L226 100 L160 83 M96 104 L226 100 M96 104 L157 195 L226 100 M157 195 L160 278"
          className="glass-facets"
          strokeWidth="1"
        />
        <path
          d="M44 108 C39 63 96 36 131 67"
          className="glass-highlight"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
