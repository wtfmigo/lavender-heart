import { expect, test } from 'vitest'
import { heartYaw } from './heartMotion'

test('the heart makes one horizontal turn per chapter and bounds progress to the journey', () => {
  for (let progress = -100; progress <= 100; progress += 0.25) {
    for (const time of [0, 10, 100, 1000]) {
      expect(heartYaw(progress, time)).toBeGreaterThanOrEqual(-0.252)
      expect(heartYaw(progress, time)).toBeLessThanOrEqual(
        8 * Math.PI * 2 - 0.228,
      )
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

test('scrolling turns the heart through its side and back rather than a small rocking angle', () => {
  expect(heartYaw(0, 0)).toBeCloseTo(-0.24)
  expect(heartYaw(0.25, 0) - heartYaw(0, 0)).toBeCloseTo(Math.PI / 2)
  expect(heartYaw(0.5, 0) - heartYaw(0, 0)).toBeCloseTo(Math.PI)
  expect(heartYaw(1, 0) - heartYaw(0, 0)).toBeCloseTo(Math.PI * 2)
  expect(heartYaw(8, 0)).toBeCloseTo(8 * Math.PI * 2 - 0.24)
  expect(heartYaw(100, 0)).toBe(heartYaw(8, 0))
  expect(heartYaw(-100, 0)).toBe(heartYaw(0, 0))
})

test('chapter interpolation remains smooth and reversible through the Story', () => {
  const poses = [2, 2.25, 2.5, 2.75, 3].map((progress) => heartYaw(progress, 0))
  expect(
    poses.every((pose, index) => index === 0 || pose > poses[index - 1]),
  ).toBe(true)
  expect(heartYaw(2.5, 0)).toBeCloseTo((poses[0] + poses[4]) / 2)
  expect(Math.abs(heartYaw(2.001, 0) - poses[0])).toBeLessThan(0.007)
  expect(Math.abs(heartYaw(2.999, 0) - poses[4])).toBeLessThan(0.007)
})
