import { expect, test } from '@playwright/test'

for (const width of [1440, 390]) {
  test(`owner-selected timeline captions and uniform normal-size frames at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const timeline = page.locator('#timeline')
    await expect(timeline.locator('.timeline-date time strong')).toHaveCount(0)
    for (const date of await timeline.locator('.timeline-date').all())
      await expect(date).not.toContainText('2025')
    const first = timeline.locator('.timeline-moment').first()
    await expect(first.locator('h3')).toHaveText(
      'One of my favorite photos of us.',
    )
    await expect(first.locator('img')).toHaveAttribute(
      'src',
      '/photos/personal/dsc03391.jpg',
    )
    await expect(
      page.locator('#gallery img[src="/photos/personal/dsc03391.jpg"]'),
    ).toHaveCount(0)
    const last = timeline.locator('.timeline-moment').last()
    await expect(last.locator('h3')).toHaveText(
      'So pretty, even through a screen.',
    )
    await expect(last.locator('img')).toHaveAttribute(
      'src',
      '/photos/personal/img_3772.jpg',
    )
    for (const image of await timeline.locator('img').all()) {
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          image.evaluate(
            (e: HTMLImageElement) => e.complete && e.naturalWidth > 0,
          ),
        )
        .toBe(true)
      expect((await image.boundingBox())!.height).toBeLessThanOrEqual(421)
      const imageBox = (await image.boundingBox())!
      const frameBox = (await image.locator('..').locator('..').boundingBox())!
      expect(frameBox.width - imageBox.width).toBeLessThanOrEqual(11)
      expect(
        Math.abs(imageBox.x + imageBox.width / 2 - width / 2),
      ).toBeLessThan(2)
    }
    const styles = await page
      .locator(
        '.story-spread .chapter-photo, .timeline-content .chapter-photo, .gallery-photo button',
      )
      .evaluateAll((elements) =>
        elements.map((e) => {
          const s = getComputedStyle(e)
          return [
            s.paddingTop,
            s.paddingRight,
            s.paddingBottom,
            s.paddingLeft,
            s.borderTopWidth,
            s.backgroundColor,
            s.borderTopColor,
          ].join('|')
        }),
      )
    expect(new Set(styles).size).toBe(1)
    expect(styles[0]).toMatch(/^4px\|4px\|4px\|4px\|1px\|/)
  })
}
