import { act, renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

test('follows reduced-motion changes and unsubscribes on unmount', () => {
  let listener: (() => void) | undefined
  const media = {
    matches: false,
    addEventListener: vi.fn((_event, callback) => {
      listener = callback
    }),
    removeEventListener: vi.fn(),
  }
  vi.stubGlobal('matchMedia', () => media)
  const { result, unmount } = renderHook(useReducedMotion)
  expect(result.current).toBe(false)
  act(() => {
    media.matches = true
    listener?.()
  })
  expect(result.current).toBe(true)
  unmount()
  expect(media.removeEventListener).toHaveBeenCalledWith('change', listener)
  vi.unstubAllGlobals()
})
