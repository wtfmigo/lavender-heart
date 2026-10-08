import { expect, test } from '@playwright/test'

test('public experience renders, styles load, and Laravel health remains intact', async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Recipient Name', level: 1 }),
  ).toBeVisible()
  await expect(page.getByText('Technical Foundation Ready')).toHaveCount(0)
  await expect(page.locator('.opening')).toBeHidden({ timeout: 5000 })
  await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
    timeout: 15000,
  })
  expect(
    await (await request.get('http://127.0.0.1:8001/api/health')).json(),
  ).toEqual({ status: 'ok' })
  await expect(page.locator('body')).toHaveCSS(
    'font-family',
    'Inter, system-ui, sans-serif',
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
