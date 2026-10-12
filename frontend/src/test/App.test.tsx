import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { demoExperience } from '@/features/public/demoExperience'
import App from '@/app/App'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test('public route shows the experience instead of technical status', async () => {
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => demoExperience }),
  )
  render(<App />)
  const opener = await screen.findByRole(
    'button',
    {
      name: `Open letter for ${demoExperience.settings.recipientName}`,
    },
    { timeout: 5000 },
  )
  expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  fireEvent.click(opener)
  expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
  expect(
    await screen.findByRole('heading', { level: 1 }, { timeout: 5000 }),
  ).toHaveTextContent(demoExperience.settings.recipientName)
  expect(document.documentElement.style.overflow).not.toBe('hidden')
  expect(document.querySelector('.experience-content')).not.toHaveAttribute(
    'inert',
  )
  expect(
    screen.queryByText('Technical Foundation Ready'),
  ).not.toBeInTheDocument()
  expect(screen.queryByText('API: OK')).not.toBeInTheDocument()
})
