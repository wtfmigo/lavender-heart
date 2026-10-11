import { expect, test } from '@playwright/test'
import { readStoryPanel } from './storyPosition.js'

for (const [chapter, selector] of [
  ['story', '.story-spread:nth-child(3)'],
  ['gallery', '.photo-galaxy'],
  ['timeline', '.timeline-moment:nth-child(2)'],
  ['letter', '.letter-body'],
]) {
  test(`native orientation changes keep readers in ${chapter}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1180, height: 820 })
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    await page.evaluate(() => document.fonts.ready)
    const target = page.locator(selector)
    if (chapter === 'story') await readStoryPanel(page, 2)
    else
      await target.evaluate((element) =>
        element.scrollIntoView({ block: 'center', behavior: 'instant' }),
      )
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    )
    for (const viewport of [
      { width: 820, height: 1180 },
      { width: 1180, height: 820 },
    ]) {
      await page.setViewportSize(viewport)
      await expect(target).toBeInViewport({ ratio: 0.2 })
      await expect(page.locator('.pin-spacer')).toHaveCount(0)
    }
  })
}
