import { expect, test } from '@playwright/test'

for (const width of [1440, 1024, 390, 320]) {
  test(`heart states stay centered and recede for reading at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width, height: width < 1024 ? 844 : 900 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    const heart = page.locator('.persistent-heart')
    for (const id of [
      'intro',
      'story',
      'memory',
      'gallery',
      'love',
      'timeline',
      'letter',
      'finale',
      'letter',
      'gallery',
      'intro',
    ]) {
      await page.locator(`#${id}`).evaluate((element) =>
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: 'instant',
        }),
      )
      const hidden = ['memory', 'gallery', 'letter'].includes(id)
      const opacity = () =>
        heart.evaluate((element) => Number(getComputedStyle(element).opacity))
      if (id === 'intro') await expect.poll(opacity).toBeGreaterThan(0.3)
      else
        await expect
          .poll(opacity)
          .toBeCloseTo(
            hidden
              ? 0
              : id === 'finale'
                ? 1
                : id === 'intro'
                  ? 0.75
                  : id === 'story' && width < 1024
                    ? 0.45
                    : 0.55,
            1,
          )
      await expect
        .poll(() =>
          heart.evaluate((element) => {
            const box = element.getBoundingClientRect()
            return box.left + box.width / 2
          }),
        )
        .toBeCloseTo(width / 2, 0)
      if (!hidden && id !== 'finale') {
        await expect
          .poll(async () => (await heart.boundingBox())!.width)
          .toBeLessThanOrEqual(180)
        await expect
          .poll(async () => {
            const box = (await heart.boundingBox())!
            return box.y + box.height / 2
          })
          .toBeLessThan(230)
      }
      expect(await page.locator('canvas').count()).toBeLessThanOrEqual(1)
    }
    for (const selector of [
      '.timeline-content',
      '.love-entry',
      '.letter-body',
    ]) {
      await page
        .locator(selector)
        .first()
        .evaluate((element) =>
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY,
            behavior: 'instant',
          }),
        )
      await expect
        .poll(() =>
          heart.evaluate((element) =>
            Number(getComputedStyle(element).opacity),
          ),
        )
        .toBeCloseTo(0, 1)
    }
  })
}
