import { expect, test } from './experienceTest.js'

test.use({ hasTouch: true })

for (const [width, height] of [
  [1440, 900],
  [390, 844],
  [844, 390],
  [768, 1024],
  [1024, 768],
]) {
  test(
    'Love surprise messages reveal independently at ' + width + 'x' + height,
    async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await expect(page.locator('#finale')).toBeAttached()
      await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
      await expect(page.locator('.love-progress')).toHaveCount(0)
      await page.getByRole('link', { name: 'Discover your messages' }).click()
      const stage = page.locator('.love-stage')
      await expect(stage).toHaveAttribute('data-love-flow', 'staged')
      const top = await stage.evaluate(
        (element) => element.getBoundingClientRect().top + scrollY,
      )
      const budget = await page
        .locator('.love-window')
        .evaluate((element) => element.clientHeight)
      const entries = page.locator('.love-entry')
      for (let index = 0; index < (await entries.count()); index++) {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: 'instant' }),
          top + budget * index,
        )
        await page.waitForTimeout(600)
        const entry = entries.nth(index)
        const button = entry.getByRole('button', {
          name: 'Reveal message ' + (index + 1),
        })
        const heading = entry.locator('h3')
        await expect(heading).toBeHidden()
        await expect(button).toBeInViewport()
        await page.screenshot({
          path: 'test-results/surprise-closed-' + width + '-' + index + '.png',
        })
        if (index === 0) {
          await button.focus()
          await page.keyboard.press('Enter')
        } else if (width < 600) await button.tap()
        else await button.click()
        const region = entry.getByRole('region')
        await expect(region).toBeFocused()
        await expect(region).toHaveAttribute('aria-hidden', 'false')
        await expect
          .poll(() =>
            region.evaluate((element) =>
              Number(getComputedStyle(element).opacity),
            ),
          )
          .toBe(1)
        await expect(heading).toBeInViewport()
        await expect
          .poll(() =>
            heading
              .locator('.love-word')
              .last()
              .evaluate(
                (element) =>
                  new DOMMatrixReadOnly(getComputedStyle(element).transform)
                    .m42,
              ),
          )
          .toBeCloseTo(0, 0)
        const bounds = await heading.boundingBox()
        expect(bounds!.x).toBeGreaterThanOrEqual(0)
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
        expect(bounds!.y).toBeGreaterThanOrEqual(0)
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height)
        await page.screenshot({
          path: 'test-results/surprise-open-' + width + '-' + index + '.png',
        })
      }
      await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), top)
      await expect(entries.first().getByRole('region')).toBeInViewport()
      await expect(entries.first().locator('.love-note')).toHaveAttribute(
        'data-open',
        'true',
      )
      const pause = page.getByRole('button', {
        name: 'Pause motion',
        exact: true,
      })
      await pause.focus()
      await pause.click()
      await expect(stage).toHaveAttribute('data-love-flow', 'vertical')
      await expect(entries.first().locator('.love-word').first()).toHaveCSS(
        'animation-name',
        'none',
      )
      await page
        .getByRole('button', { name: 'Resume motion', exact: true })
        .click()
      await expect(entries.first().locator('.love-note')).toHaveAttribute(
        'data-open',
        'true',
      )
      expect(errors).toEqual([])
    },
  )
}

test('reduced motion opens surprise messages immediately using Space', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const stage = page.locator('.love-stage')
  await expect(stage).toHaveAttribute('data-love-flow', 'vertical')
  const entries = page.locator('.love-entry')
  for (const entry of await entries.all()) {
    const button = entry.getByRole('button')
    await button.scrollIntoViewIfNeeded()
    await button.focus()
    await page.keyboard.press('Space')
    const region = entry.getByRole('region')
    await expect(region).toBeFocused()
    await expect(region).toHaveCSS('opacity', '1')
    await expect(entry.locator('.love-word').first()).toHaveCSS(
      'animation-name',
      'none',
    )
    await expect(entry.locator('.love-cover')).toHaveCSS(
      'transition-duration',
      '0s',
    )
  }
})

test('Pause and live reduced motion finish an in-flight message without replaying it', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const stage = page.locator('.love-stage')
  await stage.evaluate((element) =>
    scrollTo({
      top: element.getBoundingClientRect().top + scrollY,
      behavior: 'instant',
    }),
  )
  await page.waitForTimeout(650)
  const entry = page.locator('.love-entry').first()
  await entry.getByRole('button').click()
  const pause = page.getByRole('button', { name: 'Pause motion', exact: true })
  await pause.focus()
  await pause.click()
  const word = entry.locator('.love-word').last()
  await expect(entry.locator('.love-note')).toHaveAttribute(
    'data-reduced',
    'true',
  )
  expect(
    await word.evaluate(
      (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
    ),
  ).toBe(0)
  await expect(entry.locator('.love-copy p')).toHaveCSS('opacity', '1')
  await page.getByRole('button', { name: 'Resume motion', exact: true }).click()
  expect(
    await word.evaluate(
      (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
    ),
  ).toBe(0)
  await stage.evaluate((element) =>
    scrollTo({
      top:
        element.getBoundingClientRect().top +
        scrollY +
        element.querySelector<HTMLElement>('.love-window')!.clientHeight,
      behavior: 'instant',
    }),
  )
  await page.waitForTimeout(650)
  const second = page.locator('.love-entry').nth(1)
  await second.getByRole('button').click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(second.locator('.love-note')).toHaveAttribute(
    'data-reduced',
    'true',
  )
  expect(
    await second
      .locator('.love-word')
      .last()
      .evaluate(
        (element) =>
          new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
      ),
  ).toBe(0)
  await expect(second.locator('.love-copy p')).toHaveCSS('opacity', '1')
})
