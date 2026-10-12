import { expect, test, type Locator } from './experienceTest.js'

async function translation(element: Locator) {
  return element.evaluate(
    (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m42,
  )
}

test('the finale entrance reveals with scroll and returns when readers leave it', async ({
  page,
}) => {
  await page.goto('/')
  const message = page.locator('.finale-message')
  await expect(message).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const before = await message.evaluate((node) =>
    Number(getComputedStyle(node).opacity),
  )
  expect(before).toBeLessThan(0.2)
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  )
  await expect
    .poll(() =>
      message.evaluate((node) => Number(getComputedStyle(node).opacity)),
    )
    .toBeGreaterThan(0.99)
  await expect.poll(() => translation(message)).toBeCloseTo(0, 1)
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await expect
    .poll(() =>
      message.evaluate((node) => Number(getComputedStyle(node).opacity)),
    )
    .toBeCloseTo(before, 1)
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
    await expect(cloud).toBeAttached()
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await expect.poll(() => translation(cloud)).toBeCloseTo(0, 1)
    const cloudStart = await translation(cloud)
    const textStart = await translation(text)
    const scaleStart = await cloud.evaluate(
      (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m11,
    )
    const maskStart = await text.evaluate(
      (node) => getComputedStyle(node).clipPath,
    )
    await page.mouse.wheel(0, height * 0.35)
    await expect.poll(() => translation(cloud)).not.toBe(cloudStart)
    await expect.poll(() => translation(text)).not.toBe(textStart)
    await expect
      .poll(() =>
        cloud.evaluate(
          (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m11,
        ),
      )
      .toBeGreaterThan(scaleStart)
    await expect
      .poll(() => text.evaluate((node) => getComputedStyle(node).clipPath))
      .not.toBe(maskStart)
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(() => translation(cloud)).toBeCloseTo(cloudStart, 1)
    await expect.poll(() => translation(text)).toBeCloseTo(textStart, 1)
    const intro = page.locator('#intro')
    const top = await intro.evaluate(
      (node) => scrollY + node.getBoundingClientRect().top,
    )
    await page.evaluate(
      (top) => scrollTo({ top, behavior: 'instant' }),
      top - height * 1.2,
    )
    const introText = page.locator('.intro-message-wrap')
    await expect.poll(() => translation(introText)).toBeCloseTo(55, 1)
    await page.evaluate(
      (top) => scrollTo({ top, behavior: 'instant' }),
      top + height * 0.2,
    )
    await expect.poll(() => translation(introText)).toBeCloseTo(0, 1)
    await page.evaluate(
      (top) => scrollTo({ top, behavior: 'instant' }),
      top - height * 1.2,
    )
    await expect.poll(() => translation(introText)).toBeCloseTo(55, 1)
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .focus()
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .click()
    await expect(cloud).toHaveCSS('transform', 'none')
    await expect(introText).toHaveCSS('transform', 'none')
  })
}

test('GSAP parallax works without native animation timelines and stops at its scroll endpoint', async ({
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
  await expect(cloud).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await expect.poll(() => translation(cloud)).toBeCloseTo(0, 1)
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
  await page.waitForTimeout(1000)
  const offscreen = await translation(cloud)
  const reading = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 200)
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(reading + 100)
  await expect.poll(() => translation(cloud)).toBeCloseTo(offscreen, 1)
})
