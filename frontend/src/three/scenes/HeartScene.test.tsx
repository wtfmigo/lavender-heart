import { render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import HeartScene from './HeartScene'

const canvas = vi.hoisted(() =>
  vi.fn<(props: Record<string, unknown>) => null>(() => null),
)
vi.mock('@react-three/fiber', () => ({
  Canvas: canvas,
  useFrame: vi.fn(),
  useThree: vi.fn(),
}))
vi.mock('@react-three/drei', () => ({
  Environment: vi.fn(),
  Lightformer: vi.fn(),
}))
afterEach(() => {
  vi.restoreAllMocks()
  canvas.mockClear()
})

it.each([320, 768, 844, 1023, 1024, 1344])(
  'bounds the render budget at %ipx without changing camera composition',
  (width) => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: width <= Number(query.match(/max-width: (\d+)/)?.[1]),
          addEventListener() {},
          removeEventListener() {},
        }) as unknown as MediaQueryList,
    )
    render(
      <HeartScene
        reducedMotion={false}
        active
        progress={{ current: 0 }}
        onReady={() => {}}
        onFailure={() => {}}
      />,
    )
    const props = canvas.mock.calls.at(-1)?.[0] as unknown as {
      dpr: number[]
      camera: { fov: number }
      children: ReactElement[]
    }
    expect(props.dpr).toEqual([1, 1.25])
    expect(props.camera.fov).toBe(32)
    expect(props.children[0].props).not.toHaveProperty('mobile')
    expect(props.children[0].props).not.toHaveProperty('lightweight')
  },
)
