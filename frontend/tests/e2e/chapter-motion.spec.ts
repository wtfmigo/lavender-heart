import { expect, test } from '@playwright/test'

for (const width of [1440, 390]) {
  test(`photos pan with scroll and reverse at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    for (const selector of [
      '.gallery-photo',
      '.timeline-content .chapter-photo',
    ]) {
      const frame = page.locator(selector).first()
      const image = frame.locator('img')
      const top = await frame.evaluate(
        (element) => element.getBoundingClientRect().top + window.scrollY,
      )
      const sample = async (offset: number) => {
        await page.evaluate(
          (position) => window.scrollTo({ top: position, behavior: 'instant' }),
          top - offset,
        )
        await page.waitForTimeout(1000)
        return image.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        )
      }
      await sample(650)
      const first = await sample(650)
      const second = await sample(150)
      const height = await image.evaluate((element) => element.clientHeight)
      expect(Math.abs(second - first)).toBeGreaterThan(height * 0.055)
      expect(await sample(650)).toBeCloseTo(first, 0)
      await expect(image).toBeVisible()
    }
  })
}

test('reduced motion leaves photos and reading content fully visible and static', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const selector of [
    '.gallery-photo img',
    '.timeline-content img',
    '.love-entry h3',
    '.letter-body p',
  ]) {
    const element = page.locator(selector).first()
    await element.scrollIntoViewIfNeeded()
    expect(
      await element.evaluate((target) => getComputedStyle(target).transform),
    ).toBe('none')
    expect(
      await element.evaluate((target) => getComputedStyle(target).opacity),
    ).toBe('1')
  }
})

test('pinned statements and letter paragraphs reveal with scroll and reverse', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  for (const selector of [
    '.love-entry:nth-child(2) > div',
    '.letter-body > p',
  ]) {
    const target = page.locator(selector).first()
    const top = await target.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    )
    const opacity = async (offset: number) => {
      await page.evaluate(
        (position) => window.scrollTo({ top: position, behavior: 'instant' }),
        top - offset,
      )
      await page.waitForTimeout(1000)
      return target.evaluate((element) =>
        Number(getComputedStyle(element).opacity),
      )
    }
    const before = await opacity(1250)
    expect(await opacity(300)).toBeGreaterThan(before + 0.2)
    expect(await opacity(1250)).toBeCloseTo(before, 1)
  }
  await page.locator('.gallery-photo').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
})

test('closing message completes its reveal at the bottom of the page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1864, height: 968 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
    timeout: 15000,
  })
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  )
  await expect(page.locator('#finale')).toBeInViewport()
  await page.waitForTimeout(1500)
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  )
  await expect
    .poll(() =>
      page
        .locator('.finale-message')
        .evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeGreaterThan(0.99)
  await expect
    .poll(() =>
      page
        .locator('.finale-message')
        .evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        ),
    )
    .toBeCloseTo(0, 0)
  await page.screenshot({
    path: '../docs/evidence/collection-scroll/strong-closing.png',
  })
})
