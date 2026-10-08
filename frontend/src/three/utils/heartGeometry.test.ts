import { expect, test } from 'vitest'
import { Vector3 } from 'three'
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

test('cut crystal has planar facets and a closed outward-facing surface', () => {
  const geometry = createHeartGeometry()
  const surface = geometry.index ? geometry.toNonIndexed() : geometry
  const position = surface.attributes.position
  const normal = surface.attributes.normal
  const edges = new Map<string, number>()
  let crownFaces = 0
  expect(position.count / 3).toBeLessThan(400)
  for (let index = 0; index < position.count; index += 3) {
    const vertices = [0, 1, 2].map((offset) =>
      new Vector3().fromBufferAttribute(position, index + offset),
    )
    const faceNormal = vertices[1]
      .clone()
      .sub(vertices[0])
      .cross(vertices[2].clone().sub(vertices[0]))
    expect(faceNormal.length()).toBeGreaterThan(0.0001)
    faceNormal.normalize()
    for (let offset = 0; offset < 3; offset++) {
      const vertexNormal = new Vector3().fromBufferAttribute(
        normal,
        index + offset,
      )
      expect(vertexNormal.dot(faceNormal)).toBeCloseTo(1, 5)
      const a = vertices[offset]
        .toArray()
        .map((value) => value.toFixed(5))
        .join(',')
      const b = vertices[(offset + 1) % 3]
        .toArray()
        .map((value) => value.toFixed(5))
        .join(',')
      const key = [a, b].sort().join('|')
      edges.set(key, (edges.get(key) ?? 0) + 1)
    }
    if (Math.abs(faceNormal.z) > 0.999) crownFaces++
    expect(faceNormal.dot(vertices[0])).toBeGreaterThan(0)
  }
  expect(crownFaces).toBe(0)
  expect([...edges.values()].every((count) => count === 2)).toBe(true)
  if (surface !== geometry) surface.dispose()
  geometry.dispose()
})
