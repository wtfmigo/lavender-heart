import { render } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useJourneyAnimation } from './useJourneyAnimation'

const mocks = vi.hoisted(() => ({
  fromTo: vi.fn(),
  to: vi.fn(),
  destroy: vi.fn(),
  resize: vi.fn(),
  unsubscribe: vi.fn(),
  tickerAdd: vi.fn(),
  tickerRemove: vi.fn(),
  revert: vi.fn(),
  journeyTo: vi.fn(),
  timeline: vi.fn(),
  desktop: true,
  matchCleanup: undefined as (() => void) | undefined,
}))
vi.mock('@gsap/react', async () => {
  const { useEffect } = await import('react')
  return {
    useGSAP: (callback: () => void, options: { dependencies: unknown[] }) =>
      useEffect(() => callback(), [callback, options]),
  }
})
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    fromTo: mocks.fromTo,
    to: mocks.to,
    timeline: mocks.timeline,
    getProperty: () => 1,
    ticker: { add: mocks.tickerAdd, remove: mocks.tickerRemove },
    matchMedia: () => ({
      add: (_query: unknown, callback: (context: unknown) => () => void) => {
        mocks.matchCleanup = callback({
          conditions: { desktop: mocks.desktop },
        })
      },
      revert: () => {
        mocks.revert()
        mocks.matchCleanup?.()
      },
    }),
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    update: vi.fn(),
    refresh: vi.fn(),
  },
}))
vi.mock('lenis', () => ({
  default: class {
    on() {
      return mocks.unsubscribe
    }
    raf() {}
    resize = mocks.resize
    destroy = mocks.destroy
  },
}))

function Journey({
  reduced = false,
  complete = false,
  tallStory = false,
  tallLove = false,
}: {
  reduced?: boolean
  complete?: boolean
  tallStory?: boolean
  tallLove?: boolean
}) {
  const container = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  useJourneyAnimation(container, progress, reduced)
  return (
    <div ref={container}>
      <div className="persistent-heart" />
      <section id="home" />
      {complete &&
        ['intro', 'story', 'gallery', 'love', 'timeline'].map((id) => (
          <section id={id} key={id}>
            <header className="chapter-scene">
              <div
                className="chapter-heart"
                ref={(element) => {
                  if (element)
                    element.getBoundingClientRect = () => ({
                      top: 100,
                      bottom: 200,
                      left: 400,
                      right: 500,
                      width: 100,
                      height: 100,
                      x: 400,
                      y: 100,
                      toJSON: () => ({}),
                    })
                }}
              />
            </header>
            <div
              className={id === 'timeline' ? 'timeline-moment' : 'chapter-body'}
            />
            {id === 'story' && (
              <div className="story-stage">
                <div
                  className="story-track"
                  ref={(element) => {
                    if (element && tallStory)
                      Object.defineProperty(element, 'scrollHeight', {
                        value: window.innerHeight + 100,
                      })
                  }}
                />
              </div>
            )}
            {id === 'love' && (
              <div
                className="love-stage"
                ref={(element) => {
                  if (element)
                    Object.defineProperty(element, 'clientHeight', {
                      value: window.innerHeight,
                    })
                }}
              >
                <ol
                  className="love-sequence"
                  ref={(element) => {
                    if (element)
                      Object.defineProperty(element, 'scrollHeight', {
                        value: window.innerHeight * 3,
                      })
                  }}
                >
                  {[0, 1, 2].map((index) => (
                    <li
                      key={index}
                      className="love-entry"
                      ref={(element) => {
                        if (element)
                          Object.defineProperty(element, 'scrollHeight', {
                            configurable: true,
                            value:
                              window.innerHeight +
                              (tallLove && index === 0 ? 100 : 0),
                          })
                      }}
                    />
                  ))}
                </ol>
              </div>
            )}
          </section>
        ))}
      <section id="memory">
        <img className="memory-image" alt="" />
      </section>
      <section id="letter" />
      <section id="finale" />
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.desktop = true
  mocks.matchCleanup = undefined
  mocks.timeline.mockReturnValue({
    clear: vi.fn(),
    set: vi.fn(),
    to: mocks.journeyTo,
    progress: vi.fn(),
    kill: vi.fn(),
  })
})

afterEach(() => vi.restoreAllMocks())

test('hidden chapters connect adjacent visible heart positions and release Lenis', () => {
  const { unmount } = render(<Journey />)
  const heartCalls = mocks.journeyTo.mock.calls.filter(([element]) =>
    element.classList.contains('persistent-heart'),
  )
  expect(heartCalls).toHaveLength(3)
  expect(mocks.timeline).toHaveBeenCalledOnce()
  expect(heartCalls[0][1].width).toBe(140)
  expect(heartCalls[0][1].opacity).toBe(0.5)
  expect(heartCalls[1][1].opacity).toBe(0)
  expect(heartCalls[2][1].left).toBe('50%')
  expect(
    mocks.fromTo.mock.calls.some(([element]) =>
      element.classList.contains('persistent-heart'),
    ),
  ).toBe(false)
  expect(
    mocks.fromTo.mock.calls.some(([element]) =>
      element.classList.contains('memory-image'),
    ),
  ).toBe(true)
  unmount()
  expect(mocks.tickerRemove).toHaveBeenCalledWith(
    mocks.tickerAdd.mock.calls[0][0],
  )
  expect(mocks.destroy).toHaveBeenCalledOnce()
  expect(mocks.unsubscribe).toHaveBeenCalledOnce()
  expect(mocks.revert).toHaveBeenCalledOnce()
})

test('each desktop chapter has its own companion scale and the finale dominates', () => {
  render(<Journey complete />)
  const states = mocks.journeyTo.mock.calls.map(([, state]) => state)
  expect(states.some((state) => state.width === 350 && state.opacity > 0)).toBe(
    true,
  )
  expect(
    states.filter(
      (state) =>
        state.width > 300 && state.left.endsWith('%') && state.opacity > 0,
    ).length,
  ).toBeGreaterThanOrEqual(3)
  expect(
    states.some((state) => state.width > 300 && state.left === '24%'),
  ).toBe(true)
  expect(
    states.some((state) => state.width === 160 && state.left === '50%'),
  ).toBe(true)
  expect(states.at(-1).height).toBe(window.innerHeight * 0.72)
})

test('phone companions recur in chapter introductions and recede during reading', () => {
  mocks.desktop = false
  render(<Journey complete />)
  const states = mocks.journeyTo.mock.calls.map(([, state]) => state)
  expect(
    states.filter((state) => state.width === 110 && state.opacity > 0).length,
  ).toBeGreaterThanOrEqual(5)
  expect(
    states.filter((state) => state.width === 110 && state.opacity === 0).length,
  ).toBeGreaterThanOrEqual(4)
  expect(states.at(-1).height).toBe(window.innerHeight * 0.62)
})

test('reduced motion leaves native scrolling and images static', () => {
  render(<Journey reduced />)
  expect(mocks.fromTo).not.toHaveBeenCalled()
  expect(mocks.tickerAdd).not.toHaveBeenCalled()
})

test('tall Story copy stays reachable in native flow and clears its marker on cleanup', () => {
  const { container, unmount } = render(<Journey complete tallStory />)
  const stage = container.querySelector('.story-stage')!
  expect(stage.getAttribute('data-story-flow')).toBe('vertical')
  expect(
    mocks.to.mock.calls.some(([element]) =>
      element.classList.contains('story-track'),
    ),
  ).toBe(false)
  unmount()
  expect(stage.hasAttribute('data-story-flow')).toBe(false)
})

test('desktop Love pins measured vertical travel through one statement at a time', () => {
  render(<Journey complete />)
  const animation = mocks.to.mock.calls.find(([element]) =>
    element.classList.contains('love-sequence'),
  )
  expect(animation).toBeDefined()
  expect(animation![1].y()).toBe(-window.innerHeight * 2)
  expect(animation![1].scrollTrigger.pin).toBe(true)
  expect(animation![1].scrollTrigger.end()).toBe(`+=${window.innerHeight * 2}`)
})

test('live heart suppresses an onscreen chapter echo even at a different anchor', () => {
  const { container } = render(<Journey complete />)
  mocks.tickerAdd.mock.calls.at(-1)![0]()
  expect(container.querySelector('#gallery')).toHaveAttribute(
    'data-live-heart',
    'true',
  )
})

test('tall Love statements stay reachable in native flow and clear their marker', () => {
  const { container, unmount } = render(<Journey complete tallLove />)
  const stage = container.querySelector('.love-stage')!
  expect(stage.getAttribute('data-love-flow')).toBe('vertical')
  expect(
    mocks.to.mock.calls.some(([element]) =>
      element.classList.contains('love-sequence'),
    ),
  ).toBe(false)
  unmount()
  expect(stage.hasAttribute('data-love-flow')).toBe(false)
})

test.each(['story', 'love'])(
  'late %s overflow queues one cancellable refresh after conversion',
  (chapter) => {
    const frames: FrameRequestCallback[] = []
    const queued = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        frames.push(callback)
        return frames.length
      })
    const cancel = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {})
    const { container, unmount } = render(<Journey complete />)
    container.querySelector('img')!.dispatchEvent(new Event('load'))
    const selector = chapter === 'story' ? '.story-track' : '.love-sequence'
    const content = container.querySelector(
      chapter === 'story' ? selector : '.love-entry',
    )!
    Object.defineProperty(content, 'scrollHeight', {
      configurable: true,
      value: window.innerHeight + 100,
    })
    const animation = mocks.to.mock.calls.find(([element]) =>
      element.matches(selector),
    )!
    const kill = vi.fn()
    animation[1].scrollTrigger.onRefresh({ kill })
    expect(kill).toHaveBeenCalledWith(true)
    expect(queued).toHaveBeenCalledTimes(2)
    expect(cancel).toHaveBeenLastCalledWith(1)
    frames.at(-1)!(0)
    expect(mocks.resize).toHaveBeenCalledOnce()
    expect(ScrollTrigger.refresh).toHaveBeenCalledOnce()
    unmount()
    expect(cancel).toHaveBeenLastCalledWith(2)
  },
)
