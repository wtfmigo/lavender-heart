import { expect, test } from '@playwright/test'

test('heart keeps a stable drawing buffer while its chapter frame changes size', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1864, height: 968 })
  await page.goto('/')
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const initial = await canvas.evaluate((element: HTMLCanvasElement) => [
    element.width,
    element.height,
  ])
  for (const id of ['intro', 'story', 'gallery', 'finale', 'intro']) {
    await page.locator(`#${id}`).evaluate((element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: 'instant',
      }),
    )
    await page.waitForTimeout(500)
    await expect
      .poll(() =>
        canvas.evaluate((element: HTMLCanvasElement) => [
          element.width,
          element.height,
        ]),
      )
      .toEqual(initial)
    await expect(page.locator('canvas')).toHaveCount(1)
  }
})
