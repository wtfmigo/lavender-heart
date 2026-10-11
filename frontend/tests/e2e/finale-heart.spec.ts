import { expect, test } from '@playwright/test'

for (const width of [1864, 390]) {
  test(`native finale heart stays above the message at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 968 })
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    const space = page.locator('.finale-heart-space')
    const heart = page.locator('.finale-static-heart')
    for (const height of [968, 844]) {
      await page.setViewportSize({ width, height })
      await page.locator('#finale').scrollIntoViewIfNeeded()
      await expect(heart.locator('svg')).toBeVisible()
      const frame = (await heart.boundingBox())!
      const reserved = (await space.boundingBox())!
      const copy = (await page.locator('.finale-message').boundingBox())!
      expect(frame.y).toBeGreaterThanOrEqual(reserved.y - 2)
      expect(frame.y + frame.height).toBeLessThanOrEqual(
        reserved.y + reserved.height + 2,
      )
      expect(frame.y + frame.height).toBeLessThan(copy.y)
    }
  })
}
