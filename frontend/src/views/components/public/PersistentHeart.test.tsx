import { act, render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { PersistentHeart } from './PersistentHeart'

const sculpture = vi.hoisted(() => vi.fn())
vi.mock('@/three/components/CrystalHeart', () => ({
  CrystalHeart: (props: unknown) => {
    sculpture(props)
    return null
  },
}))

test('hidden chapter pauses the same heart and visibility resumes it', () => {
  const { container, unmount } = render(
    <PersistentHeart reducedMotion={false} progress={{ current: 0 }} enabled />,
  )
  const heart = container.firstElementChild!
  act(() =>
    heart.dispatchEvent(new CustomEvent('heartvisibility', { detail: false })),
  )
  expect(sculpture.mock.lastCall?.[0]).toMatchObject({
    reducedMotion: true,
    enabled: true,
  })
  act(() =>
    heart.dispatchEvent(new CustomEvent('heartvisibility', { detail: true })),
  )
  expect(sculpture.mock.lastCall?.[0]).toMatchObject({
    reducedMotion: false,
    enabled: true,
  })
  unmount()
  const calls = sculpture.mock.calls.length
  heart.dispatchEvent(new CustomEvent('heartvisibility', { detail: false }))
  expect(sculpture.mock.calls).toHaveLength(calls)
})
