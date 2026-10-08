import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '@/app/App'

test('public route shows the experience instead of technical status', async () => {
  render(<App />)
  expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
    'Recipient Name',
  )
  expect(
    screen.queryByText('Technical Foundation Ready'),
  ).not.toBeInTheDocument()
  expect(screen.queryByText('API: OK')).not.toBeInTheDocument()
})
