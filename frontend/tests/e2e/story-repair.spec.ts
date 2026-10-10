import { expect, test } from '@playwright/test'
import content from '../../public/content/experience.json' with { type: 'json' }

test('story restores its single horizontal owner after a short viewport returns to desktop height', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const stage = page.locator('.story-stage')
  await expect(stage).not.toHaveAttribute('data-story-flow', 'vertical')
  await page.setViewportSize({ width: 1440, height: 400 })
  await expect(stage).toHaveAttribute('data-story-flow', 'vertical')
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(stage).not.toHaveAttribute('data-story-flow', 'vertical')
  await expect(stage.locator('..')).toHaveClass(/pin-spacer/)
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
    const stage = page.locator('.story-stage')
    await expect(stage).not.toHaveAttribute('data-story-flow', 'vertical')
    const memories = [...content.story].sort((a, b) => a.position - b.position)
    const spreads = page.locator('.story-spread')
    await expect(spreads).toHaveCount(memories.length)
    const geometry = await stage.evaluate((e) => ({
      start: e.getBoundingClientRect().top + window.scrollY,
      travel: e.querySelector('.story-track')!.scrollWidth - e.clientWidth,
    }))
    expect(geometry.travel).toBe(width * (memories.length - 1))
    for (const index of [
      ...memories.keys(),
      ...[...memories.keys()].reverse(),
    ]) {
      await page.evaluate(
        (top) => window.scrollTo({ top, behavior: 'instant' }),
        geometry.start + index * width,
      )
      const spread = spreads.nth(index)
      await expect
        .poll(() =>
          spread.evaluate((e) => Math.round(e.getBoundingClientRect().left)),
        )
        .toBe(0)
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
    await page.mouse.wheel(0, geometry.travel)
    await expect(spreads.last()).toBeInViewport()
    await page.mouse.wheel(0, -geometry.travel)
    await expect(spreads.first()).toBeInViewport()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false)
  })
}

for (const width of [390, 360, 320]) {
  test(`phone story is vertical with intact media associations at ${width}px`, async ({
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
    ).toBe('block')
    for (const spread of await page.locator('.story-spread').all()) {
      await spread.scrollIntoViewIfNeeded()
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
