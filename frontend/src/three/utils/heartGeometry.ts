import { BufferGeometry, Float32BufferAttribute, Shape } from 'three'

export function createHeartGeometry() {
  const shape = new Shape()
  shape.moveTo(0, 0.43)
  shape.bezierCurveTo(0.35, 1.02, 1.12, 0.94, 1.06, 0.25)
  shape.bezierCurveTo(1.04, -0.18, 0.43, -0.73, 0, -1.04)
  shape.bezierCurveTo(-0.43, -0.73, -1.04, -0.18, -1.06, 0.25)
  shape.bezierCurveTo(-1.12, 0.94, -0.35, 1.02, 0, 0.43)
  const outline = shape.getPoints(8).slice(0, -1)
  const positions: number[] = []
  const indices: number[] = []
  const rings = [
    [0.62, 0.42],
    [0.88, 0.28],
    [1, 0],
  ]
  const count = outline.length
  for (const side of [1, -1]) {
    const center = positions.length / 3
    positions.push(0, 0, 0.6 * side)
    const triangle = (a: number, b: number, c: number) => {
      indices.push(...(side === 1 ? [a, c, b] : [a, b, c]))
    }
    for (const [scale, depth] of rings) {
      for (const point of outline)
        positions.push(point.x * scale, point.y * scale, depth * side)
    }
    for (let index = 0; index < count; index++) {
      const next = (index + 1) % count
      triangle(center, center + 1 + index, center + 1 + next)
      for (let ring = 0; ring < rings.length - 1; ring++) {
        const inner = center + 1 + ring * count
        const outer = inner + count
        triangle(inner + index, outer + index, outer + next)
        triangle(inner + index, outer + next, inner + next)
      }
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  const faceted = geometry.toNonIndexed()
  geometry.dispose()
  faceted.center()
  faceted.computeVertexNormals()
  return faceted
}
