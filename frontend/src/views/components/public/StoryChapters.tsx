import { useState } from 'react'
import { ChapterScene } from './ChapterScene'
import type {
  ExperienceMemory,
  ExperiencePhoto,
  PublicExperience,
} from '@/features/public/experience'
import type {
  LimitedRichTextDocument,
  PublicSection,
  PublicSiteSettings,
} from '@/models/types/experience'

type Content<Key extends PublicSection['key']> = Extract<
  PublicSection,
  { key: Key }
>['content']

export function RichText({ document }: { document: LimitedRichTextDocument }) {
  return (
    <>
      {document.blocks.map((block, blockIndex) => {
        const children = block.children.map((run, index) => {
          if (run.type === 'line_break') return <br key={index} />
          const text = run.marks?.includes('italic') ? (
            <em>{run.text}</em>
          ) : (
            run.text
          )
          return run.marks?.includes('bold') ? (
            <strong key={index}>{text}</strong>
          ) : (
            <span key={index}>{text}</span>
          )
        })
        return block.type === 'blockquote' ? (
          <blockquote key={blockIndex}>{children}</blockquote>
        ) : (
          <p key={blockIndex}>{children}</p>
        )
      })}
    </>
  )
}

function DateLabel({
  date,
  className,
}: {
  date: string | null
  className?: string
}) {
  if (!date) return null
  return (
    <time className={className} dateTime={date}>
      {new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${date}T12:00:00Z`))}
    </time>
  )
}

function MemoryPhoto({
  photo,
  className = '',
}: {
  photo: ExperiencePhoto
  className?: string
}) {
  return (
    <figure className={`chapter-photo ${className}`}>
      <div className="photo-window">
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          style={{
            objectPosition: `${photo.focalX * 100}% ${photo.focalY * 100}%`,
          }}
        />
      </div>
      {photo.caption && <figcaption>{photo.caption}</figcaption>}
    </figure>
  )
}

function StoryMemory({
  item,
  index,
}: {
  item: ExperienceMemory
  index: number
}) {
  return (
    <div className="story-memory">
      <div className="story-copy">
        <span className="chapter-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        {item.date || item.dateLabel ? (
          <div className="story-date">
            <MemoryDate item={item} />
          </div>
        ) : null}
        <h3>{item.title}</h3>
        <div className="memory-message">
          <RichText document={item.message} />
        </div>
      </div>
      {item.photo && (
        <MemoryPhoto
          photo={item.photo}
          className={
            item.photo.height > item.photo.width
              ? 'photo-portrait'
              : 'photo-landscape'
          }
        />
      )}
    </div>
  )
}

function MemoryDate({ item }: { item: ExperienceMemory }) {
  if (!item.date)
    return item.dateLabel ? (
      <strong className="date-presentation">{item.dateLabel}</strong>
    ) : null
  const date = new Date(`${item.date}T12:00:00Z`)
  return (
    <time dateTime={item.date}>
      <strong>{date.getUTCFullYear()}</strong>
      <span>
        {new Intl.DateTimeFormat('en', {
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }).format(date)}
      </span>
    </time>
  )
}

export function StoryChapter({
  heading,
  items,
}: {
  heading: string
  items: ExperienceMemory[]
}) {
  const spreads: {
    index: number
    variant: string
    memories: ExperienceMemory[]
  }[] = []
  const variants = ['portrait', 'wide', 'date', 'paired', 'float', 'cinematic']
  for (let index = 0; index < items.length; index += index === 3 ? 2 : 1) {
    spreads.push({
      index,
      variant: variants[Math.min(spreads.length, variants.length - 1)],
      memories: items.slice(index, index + (index === 3 ? 2 : 1)),
    })
  }
  return (
    <section
      id="story"
      className="story-chapter"
      aria-labelledby="story-heading"
    >
      <ChapterScene
        heading={heading}
        headingId="story-heading"
        label="Story"
        variant="story"
      />
      <div className="story-stage">
        <div className="story-track">
          {spreads.map(({ memories, index, variant }) => (
            <article
              className={`story-spread story-spread--${variant}`}
              key={memories[0].id}
            >
              {memories.map((item, offset) => (
                <StoryMemory key={item.id} item={item} index={index + offset} />
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FullWidthMemory({
  content,
  photo,
}: {
  content: Content<'full_width_memory'>
  photo: ExperiencePhoto | null
}) {
  return (
    <section
      id="memory"
      className={`full-memory${photo ? '' : ' full-memory--empty'}`}
      aria-label={content.caption || 'Memory'}
    >
      {photo && (
        <img
          className="memory-image"
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          style={{
            objectPosition: `${photo.focalX * 100}% ${photo.focalY * 100}%`,
          }}
        />
      )}
      <div className="full-memory-copy">
        <DateLabel date={content.date} />
        <h2>{content.caption}</h2>
      </div>
    </section>
  )
}

export function LoveChapter({
  heading,
  items,
}: {
  heading: string
  items: PublicExperience['loveEntries']
}) {
  return (
    <section id="love" className="love-chapter" aria-labelledby="love-heading">
      <ChapterScene
        heading={heading}
        headingId="love-heading"
        label="Things I Love"
        variant="love"
      />
      <div className="love-stage">
        <ol className="love-sequence journey-content">
          {items.map((item, index) => (
            <li className="love-entry" key={item.id}>
              <span className="love-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{item.statement}</h3>
                {item.supportingText && <p>{item.supportingText}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function TimelineChapter({
  heading,
  items,
}: {
  heading: string
  items: ExperienceMemory[]
}) {
  return (
    <section
      id="timeline"
      className="timeline-chapter"
      aria-labelledby="timeline-heading"
    >
      <ChapterScene
        heading={heading}
        headingId="timeline-heading"
        label="Timeline"
        variant="timeline"
      />
      <div className="timeline-moments journey-content">
        {items.map((item) => (
          <article className="timeline-moment" key={item.id}>
            <div className="timeline-date">
              <MemoryDate item={item} />
            </div>
            <div className="timeline-content">
              {item.photo && <MemoryPhoto photo={item.photo} />}
              <div className="timeline-copy">
                <h3>{item.title}</h3>
                <RichText document={item.message} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function LetterChapter({
  content,
}: {
  content: Content<'birthday_letter'>
}) {
  return (
    <section
      id="letter"
      className="letter-chapter"
      aria-labelledby="letter-heading"
    >
      <div className="letter-reading">
        <div className="letter-introduction">
          <span className="chapter-scene-label">Birthday Letter</span>
          <h2 id="letter-heading" className="chapter-heading">
            {content.heading}
          </h2>
        </div>
        {content.opening && <p className="letter-opening">{content.opening}</p>}
        <div className="letter-body">
          <RichText document={content.body} />
        </div>
        <div className="letter-signature">
          {content.signature && <p>{content.signature}</p>}
          <DateLabel date={content.date} />
        </div>
      </div>
    </section>
  )
}

export function FinaleChapter({
  content,
  settings,
}: {
  content: Content<'final_closing'>
  settings: PublicSiteSettings
}) {
  const [today] = useState(Date.now)
  const elapsed = settings.relationshipStartDate
    ? Math.floor(
        (today -
          new Date(`${settings.relationshipStartDate}T00:00:00Z`).getTime()) /
          86400000,
      )
    : null
  return (
    <section id="finale" className="finale" aria-labelledby="finale-heading">
      <div className="finale-haze" aria-hidden="true" />
      <h2 id="finale-heading">{settings.recipientName}</h2>
      <div className="finale-heart-space" aria-hidden="true" />
      <div className="finale-message">
        <RichText document={content.message} />
      </div>
      {settings.closingSignature && (
        <p className="finale-signature">{settings.closingSignature}</p>
      )}
      <DateLabel date={content.date ?? settings.birthdayDate} />
      {settings.relationshipCounterVisible &&
        elapsed !== null &&
        elapsed >= 0 && (
          <p className="relationship-counter">
            {new Intl.NumberFormat('en').format(elapsed)} days together
          </p>
        )}
    </section>
  )
}
