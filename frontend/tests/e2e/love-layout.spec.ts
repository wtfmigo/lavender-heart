import { expect, test } from '@playwright/test'

for (const [width, height] of [
  [1440, 900],
  [390, 844],
  [844, 390],
  [768, 1024],
  [1024, 768],
]) {
  test(`Love has reversible layered motion and readable copy at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    const stage = page.locator('.love-stage')
    await expect(stage).toHaveAttribute('data-love-flow', 'staged')
    const top = await stage.evaluate(
      (element) => element.getBoundingClientRect().top + scrollY,
    )
    const budget = await page
      .locator('.love-window')
      .evaluate((element) => element.clientHeight)
    const progress = page.locator('.love-progress-fill')
    const number = page.locator('.love-entry').nth(1).locator('.love-number')
    const sample = async (position: number) => {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: 'instant' }),
        position,
      )
      await page.waitForTimeout(750)
      return {
        fill: await progress.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m11,
        ),
        number: await number.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m41,
        ),
      }
    }
    const before = await sample(top)
    const reading = await sample(top + budget)
    expect(reading.fill).toBeGreaterThan(before.fill + 0.2)
    expect(Math.abs(reading.number - before.number)).toBeGreaterThan(10)
    const heading = page.locator('.love-entry').nth(1).locator('h3')
    await expect(heading).toBeInViewport()
    const bounds = await heading.boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height)
    const back = await sample(top)
    expect(back.fill).toBeCloseTo(before.fill, 1)
    expect(back.number).toBeCloseTo(before.number, 0)
    await sample(top + budget)
    await page.screenshot({ path: `test-results/love-${width}-${height}.png` })
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .focus()
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .click()
    await expect(stage).toHaveAttribute('data-love-flow', 'vertical')
    await expect(heading).toBeVisible()
    await expect(heading.locator('.love-word').first()).toHaveCSS(
      'transform',
      'none',
    )
    await expect(progress).toBeHidden()
    expect(errors).toEqual([])
  })
}

test('reduced motion keeps every Love statement readable without staging', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.love-stage')).toHaveAttribute(
    'data-love-flow',
    'vertical',
  )
  const headings = page.locator('.love-entry h3')
  for (const heading of await headings.all()) {
    await heading.scrollIntoViewIfNeeded()
    await expect(heading).toBeInViewport()
    await expect(heading.locator('.love-word').first()).toHaveCSS(
      'transform',
      'none',
    )
  }
})
