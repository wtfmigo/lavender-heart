import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { demoExperience } from '@/features/public/demoExperience'
import App from '@/app/App'

afterEach(() => vi.unstubAllGlobals())

test('public route shows the experience instead of technical status', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => demoExperience }),
  )
  render(<App />)
  expect(
    await screen.findByRole('heading', { level: 1 }, { timeout: 5000 }),
  ).toHaveTextContent('Recipient Name')
  expect(
    screen.queryByText('Technical Foundation Ready'),
  ).not.toBeInTheDocument()
  expect(screen.queryByText('API: OK')).not.toBeInTheDocument()
})
