import { expect, test } from 'vitest'
import { heartYaw } from './heartMotion'

test('the heart keeps its front silhouette through long scrolls and gentle idle motion', () => {
  for (let progress = -100; progress <= 100; progress += 0.25) {
    for (const time of [0, 10, 100, 1000]) {
      expect(Math.abs(heartYaw(progress, time))).toBeLessThanOrEqual(0.335)
    }
  }
})

test('reverse scroll restores the same pose and reduced motion stays still', () => {
  const first = heartYaw(2, 0)
  expect(heartYaw(20, 0)).not.toBe(first)
  expect(heartYaw(2, 0)).toBe(first)
  expect(heartYaw(20, 100, true)).toBe(-0.24)
  expect(heartYaw(0, 0, true)).toBe(-0.24)
})
