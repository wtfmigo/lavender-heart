import { expect, test } from '@playwright/test'

for (const width of [1440, 390]) {
  test(`native flow avoids empty cloud-only screens at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    for (const passage of await page.locator('.hero-cloud-passage').all()) {
      await expect(passage).toBeHidden()
    }
    await expect(page.locator('.cloud-layer--foreground img')).toBeVisible()
    await page.locator('#intro').scrollIntoViewIfNeeded()
    await expect(page.locator('#intro h2')).toBeInViewport()
  })
}
