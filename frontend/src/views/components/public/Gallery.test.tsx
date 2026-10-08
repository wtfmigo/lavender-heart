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
