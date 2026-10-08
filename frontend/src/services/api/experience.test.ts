import { afterEach, expect, test, vi } from 'vitest'
import content from '../../../public/content/experience.json'
import { getExperience } from './experience'

vi.mock('@/services/http/client', () => ({
  apiBaseUrl: 'http://127.0.0.1:8001/api/',
}))
afterEach(() => vi.unstubAllGlobals())

test('valid API content resolves relative media against the configured API origin', async () => {
  const data = structuredClone(content)
  data.gallery[0].src = '/api/media/asset'
  const fetcher = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => data })
  vi.stubGlobal('fetch', fetcher)
  const result = await getExperience(new AbortController().signal)
  expect(fetcher.mock.calls[0][0]).toBe('http://127.0.0.1:8001/api/experience')
  expect(result.gallery[0].src).toBe('http://127.0.0.1:8001/api/media/asset')
})

test.each(['unavailable', 'invalid'])(
  'the birthday content survives an %s API',
  async (failure) => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        failure === 'unavailable'
          ? { ok: false }
          : { ok: true, json: async () => ({ settings: 'invalid' }) },
      )
      .mockResolvedValueOnce({ ok: true, json: async () => content })
    vi.stubGlobal('fetch', fetcher)
    expect(
      (await getExperience(new AbortController().signal)).sections,
    ).toHaveLength(9)
    expect(fetcher.mock.calls[1][0]).toBe('/content/experience.json')
  },
)

test('invalid local content is rejected and cancellation does not start a fallback', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  await expect(getExperience(new AbortController().signal)).rejects.toThrow()
  const controller = new AbortController()
  controller.abort()
  const fetcher = vi.fn().mockRejectedValue(new Error('Cancelled'))
  vi.stubGlobal('fetch', fetcher)
  await expect(getExperience(controller.signal)).rejects.toThrow('Cancelled')
  expect(fetcher).toHaveBeenCalledOnce()
})
