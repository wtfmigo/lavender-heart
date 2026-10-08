import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import {
  RichText,
  StoryChapter,
  TimelineChapter,
  LetterChapter,
  FinaleChapter,
} from './StoryChapters'
import type { ExperienceMemory } from '@/features/public/experience'
import { demoExperience } from '@/features/public/demoExperience'

const message = {
  blocks: [
    {
      type: 'paragraph' as const,
      children: [
        {
          type: 'text' as const,
          text: '<script>private words</script>',
          marks: ['bold' as const, 'italic' as const],
        },
      ],
    },
  ],
}
const items: ExperienceMemory[] = [
  {
    id: 'later',
    title: 'Owner first',
    date: '2026-10-08',
    message,
    photo: null,
    position: 0,
  },
  {
    id: 'earlier',
    title: 'Owner second',
    date: '2020-01-01',
    message,
    photo: {
      id: 'photo',
      src: '/photo.webp',
      alt: 'Supplied description',
      width: 800,
      height: 1200,
      caption: 'Supplied caption',
      focalX: 0.25,
      focalY: 0.7,
    },
    position: 1,
  },
]

test('rich text preserves semantic marks and escapes HTML', () => {
  const { container } = render(<RichText document={message} />)
  expect(screen.getByText('<script>private words</script>')).toBeVisible()
  expect(container.querySelector('strong em')).not.toBeNull()
  expect(container.querySelector('script')).toBeNull()
})

test('story preserves supplied owner order and lazy photo metadata', () => {
  render(<StoryChapter heading="Our moments" items={items} />)
  expect(
    screen
      .getAllByRole('heading', { level: 3 })
      .map((item) => item.textContent),
  ).toEqual(['Owner first', 'Owner second'])
  const image = screen.getByAltText('Supplied description')
  expect(image).toHaveAttribute('loading', 'lazy')
  expect(image).toHaveStyle({ objectPosition: '25% 70%' })
  expect(screen.getByText('Supplied caption')).toBeVisible()
})

test('story pairs two memories without losing or repeating supplied content', () => {
  const memories = Array.from({ length: 8 }, (_, index) => ({
    ...items[index % items.length],
    id: `memory-${index}`,
    title: `Memory ${index + 1}`,
    message: {
      blocks: [
        {
          type: 'paragraph' as const,
          children: [{ type: 'text' as const, text: `Words ${index + 1}` }],
        },
      ],
    },
  }))
  const { container } = render(
    <StoryChapter heading="Our moments" items={memories} />,
  )
  expect(
    screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent),
  ).toEqual(memories.map((memory) => memory.title))
  expect(container.querySelectorAll('.story-spread')).toHaveLength(7)
  expect(
    container.querySelectorAll('.story-spread--paired .story-copy h3'),
  ).toHaveLength(2)
  memories.forEach((_, index) =>
    expect(screen.getAllByText(`Words ${index + 1}`)).toHaveLength(1),
  )
})

test('timeline makes genuine dates dominant and labels missing dates without inventing metadata', () => {
  const { container } = render(
    <TimelineChapter
      heading="Our dates"
      items={[items[0], { ...items[1], date: null, dateLabel: 'YOUR YEAR' }]}
    />,
  )
  expect(
    container.querySelector('time[datetime="2026-10-08"] strong'),
  ).toHaveTextContent('2026')
  expect(screen.getByText('YOUR YEAR')).toBeVisible()
  expect(container.querySelectorAll('time')).toHaveLength(1)
  expect(container.querySelector('.timeline-date .chapter-index')).toBeNull()
})

test('timeline uses owner order and omits unavailable date metadata', () => {
  const { container } = render(
    <TimelineChapter
      heading="A timeline of us"
      items={items.map((item) => ({ ...item, date: null }))}
    />,
  )
  expect(
    screen
      .getAllByRole('heading', { level: 3 })
      .map((item) => item.textContent),
  ).toEqual(['Owner first', 'Owner second'])
  expect(container.querySelector('time')).toBeNull()
  expect(screen.queryByText('Special date')).not.toBeInTheDocument()
})

test('letter consumes the supplied opener, body and signature', () => {
  render(
    <LetterChapter
      content={{
        heading: 'Birthday letter',
        opening: 'Supplied opener',
        body: message,
        signature: 'Supplied signature',
        date: null,
      }}
    />,
  )
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
    'Birthday letter',
  )
  expect(screen.getByText('Supplied opener')).toBeVisible()
  expect(screen.getByText('Supplied signature')).toBeVisible()
})

test('finale keeps the relationship counter optional and signature supplied', () => {
  const settings = {
    ...demoExperience.settings,
    closingSignature: 'Supplied closing',
    relationshipStartDate: '2020-01-01',
    relationshipCounterVisible: false,
  }
  const { rerender } = render(
    <FinaleChapter content={{ message, date: null }} settings={settings} />,
  )
  expect(screen.getByText('Supplied closing')).toBeVisible()
  expect(screen.queryByText(/days together/)).not.toBeInTheDocument()
  rerender(
    <FinaleChapter
      content={{ message, date: null }}
      settings={{ ...settings, relationshipCounterVisible: true }}
    />,
  )
  expect(screen.getByText(/days together/)).toBeVisible()
})
