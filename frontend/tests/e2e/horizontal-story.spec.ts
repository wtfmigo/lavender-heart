import { expect, test } from './experienceTest.js'
for (const [width, height] of [
  [1440, 900],
  [440, 956],
  [956, 440],
  [768, 1024],
  [1024, 768],
]) {
  test(`vertical native scrolling drives horizontal memories at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    const stage = page.locator('.story-stage')
    await expect(stage).toHaveAttribute('data-story-flow', 'horizontal')
    await page.evaluate(() => document.fonts.ready)
    const top = await stage.evaluate(
      (element) => scrollY + element.getBoundingClientRect().top,
    )
    const panels = page.locator('.story-spread')
    for (const index of [0, 1, 3, 7, 3, 0]) {
      await page.evaluate(
        (top) => window.scrollTo({ top, behavior: 'instant' }),
        top + index * width,
      )
      await expect
        .poll(() =>
          panels
            .nth(index)
            .evaluate((element) =>
              Math.abs(element.getBoundingClientRect().left),
            ),
        )
        .toBeLessThan(3)
      await expect(panels.nth(index).locator('h3')).toBeInViewport()
    }
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
    await page.evaluate(() =>
      window.addEventListener(
        'wheel',
        (event) =>
          (document.body.dataset.wheelPrevented = String(
            event.defaultPrevented,
          )),
      ),
    )
    await page.mouse.move(width / 2, height / 2)
    await page.mouse.wheel(0, width)
    await expect(page.locator('body')).toHaveAttribute(
      'data-wheel-prevented',
      'false',
    )
    await expect
      .poll(() =>
        panels
          .first()
          .evaluate((element) => element.getBoundingClientRect().left),
      )
      .toBeLessThan(-width * 0.8)
  })
}

test('horizontal story fallback works without CSS scroll timelines', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = CSS.supports.bind(CSS)
    CSS.supports = ((property: string, value?: string) =>
      property === 'animation-timeline'
        ? false
        : value === undefined
          ? original(property)
          : original(property, value)) as typeof CSS.supports
  })
  await page.goto('/')
  const stage = page.locator('.story-stage')
  await expect(stage).toHaveAttribute('data-story-flow', 'horizontal')
  const top = await stage.evaluate(
    (element) => scrollY + element.getBoundingClientRect().top,
  )
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    top + 2 * 1280,
  )
  await expect
    .poll(() =>
      page
        .locator('.story-spread')
        .nth(2)
        .evaluate((element) => Math.abs(element.getBoundingClientRect().left)),
    )
    .toBeLessThan(3)
})

test('portrait story frames follow the actual photo proportions on a phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 440, height: 956 })
  await page.goto('/')
  const stage = page.locator('.story-stage')
  await expect(stage).toHaveAttribute('data-story-flow', 'horizontal')
  await stage.evaluate((element) =>
    window.scrollTo({
      top: scrollY + element.getBoundingClientRect().top,
      behavior: 'instant',
    }),
  )
  const image = page.locator('.story-spread').first().locator('img')
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true)
  const ratios = await image.evaluate((element: HTMLImageElement) => {
    const rect = element.getBoundingClientRect()
    return {
      actual: rect.width / rect.height,
      photo: element.naturalWidth / element.naturalHeight,
    }
  })
  expect(ratios.actual).toBeCloseTo(ratios.photo, 1)
})
