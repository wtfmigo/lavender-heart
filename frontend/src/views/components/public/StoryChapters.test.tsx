import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import {
  RichText,
  StoryChapter,
  TimelineChapter,
  LetterChapter,
  FinaleChapter,
  LoveChapter,
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

test('Love messages stay concealed until independently opened and keep their supplied content', () => {
  const entries = [
    {
      id: 'first',
      statement: 'Supplied first heading',
      supportingText: 'Supplied first body',
      position: 0,
    },
    {
      id: 'second',
      statement: 'Supplied second heading',
      supportingText: '',
      position: 1,
    },
  ]
  const { container, rerender } = render(
    <LoveChapter heading="Supplied heading" items={entries} reducedMotion />,
  )
  expect(container.querySelector('.love-progress')).toBeNull()
  expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
  const button = screen.getByRole('button', { name: 'Reveal message 1' })
  expect(button).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(button)
  const first = screen.getByRole('region', { name: 'Supplied first heading' })
  expect(first).toHaveFocus()
  expect(within(first).getByText('Supplied first body')).toBeInTheDocument()
  expect(
    screen.queryByRole('heading', { name: 'Supplied second heading' }),
  ).not.toBeInTheDocument()
  rerender(
    <LoveChapter
      heading="Supplied heading"
      items={entries}
      reducedMotion={false}
    />,
  )
  expect(
    screen.getByRole('heading', { name: 'Supplied first heading' }),
  ).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Reveal message 2' }))
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2)
  expect(container.querySelectorAll('.love-copy p')).toHaveLength(1)
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

test('story gives each memory its own spread without losing or repeating supplied content', () => {
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
  expect(container.querySelectorAll('.story-spread')).toHaveLength(8)
  container
    .querySelectorAll('.story-spread')
    .forEach((spread) =>
      expect(spread.querySelectorAll('.story-memory')).toHaveLength(1),
    )
  memories.forEach((_, index) =>
    expect(screen.getAllByText(`Words ${index + 1}`)).toHaveLength(1),
  )
})

test('timeline keeps genuine dates without repeated year displays or invented metadata', () => {
  const { container } = render(
    <TimelineChapter
      heading="Our dates"
      items={[items[0], { ...items[1], date: null, dateLabel: 'YOUR YEAR' }]}
    />,
  )
  expect(
    container.querySelector('time[datetime="2026-10-08"]'),
  ).toHaveTextContent('October 8')
  expect(container.querySelector('.timeline-date time strong')).toBeNull()
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
