import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Gallery } from './Gallery'

const photos = ['first', 'second'].map((id) => ({
  id,
  src: `/${id}.webp`,
  alt: `${id} landscape`,
  caption: 'Photo caption',
  width: 1200,
  height: 800,
  focalX: 0.5,
  focalY: 0.5,
}))
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: () => {},
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: () => {},
  })
  vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(
    function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
  )
  vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function (
    this: HTMLDialogElement,
  ) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  })
})
afterEach(() => vi.restoreAllMocks())
it('opens the selected image, wraps through keyboard and buttons, and restores focus', () => {
  render(<Gallery heading="Our photographs" photos={photos} />)
  const thumb = screen.getByRole('button', {
    name: 'Open photo 2: second landscape',
  })
  fireEvent.click(thumb)
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveAttribute('open')
  expect(screen.getByText('2 / 2')).toBeInTheDocument()
  fireEvent.keyDown(dialog, { key: 'ArrowRight' })
  expect(screen.getByText('1 / 2')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }))
  expect(screen.getByText('2 / 2')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Close photographs' }))
  expect(dialog).not.toHaveAttribute('open')
  expect(thumb).toHaveFocus()
})
it('omits an empty gallery', () => {
  const { container } = render(
    <Gallery heading="Our photographs" photos={[]} />,
  )
  expect(container).toBeEmptyDOMElement()
})
it.each([1, 2, 7, 16, 23])(
  'keeps all %i photos available exactly once in editorial scenes',
  (count) => {
    const items = Array.from({ length: count }, (_, index) => ({
      ...photos[0],
      id: `memory-${index}`,
      alt: `Memory ${index}`,
    }))
    const { container } = render(
      <Gallery heading="A little collection" photos={items} />,
    )
    expect(container.querySelectorAll('.gallery-photo button')).toHaveLength(
      count,
    )
    expect(container.querySelector('.collection-opening')).toBeInTheDocument()
    expect(container.querySelector('.collection-closing')).toBeInTheDocument()
    if (count >= 16) {
      expect(container.querySelectorAll('.collection-spread')).toHaveLength(3)
      expect(
        container.querySelector('.collection-favorite .gallery-photo'),
      ).not.toBeInTheDocument()
      expect(
        container.querySelectorAll('.collection-details .gallery-photo'),
      ).toHaveLength(count - 10)
    }
  },
)
it('paces details in ordered three-by-three groups without losing photo captions', () => {
  const items = Array.from({ length: 23 }, (_, index) => ({
    ...photos[0],
    id: `memory-${index}`,
    alt: `Memory ${index}`,
    caption: `Caption ${index}`,
  }))
  const { container } = render(
    <Gallery heading="A little collection" photos={items} />,
  )
  const groups = container.querySelectorAll('.collection-detail-spread')
  expect(
    Array.from(groups, (group) => group.querySelectorAll('figure').length),
  ).toEqual([9, 4])
  expect(
    Array.from(container.querySelectorAll('.gallery-photo button'), (button) =>
      button.getAttribute('aria-label'),
    ),
  ).toEqual(items.map((item, index) => `Open photo ${index + 1}: ${item.alt}`))
  expect(
    Array.from(
      container.querySelectorAll('.collection-details figcaption'),
      (caption) => caption.textContent,
    ),
  ).toEqual(items.slice(10).map((item) => item.caption))
})
