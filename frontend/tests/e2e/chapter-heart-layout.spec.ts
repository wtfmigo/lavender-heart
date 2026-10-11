import { expect, test } from '@playwright/test'

for (const width of [1440, 1024, 390, 320]) {
  test(`hero heart scrolls away from chapter reading at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width < 1024 ? 844 : 900 })
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    for (const selector of [
      '.story-copy',
      '.love-entry',
      '.timeline-content',
      '.letter-body',
    ]) {
      const copy = page.locator(selector).first()
      await copy.scrollIntoViewIfNeeded()
      await expect(copy).toBeVisible()
      await expect(page.locator('.persistent-heart')).not.toBeInViewport()
      expect(await page.locator('canvas').count()).toBeLessThanOrEqual(1)
    }
  })
}
