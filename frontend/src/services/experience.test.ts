import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import content from '../../public/content/experience.json'

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('VITE_API_BASE_URL', 'http://127.0.0.1:8001/api/')
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

test('loads validated local content directly even with stale API configuration', async () => {
  const { getExperience } = await import('./experience')
  const signal = new AbortController().signal
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => content,
  })
  vi.stubGlobal('fetch', fetcher)
  const result = await getExperience(signal)
  expect(result.sections).toHaveLength(9)
  expect(result.gallery[0].src).toBe(content.gallery[0].src)
  expect(fetcher).toHaveBeenCalledExactlyOnceWith('/content/experience.json', {
    signal,
    cache: 'no-store',
  })
})

test('reports unavailable local content without trying another server', async () => {
  const { getExperience } = await import('./experience')
  const fetcher = vi.fn().mockResolvedValue({ ok: false })
  vi.stubGlobal('fetch', fetcher)
  await expect(getExperience(new AbortController().signal)).rejects.toThrow(
    'Content unavailable',
  )
  expect(fetcher).toHaveBeenCalledOnce()
})

test('rejects invalid local content before rendering', async () => {
  const { getExperience } = await import('./experience')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ settings: 'invalid' }),
    }),
  )
  await expect(getExperience(new AbortController().signal)).rejects.toThrow()
})

test('aborts a pending local request without a fallback request', async () => {
  const { getExperience } = await import('./experience')
  const controller = new AbortController()
  const fetcher = vi.fn(
    (_url: string, { signal }: { signal: AbortSignal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () =>
          reject(new DOMException('Cancelled', 'AbortError')),
        )
      }),
  )
  vi.stubGlobal('fetch', fetcher)
  const pending = getExperience(controller.signal)
  controller.abort()
  await expect(pending).rejects.toThrow('Cancelled')
  expect(fetcher).toHaveBeenCalledOnce()
})
