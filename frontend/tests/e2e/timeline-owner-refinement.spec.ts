import { expect, test } from './experienceTest.js'

for (const [width, height] of [
  [1440, 1000],
  [390, 844],
  [820, 1180],
  [844, 390],
  [1180, 820],
  [320, 740],
]) {
  test(`timeline preserves owner content and alternating photo/caption spreads at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
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
      expect((await image.boundingBox())!.height).toBeLessThanOrEqual(491)
      const imageBox = (await image.boundingBox())!
      const frameBox = (await image.locator('..').locator('..').boundingBox())!
      expect(frameBox.width - imageBox.width).toBeLessThanOrEqual(11)
      expect(imageBox.x).toBeGreaterThanOrEqual(0)
      expect(imageBox.x + imageBox.width).toBeLessThanOrEqual(width)
      const ratio = await image.evaluate(
        (img: HTMLImageElement) => img.naturalWidth / img.naturalHeight,
      )
      expect(imageBox.width / imageBox.height).toBeCloseTo(ratio, 2)
    }
    for (const [index, moment] of (
      await timeline.locator('.timeline-moment').all()
    ).entries()) {
      const photo = (await moment.locator('.chapter-photo').boundingBox())!
      const copy = (await moment.locator('.timeline-copy').boundingBox())!
      expect(
        index % 2 === 0
          ? photo.x + photo.width <= copy.x
          : copy.x + copy.width <= photo.x,
      ).toBe(true)
      expect(copy.x).toBeGreaterThanOrEqual(0)
      expect(copy.x + copy.width).toBeLessThanOrEqual(width)
      await expect(moment.locator('.timeline-copy .timeline-date')).toHaveCount(
        1,
      )
    }
    await expect(
      timeline.locator('.timeline-moment').nth(1).locator('h3'),
    ).toHaveText("An evening I'll always remember")
    expect(
      await timeline
        .locator('.timeline-copy p')
        .first()
        .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
    ).toBeGreaterThanOrEqual(16)
    const contrasts = await timeline
      .locator('.timeline-date, .timeline-copy p')
      .evaluateAll((elements) => {
        const luminance = (rgb: number[]) =>
          rgb
            .map((value) => {
              const channel = value / 255
              return channel <= 0.04045
                ? channel / 12.92
                : ((channel + 0.055) / 1.055) ** 2.4
            })
            .reduce(
              (sum, channel, index) =>
                sum + channel * [0.2126, 0.7152, 0.0722][index],
              0,
            )
        const root = getComputedStyle(document.documentElement)
        const surfaces = ['--color-lilac', '--color-purple-dusty'].map(
          (variable) =>
            luminance(
              root
                .getPropertyValue(variable)
                .trim()
                .slice(1)
                .match(/../g)!
                .map((hex) => parseInt(hex, 16)),
            ),
        )
        return elements.flatMap((element) => {
          const text = luminance(
            getComputedStyle(element)
              .color.match(/[\d.]+/g)!
              .slice(0, 3)
              .map(Number),
          )
          return surfaces.map(
            (surface) =>
              (Math.max(text, surface) + 0.05) /
              (Math.min(text, surface) + 0.05),
          )
        })
      })
    expect(Math.min(...contrasts)).toBeGreaterThanOrEqual(4.5)
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

for (const width of [1440, 320]) {
  test(`timeline handles missing photos, omitted dates, and long supplied text at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('**/content/experience.json', async (route) => {
      const response = await route.fetch()
      const data = await response.json()
      data.timeline[0] = {
        ...data.timeline[0],
        date: null,
        photo: null,
        title: 'Synthetic long title for layout verification '.repeat(5),
        message: {
          blocks: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'SyntheticLongWord'.repeat(15) },
              ],
            },
          ],
        },
      }
      data.timeline[1].date = null
      data.timeline[1].dateLabel = 'SyntheticLongDateLabel'.repeat(5)
      await route.fulfill({ response, json: data })
    })
    await page.goto('/')
    const timeline = page.locator('#timeline')
    const first = timeline.locator('.timeline-moment').first()
    await expect(first.locator('.timeline-date')).toHaveCount(0)
    await expect(first.locator('img')).toHaveCount(0)
    await expect(first.locator('h3')).toContainText('Synthetic long title')
    for (const element of await timeline
      .locator(
        '.timeline-copy, .timeline-date, .timeline-copy h3, .timeline-copy p',
      )
      .all()) {
      const bounds = (await element.boundingBox())!
      expect(bounds.x).toBeGreaterThanOrEqual(0)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width)
      expect(
        await element.evaluate(
          (node) => node.scrollWidth <= node.clientWidth + 1,
        ),
      ).toBe(true)
    }
    const copy = (await first.locator('.timeline-copy').boundingBox())!
    const next = (await timeline
      .locator('.timeline-moment')
      .nth(1)
      .boundingBox())!
    expect(copy.y + copy.height).toBeLessThan(next.y)
  })
}
