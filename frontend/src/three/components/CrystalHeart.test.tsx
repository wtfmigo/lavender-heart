import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CrystalHeart } from './CrystalHeart'

test('WebGL absence leaves an original visible heart fallback', () => {
  render(<CrystalHeart reducedMotion progress={{ current: 0 }} />)
  expect(screen.getByTestId('heart-fallback')).toBeInTheDocument()
  expect(screen.getByTestId('heart-fallback').querySelector('svg')).toBeTruthy()
})
