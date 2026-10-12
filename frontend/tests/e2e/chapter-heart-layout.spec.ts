import { expect, test } from './experienceTest.js'
import { readStoryPanel } from './storyPosition.js'

for (const width of [1440, 1024, 390, 320]) {
  test(`the supporting heart stays small in Story and hides over chapter reading at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width < 1024 ? 844 : 900 })
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    const heart = page.locator('.persistent-heart')
    for (const selector of [
      '.story-copy',
      '.love-entry',
      '.timeline-content',
      '.letter-body',
    ]) {
      const copy = page.locator(selector).first()
      if (selector === '.story-copy') await readStoryPanel(page, 0)
      else await copy.scrollIntoViewIfNeeded()
      await expect(copy).toBeVisible()
      if (selector === '.story-copy') {
        await expect
          .poll(() =>
            heart.evaluate((element) =>
              Number(getComputedStyle(element).opacity),
            ),
          )
          .toBeCloseTo(0.55, 2)
        await expect
          .poll(() =>
            heart.evaluate((element) => element.getBoundingClientRect().width),
          )
          .toBeLessThanOrEqual(160)
      } else {
        await expect
          .poll(() =>
            heart.evaluate((element) =>
              Number(getComputedStyle(element).opacity),
            ),
          )
          .toBeLessThan(0.05)
      }
      expect(await page.locator('canvas').count()).toBeLessThanOrEqual(1)
    }
  })
}
