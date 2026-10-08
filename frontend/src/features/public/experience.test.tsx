import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { Hero } from '@/views/components/public/Hero'
import { Intro } from '@/views/components/public/Intro'
import { Navigation } from '@/views/components/public/Navigation'
import { demoExperience } from './demoExperience'

vi.mock('@/three/components/CrystalHeart', () => ({
  CrystalHeart: () => <div />,
}))

describe('public content boundary', () => {
  test('Hero renders the supplied recipient and labels', () => {
    render(
      <Hero
        data={{
          ...demoExperience,
          settings: { ...demoExperience.settings, recipientName: 'Alexandra' },
        }}
        reducedMotion
        progress={{ current: 0 }}
      />,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Alexandra',
    )
    expect(screen.getByText('FOR')).toBeVisible()
    expect(screen.getByText('WITH LOVE')).toBeVisible()
    expect(screen.queryByText('Recipient Name')).not.toBeInTheDocument()
  })
  test('keeps a long supplied name intact', () => {
    const recipientName = 'Alexandra Maria Isabel de la Cruz Santos'
    render(
      <Hero
        data={{
          ...demoExperience,
          settings: { ...demoExperience.settings, recipientName },
        }}
        reducedMotion
        progress={{ current: 0 }}
      />,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      recipientName,
    )
  })
  test('Intro renders supplied rich text without executable HTML', () => {
    render(
      <Intro
        content={{
          message: {
            blocks: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'A supplied message <script>alert(1)</script>',
                  },
                ],
              },
            ],
          },
          supportingText: 'Supporting copy',
        }}
      />,
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'A supplied message <script>alert(1)</script>',
    )
    expect(screen.getByText('Supporting copy')).toBeVisible()
    expect(document.querySelector('script')).toBeNull()
  })
  test('navigation shows only implemented anchors and stays visible when focused', () => {
    render(<Navigation paused={false} onToggleMotion={() => {}} />)
    const nav = screen.getByRole('navigation')
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['#home', '#home', '#intro'])
    screen.getByRole('link', { name: 'Intro' }).focus()
    fireEvent.scroll(window)
    expect(nav).toHaveAttribute('data-hidden', 'false')
  })
  test('demo content is isolated and explicitly neutral', () => {
    expect(demoExperience.settings.recipientName).toBe('Recipient Name')
    expect(demoExperience.settings.birthdayDate).toBeNull()
    expect(demoExperience.intro.supportingText).toContain('Demo')
  })
})
