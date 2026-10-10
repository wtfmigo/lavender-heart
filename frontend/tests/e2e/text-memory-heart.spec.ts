import { expect, test } from '@playwright/test'

for (const width of [1440, 390]) {
  test(`text-only memories keep the supporting heart small at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    const memory = page.locator('.story-memory--text').first()
    const target = await memory.evaluate((element) => {
      const spread = element.closest('.story-spread')! as HTMLElement
      const stage = spread.closest('.story-stage')! as HTMLElement
      const track = spread.parentElement! as HTMLElement
      return (
        stage.getBoundingClientRect().top +
        window.scrollY +
        (stage.dataset.storyFlow === 'vertical' || window.innerWidth < 1024
          ? spread.getBoundingClientRect().top -
            stage.getBoundingClientRect().top
          : spread.offsetLeft - track.offsetLeft)
      )
    })
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      target,
    )
    const heart = page.locator('.persistent-heart')
    await expect
      .poll(() =>
        heart.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeLessThanOrEqual(140)
    if (width < 1024)
      await expect
        .poll(() =>
          heart.evaluate((element) =>
            Number(getComputedStyle(element).opacity),
          ),
        )
        .toBeCloseTo(0, 1)
    else {
      const box = (await heart.boundingBox())!
      const copy = (await memory.locator('.story-copy').boundingBox())!
      expect(box.y + box.height).toBeLessThan(copy.y)
    }
    await page
      .locator('.timeline-content--text')
      .last()
      .scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeCloseTo(0, 1)
  })
}
