import { expect, test } from './experienceTest.js'

for (const width of [1864, 1440, 768, 414, 390, 375, 320]) {
  test(`personal photos fit the restored editorial frames at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('#gallery .gallery-photo')).toHaveCount(20)
    await page
      .getByRole('button', { name: 'Show photo list', exact: true })
      .focus()
    await page
      .getByRole('button', { name: 'Show photo list', exact: true })
      .click()
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
      expect(['contain', 'cover']).toContain(
        await image.evaluate((img) => getComputedStyle(img).objectFit),
      )
      const box = await image.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(-1)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
    }
    const sources = await page
      .locator('img[src^="/photos/personal/"]:not(.gallery-lightbox img)')
      .evaluateAll((images) => images.map((image) => image.getAttribute('src')))
    expect(sources).toHaveLength(32)
    // The first-kiss photo remains in Story and Timeline; the favorite moved from Collection.
    expect(new Set(sources).size).toBe(31)
    const official = page.locator('.timeline-moment').nth(2)
    await expect(official.locator('img')).toHaveAttribute(
      'src',
      '/photos/personal/img_3772.jpg',
    )
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
