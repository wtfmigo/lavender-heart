import { expect, test, type Locator } from '@playwright/test'

async function translation(element: Locator) {
  return element.evaluate((node) => getComputedStyle(node).translate)
}

test('the finale entrance begins when readers reach it', async ({ page }) => {
  await page.goto('/')
  const message = page.locator('.finale-message')
  await expect(message).toHaveCSS('animation-name', 'scroll-parallax')
  await message.scrollIntoViewIfNeeded()
  await expect(message).toHaveAttribute('data-entered', 'true')
  await expect
    .poll(() =>
      message.evaluate((node) =>
        node
          .getAnimations()
          .some(
            (animation) =>
              (animation as CSSAnimation).animationName === 'chapter-enter' &&
              animation.playState === 'running',
          ),
      ),
    )
    .toBe(true)
})

for (const [width, height] of [
  [1440, 900],
  [440, 956],
  [956, 440],
  [768, 1024],
  [1024, 768],
]) {
  test(`cloud and text parallax follows native scroll at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    const cloud = page.locator('.cloud-layer--foreground')
    const text = page.locator('.hero-type-travel')
    await expect(cloud).toHaveCSS('animation-name', 'scroll-parallax')
    await expect(cloud).toHaveCSS('translate', '0px')
    const cloudStart = await translation(cloud)
    const textStart = await translation(text)
    await page.mouse.wheel(0, height * 0.35)
    await expect.poll(() => translation(cloud)).not.toBe(cloudStart)
    await expect.poll(() => translation(text)).not.toBe(textStart)
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(() => translation(cloud)).toBe(cloudStart)
    const intro = page.locator('#intro')
    const top = await intro.evaluate(
      (node) => scrollY + node.getBoundingClientRect().top,
    )
    await page.evaluate(
      (top) => scrollTo({ top, behavior: 'instant' }),
      top - height * 0.4,
    )
    const introText = page.locator('.intro-message-wrap')
    const before = await translation(introText)
    await page.evaluate(
      (top) => scrollTo({ top, behavior: 'instant' }),
      top + height * 0.2,
    )
    await expect.poll(() => translation(introText)).not.toBe(before)
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .focus()
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .click()
    await expect(cloud).toHaveCSS('translate', 'none')
    await expect(introText).toHaveCSS('translate', 'none')
  })
}

test('parallax fallback scrolls only visible chapters without native timelines', async ({
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
  await page.setViewportSize({ width: 440, height: 956 })
  await page.goto('/')
  const cloud = page.locator('.cloud-layer--foreground')
  await expect.poll(() => translation(cloud)).not.toBe('none')
  const before = await translation(cloud)
  await page.mouse.wheel(0, 300)
  await expect.poll(() => translation(cloud)).not.toBe(before)
  const intro = page.locator('#intro')
  await intro.evaluate((node) =>
    scrollTo({
      top: scrollY + node.getBoundingClientRect().top + 100,
      behavior: 'instant',
    }),
  )
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
  const offscreen = await translation(cloud)
  const reading = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 200)
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(reading + 100)
  expect(await translation(cloud)).toBe(offscreen)
})
