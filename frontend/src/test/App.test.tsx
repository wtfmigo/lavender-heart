import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '@/app/App'

test('renders the technical foundation placeholder', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Lavender Heart' })).toBeVisible()
  expect(screen.getByText('Technical Foundation Ready')).toBeVisible()
})
