import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { PublicExperience } from '@/features/public/experience'

export function LoveSurprise({
  item,
  index,
  reducedMotion,
}: {
  item: PublicExperience['loveEntries'][number]
  index: number
  reducedMotion: boolean
}) {
  const [opened, setOpened] = useState(false)
  const id = useId()
  const message = useRef<HTMLDivElement>(null)
  const variant = ['envelope', 'fold', 'heart'][index % 3]
  // Remount animated text to finish active reveals when motion preferences change.
  const textMotionKey = reducedMotion ? 'static' : 'animated'
  useEffect(() => {
    if (opened) message.current?.focus({ preventScroll: true })
  }, [opened])
  return (
    <div
      className={`love-note love-note--${variant}`}
      data-open={opened}
      data-reduced={reducedMotion}
    >
      <button
        type="button"
        className="love-cover"
        aria-label={`Reveal message ${index + 1}`}
        aria-expanded={opened}
        aria-controls={id}
        aria-hidden={opened}
        disabled={opened}
        onClick={() => setOpened(true)}
      >
        <span className="love-seal" aria-hidden="true">
          ♥
        </span>
        <span className="love-cover-label">Tap to reveal</span>
        <span className="love-cover-hint" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} /{' '}
          {['unseal', 'unfold', 'open'][index % 3]}
        </span>
      </button>
      <div
        className="love-copy"
        id={id}
        ref={message}
        role="region"
        aria-labelledby={`${id}-heading`}
        aria-hidden={!opened}
        inert={!opened}
        tabIndex={-1}
      >
        <h3 id={`${id}-heading`}>
          {item.statement.split(/(\s+)/).map((word, wordIndex) =>
            word.trim() ? (
              <span className="love-word-mask" key={wordIndex}>
                <motion.span
                  key={textMotionKey}
                  className="love-word"
                  initial={false}
                  animate={{
                    y: opened ? '0%' : '115%',
                    rotate: opened ? 0 : 4,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.75,
                    delay:
                      opened && !reducedMotion
                        ? 0.25 + Math.min(wordIndex * 0.03, 0.6)
                        : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ) : (
              word
            ),
          )}
        </h3>
        {item.supportingText && (
          <motion.p
            key={textMotionKey}
            initial={false}
            animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 16 }}
            transition={{
              duration: reducedMotion ? 0 : 0.65,
              delay: opened && !reducedMotion ? 0.55 : 0,
            }}
          >
            {item.supportingText}
          </motion.p>
        )}
      </div>
    </div>
  )
}
