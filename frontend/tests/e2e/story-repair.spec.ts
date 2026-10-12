import { expect, test } from './experienceTest.js'
import content from '../../public/content/experience.json' with { type: 'json' }
import { readStoryPanel } from './storyPosition.js'

test('story keeps native flow through short and tall desktop resizes', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  for (const height of [900, 400, 900]) {
    await page.setViewportSize({ width: 1440, height })
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
    await expect(page.locator('.story-stage')).toHaveAttribute(
      'data-story-flow',
      /horizontal|vertical/,
    )
  }
})

for (const [width, height] of [
  [1440, 900],
  [1024, 768],
]) {
  test(`each story spread keeps its correct photo and message together forward and backward at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    const memories = [...content.story].sort((a, b) => a.position - b.position)
    const spreads = page.locator('.story-spread')
    await expect(spreads).toHaveCount(memories.length)
    for (const index of [
      ...memories.keys(),
      ...[...memories.keys()].reverse(),
    ]) {
      const spread = spreads.nth(index)
      await readStoryPanel(page, index)
      await expect(spread.locator('h3')).toHaveText(memories[index].title)
      await expect(spread.locator('h3')).toBeInViewport()
      if (memories[index].photo) {
        const image = spread.locator('img')
        await expect(image).toHaveAttribute('src', memories[index].photo!.src)
        await expect
          .poll(() =>
            image.evaluate(
              (e: HTMLImageElement) => e.complete && e.naturalWidth > 0,
            ),
          )
          .toBe(true)
        await expect(image).toBeInViewport({ ratio: 1 })
        await expect(spread.locator('.chapter-photo')).toHaveCSS('opacity', '1')
        const box = await image.boundingBox()
        expect(box!.y).toBeGreaterThanOrEqual(0)
        expect(box!.y + box!.height).toBeLessThanOrEqual(height + 1)
      } else await expect(spread.locator('img')).toHaveCount(0)
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false)
  })
}

for (const width of [390, 360, 320]) {
  test(`phone story keeps horizontal memories with intact media associations at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await expect(page.locator('.story-spread')).toHaveCount(
      content.story.length,
    )
    expect(
      await page
        .locator('.story-track')
        .evaluate((e) => getComputedStyle(e).display),
    ).toBe('flex')
    const spreads = await page.locator('.story-spread').all()
    for (const [index, spread] of spreads.entries()) {
      await readStoryPanel(page, index)
      await expect(spread.locator('h3')).toBeVisible()
      for (const image of await spread.locator('img').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect
          .poll(() =>
            image.evaluate(
              (e: HTMLImageElement) => e.complete && e.naturalWidth > 0,
            ),
          )
          .toBe(true)
      }
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false)
  })
}
