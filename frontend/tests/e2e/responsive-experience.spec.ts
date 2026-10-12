import { expect, test } from './experienceTest.js'

test.describe('high density screens', () => {
  test.use({ deviceScaleFactor: 2 })
  test('rapid resizing retains the complete opening and a bounded canvas', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1870, height: 970 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
      timeout: 15000,
    })
    await page.evaluate(() => document.fonts.ready)
    for (const viewport of [
      { width: 1344, height: 1762 },
      { width: 390, height: 844 },
      { width: 844, height: 390 },
      { width: 1024, height: 768 },
      { width: 1870, height: 970 },
      { width: 1344, height: 1762 },
    ]) {
      await page.setViewportSize(viewport)
    }
    for (const name of await page.locator('.hero h1 span').all()) {
      await expect(name).toBeInViewport({ ratio: 1 })
    }
    await expect(page.locator('.scroll-cue')).toBeInViewport()
    await expect(page.locator('.persistent-heart')).toBeInViewport({ ratio: 1 })
    const pixels = await page
      .locator('canvas[data-webgl="ready"]')
      .evaluate((canvas: HTMLCanvasElement) => canvas.width * canvas.height)
    expect(pixels).toBeLessThanOrEqual(938 * 938)
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .click({ timeout: 5000 })
    await expect(page.locator('.experience')).toHaveAttribute(
      'data-motion',
      'reduced',
    )
    await page.screenshot({
      path: 'playwright-report/responsive-1344x1762.png',
    })
  })
})

for (const [width, height] of [
  [844, 390],
  [1024, 768],
]) {
  test(`landscape animation and sphere remain interactive at ${width}×${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await expect(page.locator('.scroll-cue')).toBeInViewport()
    const galaxy = page.locator('.photo-galaxy')
    await galaxy.scrollIntoViewIfNeeded()
    const stage = galaxy.locator('.photo-galaxy-stage')
    const rotor = galaxy.locator('.photo-galaxy-rotor')
    const rotation = () =>
      rotor.evaluate((element) => getComputedStyle(element).transform)
    const before = await rotation()
    await expect.poll(rotation, { timeout: 1500 }).not.toBe(before)
    await stage.focus()
    const focused = await rotation()
    await page.keyboard.press('ArrowRight')
    await expect.poll(rotation).not.toBe(focused)
    const photo = galaxy.locator('.gallery-photo button').first()
    await photo.focus()
    await photo.click()
    await expect(
      page.getByRole('dialog', { name: 'Photographs' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
  })
}

for (const [width, height] of [
  [320, 568],
  [390, 844],
  [844, 390],
  [768, 1024],
  [1024, 768],
  [820, 1180],
  [1180, 820],
  [1440, 900],
]) {
  test(`chapters and photo viewer fit ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    await page.evaluate(() => document.fonts.ready)
    if (height <= 600) {
      const hero = await page.locator('.hero-stage').evaluate((element) => {
        const stage = element.getBoundingClientRect()
        return {
          height: stage.height,
          bounds: [
            ...element.querySelectorAll(
              '.hero h1 span, .hero-love, .hero-footnote',
            ),
          ].map((item) => {
            const box = item.getBoundingClientRect()
            return { top: box.top - stage.top, bottom: box.bottom - stage.top }
          }),
        }
      })
      expect(hero.height).toBeLessThanOrEqual(height + 1)
      for (const bounds of hero.bounds) {
        expect(bounds.top).toBeGreaterThanOrEqual(0)
        expect(bounds.bottom).toBeLessThanOrEqual(height + 1)
      }
    }
    for (const id of [
      'home',
      'intro',
      'story',
      'memory',
      'gallery',
      'love',
      'timeline',
      'letter',
      'finale',
    ]) {
      const chapter = page.locator(`#${id}`)
      await chapter.scrollIntoViewIfNeeded()
      await expect(chapter).toBeInViewport()
      const overflow = await chapter
        .locator('h1,h2,h3,p,figcaption,img')
        .evaluateAll((elements) =>
          elements.flatMap((element) => {
            const box = element.getBoundingClientRect()
            const style = getComputedStyle(element)
            if (
              element.closest(
                '[aria-hidden="true"],.photo-galaxy,.gallery-lightbox,.cloud-layer',
              ) ||
              box.width < 2 ||
              style.display === 'none'
            )
              return []
            return box.left < -1 || box.right > innerWidth + 1
              ? [element.className]
              : []
          }),
        )
      expect(overflow).toEqual([])
    }
    const galaxy = page.locator('.photo-galaxy')
    await galaxy.scrollIntoViewIfNeeded()
    const bounds = await galaxy.evaluate((element) => {
      const stage = element.getBoundingClientRect()
      return [...element.querySelectorAll('.gallery-photo button')].map(
        (photo) => {
          const box = photo.getBoundingClientRect()
          return {
            left: box.left,
            right: box.right,
            top: box.top - stage.top,
            bottom: box.bottom - stage.top,
            height: stage.height,
          }
        },
      )
    })
    for (const box of bounds) {
      expect(box.left).toBeGreaterThanOrEqual(-1)
      expect(box.right).toBeLessThanOrEqual(width + 1)
      expect(box.top).toBeGreaterThanOrEqual(-1)
      expect(box.bottom).toBeLessThanOrEqual(box.height + 1)
    }
    const photo = galaxy.locator('.gallery-photo button').first()
    await photo.focus()
    await photo.click()
    const dialog = page.getByRole('dialog', { name: 'Photographs' })
    await expect(dialog).toBeVisible()
    const close = dialog.getByRole('button', { name: /close/i })
    await expect(close).toBeInViewport()
    const next = dialog.getByRole('button', { name: /next/i })
    await next.scrollIntoViewIfNeeded()
    await expect(next).toBeInViewport()
    await next.click()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width)
  })
}
