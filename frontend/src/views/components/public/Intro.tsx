import type { ExperienceSlice } from '@/features/public/experience'

export function Intro({ content }: { content: ExperienceSlice['intro'] }) {
  return (
    <section id="intro" className="intro" aria-labelledby="intro-message">
      <div className="intro-haze" aria-hidden="true" />
      <div className="intro-reading">
        <div className="intro-message-wrap">
          <h2 id="intro-message">
            {content.message.blocks.map((block, blockIndex) => (
              <span className="intro-block" key={blockIndex}>
                {block.children.map((run, index) => {
                  if (run.type === 'line_break') return <br key={index} />
                  return (
                    <span
                      key={index}
                      className={
                        run.marks?.includes('bold') ? 'rich-bold' : undefined
                      }
                    >
                      {run.text}
                    </span>
                  )
                })}
              </span>
            ))}
          </h2>
        </div>
        {content.supportingText && (
          <p className="intro-support">{content.supportingText}</p>
        )}
      </div>
    </section>
  )
}
