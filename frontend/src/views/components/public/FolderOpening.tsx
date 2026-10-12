import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import '@/styles/folder-opening.css'

export function FolderOpening({
  recipientName,
  reducedMotion,
  onEnter,
}: {
  recipientName: string
  reducedMotion: boolean
  onEnter: () => void
}) {
  const [opening, setOpening] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  useEffect(() => button.current?.focus({ preventScroll: true }), [])
  useEffect(() => {
    if (opening && reducedMotion) onEnter()
  }, [opening, reducedMotion, onEnter])
  return (
    <motion.div
      className="opening folder-opening"
      role="dialog"
      aria-modal="true"
      aria-label={`A letter for ${recipientName}`}
      data-opening={opening}
      initial={false}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.5, delay: opening ? 1.05 : 0 }}
      onAnimationComplete={() => {
        if (opening) onEnter()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault()
          button.current?.focus()
        }
      }}
    >
      <span className="folder-kicker">For you</span>
      <button
        className="folder-button"
        ref={button}
        type="button"
        data-open-gift
        aria-label={`Open letter for ${recipientName}`}
        aria-controls="content"
        aria-expanded={opening}
        disabled={opening}
        onClick={() => {
          if (reducedMotion) onEnter()
          else setOpening(true)
        }}
      >
        <span className="folder-back" aria-hidden="true" />
        <span className="folder-tab" aria-hidden="true">
          {recipientName}
        </span>
        <motion.span
          className="folder-letter"
          aria-hidden="true"
          initial={false}
          animate={{ y: opening ? '-42%' : '0%', rotate: opening ? -5 : -2 }}
          transition={{
            duration: 0.9,
            delay: opening ? 0.18 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="folder-letter-title">Letter</span>
          <span className="folder-letter-address">For {recipientName}</span>
          <span className="folder-letter-rule" />
          <span className="folder-letter-rule" />
          <span className="folder-letter-rule" />
          <span className="folder-letter-heart">♡</span>
        </motion.span>
        <motion.span
          className="folder-front"
          aria-hidden="true"
          initial={false}
          animate={{ rotateX: opening ? -115 : 0 }}
          transition={{ duration: 0.95, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="folder-seal">♡</span>
          <span className="folder-front-label">Tap to open</span>
        </motion.span>
      </button>
      <span className="folder-caption" aria-hidden="true">
        A letter for {recipientName}
      </span>
    </motion.div>
  )
}
