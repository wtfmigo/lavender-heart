import { expect, test } from './experienceTest.js'

test.use({ hasTouch: true })

for (const width of [390, 820]) {
  test(`a short touch swipe rotates the sphere easily at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const stage = page.locator('.photo-galaxy-stage')
    await stage.scrollIntoViewIfNeeded()
    const box = (await stage.boundingBox())!
    const rotor = page.locator('.photo-galaxy-rotor')
    const yaw = () =>
      rotor.evaluate((element) =>
        parseFloat(
          (element as HTMLElement).style.getPropertyValue('--galaxy-yaw'),
        ),
      )
    const before = await yaw()
    const scroll = await page.evaluate(() => scrollY)
    const session = await page.context().newCDPSession(page)
    const x = box.x + box.width * 0.35
    const y = box.y + box.height * 0.5
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    })
    for (let step = 1; step <= 6; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + (box.width * 0.25 * step) / 6, y: y + step }],
      })
      await page.waitForTimeout(20)
    }
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    })
    expect(Math.abs((await yaw()) - before)).toBeGreaterThanOrEqual(75)
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(scroll, 0)
    await expect(page.locator('.gallery-lightbox')).toBeHidden()
    await session.detach()
    const button = page.getByRole('button', { name: 'Rotate photos right' })
    await expect(button).toBeVisible()
    const after = await yaw()
    await button.tap()
    await expect.poll(async () => (await yaw()) - after).toBeCloseTo(45, 4)
  })
}

test('sphere thumbnails start loading before the sphere enters the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const galaxy = page.locator('.photo-galaxy')
  await galaxy.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - innerHeight - 250,
      behavior: 'instant',
    }),
  )
  await expect(galaxy).not.toBeInViewport()
  await expect
    .poll(() =>
      galaxy
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) => (image as HTMLImageElement).loading === 'eager',
          ),
        ),
    )
    .toBe(true)
})

for (const [width, height] of [
  [390, 844],
  [820, 1180],
]) {
  test(`late photos retain desktop composition and reserved frames at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    let release!: () => void
    const loaded = new Promise<void>((resolve) => {
      release = resolve
    })
    await page.route('**/photos/personal/**', async (route) => {
      await loaded
      await route.continue()
    })
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.evaluate(() => document.fonts.ready)
      const photos = page.locator(
        '.story-spread .chapter-photo, .collection-opening-photos, .timeline-content .chapter-photo',
      )
      const sample = () =>
        photos.evaluateAll((elements) =>
          elements.map((element) => {
            const rect = element.getBoundingClientRect()
            return {
              x: rect.x,
              y: rect.y + scrollY,
              width: rect.width,
              height: rect.height,
            }
          }),
        )
      const before = await sample()
      await page
        .locator(
          '.story-spread img, .timeline-content img, .collection-opening-photos img',
        )
        .evaluateAll((images) =>
          images.forEach((image) => {
            ;(image as HTMLImageElement).loading = 'eager'
          }),
        )
      release()
      await expect
        .poll(() =>
          page
            .locator(
              '.story-spread img, .timeline-content img, .collection-opening-photos img',
            )
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  (image as HTMLImageElement).complete &&
                  (image as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true)
      const after = await sample()
      for (let index = 0; index < before.length; index++) {
        for (const key of ['x', 'y', 'width', 'height'] as const)
          expect(after[index][key]).toBeCloseTo(before[index][key], 0)
      }
      for (const selector of [
        '.story-memory',
        '.collection-opening',
        '.timeline-content',
      ]) {
        expect(
          await page
            .locator(selector)
            .first()
            .evaluate(
              (element) =>
                getComputedStyle(element).gridTemplateColumns.split(' ').length,
            ),
        ).toBe(2)
      }
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBe(width)
      const galaxy = page.locator('.photo-galaxy')
      await galaxy.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          galaxy
            .locator('img')
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  (image as HTMLImageElement).complete &&
                  (image as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        )
        .toBe(true)
      await page.screenshot({ path: `test-results/touch-ui-${width}.png` })
    } finally {
      release()
    }
  })
}
