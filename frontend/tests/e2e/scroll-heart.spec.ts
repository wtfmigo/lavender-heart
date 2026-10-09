import { expect, test } from '@playwright/test'

test('heart turns with scroll, stays still at rest, and reverses to the same pose', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible()
  const jump = async (offset: number) => {
    await page.locator('#intro').evaluate(
      (e, offset) =>
        window.scrollTo({
          top: e.getBoundingClientRect().top + window.scrollY + offset,
          behavior: 'instant',
        }),
      offset,
    )
    await page.waitForTimeout(1200)
  }
  await jump(0)
  const first = await canvas.screenshot()
  await page.waitForTimeout(700)
  expect((await canvas.screenshot()).equals(first), 'No idle rotation').toBe(
    true,
  )
  await jump(240)
  expect(
    (await canvas.screenshot()).equals(first),
    'Scroll changes the pose',
  ).toBe(false)
  await jump(0)
  expect(
    (await canvas.screenshot()).equals(first),
    'Reverse scroll restores the pose',
  ).toBe(true)
})
