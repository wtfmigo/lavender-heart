import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Gallery } from './Gallery'

const photos = Array.from({ length: 13 }, (_, index) => ({
  id: `photo-${index}`,
  src: `/photo-${index}.webp`,
  alt: `Memory ${index}`,
  caption: `Caption ${index}`,
  width: 1200,
  height: 800,
  focalX: 0.3,
  focalY: 0.6,
}))
let visibility: IntersectionObserverCallback
let preload: IntersectionObserverCallback
let frame: FrameRequestCallback
const originalObserver = window.IntersectionObserver
beforeEach(() => {
  vi.stubGlobal(
    'PointerEvent',
    class extends MouseEvent {
      pointerType: string
      constructor(type: string, init: PointerEventInit) {
        super(type, init)
        this.pointerType = init.pointerType ?? 'mouse'
      }
    },
  )
  window.IntersectionObserver = class {
    constructor(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      if (options?.rootMargin) preload = callback
      else visibility = callback
    }
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frame = callback
    return 1
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  } as unknown as MediaQueryList)
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: vi.fn(),
  })
})
afterEach(() => {
  window.IntersectionObserver = originalObserver
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
function mount(reducedMotion = false) {
  const view = render(
    <Gallery
      heading="Collection"
      photos={photos}
      reducedMotion={reducedMotion}
    />,
  )
  const stage = screen.getByRole('group', { name: 'Rotate photo galaxy' })
  const rotor = view.container.querySelector(
    '.photo-galaxy-rotor',
  ) as HTMLElement
  return { ...view, stage, rotor }
}
function enter() {
  act(() =>
    visibility(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  )
}
it('warms sphere images ahead of arrival without starting offscreen rotation', () => {
  const { container } = mount()
  const images = [
    ...container.querySelectorAll<HTMLImageElement>('.photo-galaxy img'),
  ]
  expect(images).toHaveLength(3)
  expect(
    images.every((image) => image.getAttribute('loading') === 'lazy'),
  ).toBe(true)
  act(() =>
    preload(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  )
  expect(images.every((image) => image.loading === 'eager')).toBe(true)
  expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  enter()
  expect(window.requestAnimationFrame).toHaveBeenCalledOnce()
})
it('rotates on both keyboard axes and keeps pause and list controls usable', () => {
  const { stage, rotor, container } = mount()
  const original = rotor.style.getPropertyValue('--galaxy-yaw')
  fireEvent.keyDown(stage, { key: 'ArrowRight' })
  expect(rotor.style.getPropertyValue('--galaxy-yaw')).not.toBe(original)
  fireEvent.keyDown(stage, { key: 'ArrowUp' })
  expect(rotor.style.getPropertyValue('--galaxy-pitch')).not.toBe('0deg')
  fireEvent.click(screen.getByRole('button', { name: 'Pause rotation' }))
  expect(
    screen.getByRole('button', { name: 'Resume rotation' }),
  ).toBeInTheDocument()
  const buttons = [
    ...container.querySelectorAll('.photo-galaxy .gallery-photo button'),
  ]
  fireEvent.click(screen.getByRole('button', { name: 'Show photo list' }))
  expect([
    ...container.querySelectorAll('.photo-galaxy .gallery-photo button'),
  ]).toEqual(buttons)
  expect(buttons).toHaveLength(3)
})
it('distinguishes a two-axis drag from a photo click', () => {
  const { stage, rotor } = mount()
  const button = screen.getByRole('button', {
    name: 'Open photo 11: Memory 10',
  })
  fireEvent.pointerDown(button, { button: 0, clientX: 10, clientY: 10 })
  fireEvent.pointerMove(stage, { clientX: 100, clientY: 80 })
  fireEvent.pointerUp(stage)
  fireEvent.click(button, { detail: 1 })
  expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled()
  expect(rotor.style.getPropertyValue('--galaxy-pitch')).not.toBe('0deg')
  fireEvent.pointerDown(button, { button: 0, clientX: 10, clientY: 10 })
  fireEvent.pointerUp(stage)
  fireEvent.click(button)
  expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce()
})
it('leaves vertical touch gestures to native page scrolling', () => {
  const { stage, rotor } = mount()
  fireEvent.pointerDown(stage, {
    pointerType: 'touch',
    button: 0,
    clientX: 10,
    clientY: 10,
  })
  const move = new PointerEvent('pointermove', {
    pointerType: 'touch',
    clientX: 15,
    clientY: 90,
    bubbles: true,
    cancelable: true,
  })
  fireEvent(stage, move)
  expect(move.defaultPrevented).toBe(false)
  expect(rotor.style.getPropertyValue('--galaxy-yaw')).toBe('0deg')
  expect(rotor.style.getPropertyValue('--galaxy-pitch')).toBe('0deg')
})
it('rotates horizontal touch gestures without tilting the sphere', () => {
  const { stage, rotor } = mount()
  fireEvent.pointerDown(stage, {
    pointerType: 'touch',
    button: 0,
    clientX: 10,
    clientY: 10,
  })
  fireEvent.pointerMove(stage, {
    pointerType: 'touch',
    clientX: 70,
    clientY: 30,
  })
  expect(rotor.style.getPropertyValue('--galaxy-yaw')).not.toBe('0deg')
  expect(rotor.style.getPropertyValue('--galaxy-pitch')).toBe('0deg')
})
it('brings a keyboard-focused sphere photo forward and pauses rotation', () => {
  const { rotor } = mount()
  enter()
  fireEvent.focus(
    screen.getByRole('button', { name: 'Open photo 12: Memory 11' }),
  )
  expect(rotor.style.getPropertyValue('--galaxy-yaw')).not.toBe('0deg')
  expect(window.cancelAnimationFrame).toHaveBeenCalled()
})
it('opens list photos after a touch drag that produces no click', () => {
  const { stage } = mount()
  fireEvent.pointerDown(stage, { button: 0, clientX: 10, clientY: 10 })
  fireEvent.pointerMove(stage, { clientX: 100, clientY: 80 })
  fireEvent.pointerUp(stage)
  fireEvent.click(screen.getByRole('button', { name: 'Show photo list' }))
  const photo = screen.getByRole('button', { name: 'Open photo 11: Memory 10' })
  fireEvent.pointerDown(photo, { button: 0, clientX: 10, clientY: 10 })
  fireEvent.pointerUp(photo)
  fireEvent.click(photo, { detail: 1 })
  expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce()
})
it('keeps rotating when the pointer enters the visible sphere', () => {
  const { stage, rotor } = mount()
  enter()
  act(() => frame(100))
  fireEvent.pointerEnter(stage)
  expect(window.cancelAnimationFrame).not.toHaveBeenCalled()
  act(() => frame(150))
  expect(parseFloat(rotor.style.getPropertyValue('--galaxy-yaw'))).toBeCloseTo(
    0.6,
  )
})
it('resumes immediately after a drag even when its photo still has pointer focus', () => {
  const { stage } = mount()
  enter()
  const photo = screen.getByRole('button', { name: 'Open photo 11: Memory 10' })
  fireEvent.pointerDown(photo, { button: 0, clientX: 10, clientY: 10 })
  act(() => photo.focus())
  fireEvent.pointerMove(stage, { clientX: 40, clientY: 20 })
  const beforeRelease = vi.mocked(window.requestAnimationFrame).mock.calls
    .length
  fireEvent.pointerUp(stage)
  expect(
    vi.mocked(window.requestAnimationFrame).mock.calls.length,
  ).toBeGreaterThan(beforeRelease)
})
it('rotates at twelve degrees per second while visible', () => {
  const { rotor } = mount()
  enter()
  act(() => frame(100))
  act(() => frame(150))
  expect(parseFloat(rotor.style.getPropertyValue('--galaxy-yaw'))).toBeCloseTo(
    0.6,
  )
})
it('pauses for keyboard rotation after a drag has resumed automatic rotation', () => {
  const { stage } = mount()
  enter()
  fireEvent.pointerDown(stage, { button: 0, clientX: 10, clientY: 10 })
  act(() => stage.focus())
  fireEvent.pointerUp(stage)
  const beforeKeyboard = vi.mocked(window.cancelAnimationFrame).mock.calls
    .length
  fireEvent.keyDown(stage, { key: 'ArrowRight' })
  expect(
    vi.mocked(window.cancelAnimationFrame).mock.calls.length,
  ).toBeGreaterThan(beforeKeyboard)
})
it('starts only onscreen and stops for pause, hidden tabs, lightbox, and unmount', () => {
  const { unmount } = mount()
  expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  enter()
  expect(window.requestAnimationFrame).toHaveBeenCalledOnce()
  act(() => frame(100))
  fireEvent.click(screen.getByRole('button', { name: 'Pause rotation' }))
  expect(window.cancelAnimationFrame).toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Resume rotation' }))
  const beforeHidden = vi.mocked(window.requestAnimationFrame).mock.calls.length
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
  const beforeHiddenCancel = vi.mocked(window.cancelAnimationFrame).mock.calls
    .length
  fireEvent(document, new Event('visibilitychange'))
  expect(
    vi.mocked(window.cancelAnimationFrame).mock.calls.length,
  ).toBeGreaterThan(beforeHiddenCancel)
  expect(vi.mocked(window.requestAnimationFrame).mock.calls.length).toBe(
    beforeHidden,
  )
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  fireEvent(document, new Event('visibilitychange'))
  const beforeLightboxCancel = vi.mocked(window.cancelAnimationFrame).mock.calls
    .length
  fireEvent.click(
    screen.getByRole('button', { name: 'Open photo 11: Memory 10' }),
  )
  expect(
    vi.mocked(window.cancelAnimationFrame).mock.calls.length,
  ).toBeGreaterThan(beforeLightboxCancel)
  const calls = vi.mocked(window.cancelAnimationFrame).mock.calls.length
  unmount()
  expect(
    vi.mocked(window.cancelAnimationFrame).mock.calls.length,
  ).toBeGreaterThanOrEqual(calls)
})
it('honors reduced motion and global pause while retaining manual rotation', () => {
  const { stage, rerender } = mount(true)
  enter()
  expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  fireEvent.keyDown(stage, { key: 'ArrowLeft' })
  expect(
    screen.getByRole('button', { name: 'Show photo list' }),
  ).toBeInTheDocument()
  rerender(
    <Gallery heading="Collection" photos={photos} reducedMotion={false} />,
  )
  fireEvent.blur(stage)
  expect(window.requestAnimationFrame).toHaveBeenCalledOnce()
})
it('keeps a single keepsake accessible without invalid sphere positions', () => {
  const { container } = render(
    <Gallery heading="Collection" photos={photos.slice(0, 11)} />,
  )
  expect(container.querySelector('.photo-galaxy')).toBeInTheDocument()
  expect(
    container.querySelectorAll('.photo-galaxy .gallery-photo button'),
  ).toHaveLength(1)
  expect(container.innerHTML).not.toMatch(/NaN|Infinity/)
})
