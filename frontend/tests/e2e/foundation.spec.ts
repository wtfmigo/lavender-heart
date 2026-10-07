import { expect, test } from '@playwright/test'

test('frontend renders, styles load, and Laravel is reachable', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Lavender Heart' }),
  ).toBeVisible()
  await expect(page.getByText('Technical Foundation Ready')).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('API: OK')
  await expect(page.locator('main')).toHaveCSS('padding-top', '24px')
  await expect(page.locator('body')).toHaveCSS(
    'font-family',
    'system-ui, sans-serif',
  )
  expect(errors).toEqual([])
})

test('development route renders the R3F primitive', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/__smoke/three')
  await expect(
    page.getByRole('heading', { name: 'WebGL smoke test' }),
  ).toBeVisible()
  await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible()
  expect(errors).toEqual([])
})

test('development scene falls back when WebGL is unavailable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null
  })
  await page.goto('/__smoke/three')
  await expect(page.getByText('WebGL unavailable')).toBeVisible()
})
