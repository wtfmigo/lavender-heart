import { expect, test } from '@playwright/test'

for (const width of [1440, 768, 390]) {
  test(`personal photos preserve full frames at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('#gallery .gallery-photo')).toHaveCount(27)
    for (const image of await page
      .locator('img[src^="/photos/personal/"]:not(.gallery-lightbox img)')
      .all()) {
      await image.scrollIntoViewIfNeeded()
      await expect(image).toBeVisible()
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true)
      expect(
        await image.evaluate((img) => getComputedStyle(img).objectFit),
      ).toBe('contain')
      const box = await image.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(-1)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
    }
    const official = page.locator('.timeline-moment').nth(2)
    await expect(official.locator('img')).toHaveCount(0)
    await expect(official.locator('time')).toHaveAttribute(
      'datetime',
      '2025-07-17',
    )
    for (const [name, selector] of [
      ['memory', '#memory'],
      ['gallery', '.collection-spread--moments'],
      ['details', '.collection-details'],
      ['timeline', '.timeline-content'],
    ]) {
      const section = page.locator(selector).first()
      await section.scrollIntoViewIfNeeded()
      await section.screenshot({
        path: `test-results/personal-${width}-${name}.png`,
      })
    }
  })
}
