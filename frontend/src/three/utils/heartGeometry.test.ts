import { expect, test } from 'vitest'
import { createHeartGeometry } from './heartGeometry'

test('procedural sculpture has finite symmetric bounds, real depth and a heart cleft', () => {
  const geometry = createHeartGeometry()
  geometry.computeBoundingBox()
  const bounds = geometry.boundingBox!
  expect(bounds.min.x).toBeCloseTo(-bounds.max.x, 3)
  expect(bounds.max.y).toBeGreaterThan(0.8)
  expect(bounds.min.y).toBeLessThan(-0.8)
  expect(bounds.max.z - bounds.min.z).toBeGreaterThan(0.9)
  const position = geometry.attributes.position
  const centerLine: number[] = []
  for (let index = 0; index < position.count; index++) {
    if (Math.abs(position.getX(index)) < 0.005)
      centerLine.push(position.getY(index))
  }
  expect(Math.max(...centerLine)).toBeLessThan(bounds.max.y - 0.2)
  expect(
    Array.from(geometry.attributes.position.array).every(Number.isFinite),
  ).toBe(true)
  expect(
    Array.from(geometry.attributes.normal.array).every(Number.isFinite),
  ).toBe(true)
  geometry.dispose()
})
