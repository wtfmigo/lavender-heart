import { render } from '@testing-library/react'
import { useRef } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import { useJourneyAnimation } from './useJourneyAnimation'

const mocks = vi.hoisted(() => ({
  fromTo: vi.fn(),
  to: vi.fn(),
  destroy: vi.fn(),
  unsubscribe: vi.fn(),
  tickerAdd: vi.fn(),
  tickerRemove: vi.fn(),
  revert: vi.fn(),
  journeyTo: vi.fn(),
  timeline: vi.fn(),
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
      add: (_query: unknown, callback: (context: unknown) => void) =>
        callback({ conditions: { desktop: true } }),
      revert: mocks.revert,
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
    resize() {}
    destroy = mocks.destroy
  },
}))

function Journey({ reduced = false }: { reduced?: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  useJourneyAnimation(container, progress, reduced)
  return (
    <div ref={container}>
      <div className="persistent-heart" />
      <section id="home" />
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
  mocks.timeline.mockReturnValue({
    clear: vi.fn(),
    set: vi.fn(),
    to: mocks.journeyTo,
    progress: vi.fn(),
    kill: vi.fn(),
  })
})

test('hidden chapters connect adjacent visible heart positions and release Lenis', () => {
  const { unmount } = render(<Journey />)
  const heartCalls = mocks.journeyTo.mock.calls.filter(([element]) =>
    element.classList.contains('persistent-heart'),
  )
  expect(heartCalls).toHaveLength(3)
  expect(mocks.timeline).toHaveBeenCalledOnce()
  expect(heartCalls[0][1].left).toBe('72px')
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

test('reduced motion leaves native scrolling and images static', () => {
  render(<Journey reduced />)
  expect(mocks.fromTo).not.toHaveBeenCalled()
  expect(mocks.tickerAdd).not.toHaveBeenCalled()
})
