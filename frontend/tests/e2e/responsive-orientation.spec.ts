import { expect, test } from '@playwright/test'

test('orientation changes keep the same story memory in pinned and vertical layouts', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1180, height: 820 })
  await page.goto('/')
  const stage = page.locator('.story-stage')
  await expect(stage.locator('..')).toHaveClass(/pin-spacer/)
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  const geometry = await stage.evaluate((element) => ({
    top: element.getBoundingClientRect().top + window.scrollY,
    width: element.clientWidth,
  }))
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    geometry.top + geometry.width * 2,
  )
  const memory = page.locator('.story-spread').nth(2)
  await expect
    .poll(() =>
      memory.evaluate((element) =>
        Math.abs(element.getBoundingClientRect().left),
      ),
    )
    .toBeLessThan(1)
  for (const viewport of [
    { width: 820, height: 1180 },
    { width: 1180, height: 820 },
  ]) {
    await page.setViewportSize(viewport)
    await expect
      .poll(
        () =>
          memory.evaluate((element) =>
            Math.abs(element.getBoundingClientRect().top),
          ),
        { timeout: 5000 },
      )
      .toBeLessThan(1)
    await expect(memory).toBeInViewport({ ratio: 0.9 })
  }
})

for (const chapter of ['gallery', 'letter']) {
  test(`orientation changes keep readers in ${chapter}`, async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 820 })
    await page.goto('/')
    await expect(page.locator('.story-stage').locator('..')).toHaveClass(
      /pin-spacer/,
    )
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    const target = page.locator(
      chapter === 'gallery' ? '.photo-galaxy' : '.letter-body',
    )
    await target.evaluate((element) =>
      element.scrollIntoView({ block: 'start', behavior: 'instant' }),
    )
    await expect(target).toBeInViewport({ ratio: 0.3 })
    const visibleChapter = () =>
      page.locator(`#${chapter}`).evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return (
          bounds.top < window.innerHeight * 0.5 &&
          bounds.bottom > window.innerHeight * 0.5
        )
      })
    await expect.poll(visibleChapter).toBe(true)
    for (const viewport of [
      { width: 820, height: 1180 },
      { width: 1180, height: 820 },
    ]) {
      await page.setViewportSize(viewport)
      await expect.poll(visibleChapter, { timeout: 5000 }).toBe(true)
      await expect(target).toBeInViewport({ ratio: 0.2 })
    }
  })
}
