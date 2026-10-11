import { act, render, waitFor } from '@testing-library/react'
import { useCallback, useRef } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { useLoveSequence } from './useLoveSequence'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function Sequence({ reduced = false, oversized = false }) {
  const stage = useRef<HTMLDivElement>(null)
  const bindStage = useCallback((element: HTMLDivElement | null) => {
    stage.current = element
    if (element)
      element.getBoundingClientRect = () => new DOMRect(0, -scrollY, 1000, 2100)
  }, [])
  useLoveSequence(stage, reduced, 3)
  return (
    <div className="love-stage" ref={bindStage}>
      <div className="love-window" style={{ minHeight: 700 }}>
        <ol className="love-sequence">
          {[0, 1, 2].map((index) => (
            <li
              className="love-entry"
              key={index}
              ref={(element) => {
                if (!element) return
                Object.defineProperty(element, 'offsetHeight', {
                  value: oversized && index === 1 ? 800 : 700,
                })
                element.getBoundingClientRect = () => {
                  const height =
                    stage.current?.dataset.loveFlow === 'staged' ? 700 : 350
                  return new DOMRect(0, index * height - scrollY, 1000, height)
                }
              }}
            >
              Statement {index + 1}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

test('native scrolling advances the vertical statement sequence without native timelines', async () => {
  vi.stubGlobal('CSS', { supports: () => false })
  vi.stubGlobal('scrollY', 0)
  const { container } = render(<Sequence />)
  const stage = container.querySelector('.love-stage')!
  const sequence = container.querySelector<HTMLElement>('.love-sequence')!
  expect(stage).toHaveAttribute('data-love-flow', 'staged')
  expect(sequence.style.animation).toBe('none')
  vi.stubGlobal('scrollY', 700)
  act(() => window.dispatchEvent(new Event('scroll')))
  await waitFor(() =>
    expect(sequence.style.transform).toBe('translateY(-700px)'),
  )
  vi.stubGlobal('scrollY', 0)
  act(() => window.dispatchEvent(new Event('scroll')))
  await waitFor(() => expect(sequence.style.transform).toBe('translateY(0px)'))
})

test.each([{ reduced: true }, { oversized: true }])(
  'reduced motion and oversized statements remain in readable vertical flow: %j',
  (props) => {
    vi.stubGlobal('CSS', { supports: () => true })
    const { container } = render(<Sequence {...props} />)
    expect(container.querySelector('.love-stage')).toHaveAttribute(
      'data-love-flow',
      'vertical',
    )
    expect(container.querySelector('ol')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(3)
  },
)

test('pausing and resuming keeps the same visible statement', () => {
  vi.stubGlobal('CSS', { supports: () => true })
  vi.stubGlobal('scrollY', 700)
  const scrollTo = vi
    .spyOn(window, 'scrollTo')
    .mockImplementation((options) => {
      vi.stubGlobal('scrollY', (options as ScrollToOptions).top)
    })
  const { container, rerender } = render(<Sequence />)
  rerender(<Sequence reduced />)
  expect(container.querySelector('.love-stage')).toHaveAttribute(
    'data-love-flow',
    'vertical',
  )
  expect(scrollTo).toHaveBeenLastCalledWith({ top: 350, behavior: 'instant' })
  rerender(<Sequence />)
  expect(scrollTo).toHaveBeenLastCalledWith({ top: 700, behavior: 'instant' })
})
