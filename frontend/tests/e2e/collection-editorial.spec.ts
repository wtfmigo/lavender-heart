import { expect, test } from '@playwright/test'
import content from '../../public/content/experience.json' with { type: 'json' }

test('an editorial spread reveals its photographs and associated note together', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const spread = page.locator('.collection-spread--air')
  await expect(spread).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  await spread.scrollIntoViewIfNeeded()
  const top = await spread.evaluate(
    (e) => e.getBoundingClientRect().top + window.scrollY,
  )
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: 'instant' }),
    top - 720,
  )
  await expect
    .poll(() =>
      spread
        .locator('.gallery-photo')
        .first()
        .evaluate((e) => Number(getComputedStyle(e).opacity)),
    )
    .toBeGreaterThan(0.1)
  await expect
    .poll(() =>
      spread.evaluate((e) => {
        const opacities = [
          ...e.querySelectorAll('.gallery-photo,.collection-note'),
        ].map((element) => Number(getComputedStyle(element).opacity))
        return Math.max(...opacities) - Math.min(...opacities)
      }),
    )
    .toBeLessThan(0.01)
})

test('long owner captions stay inside the normal-size photo frame', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const data = structuredClone(content)
  data.gallery[10].caption =
    'A long caption about a photograph and all the little details that made it worth keeping. '.repeat(
      5,
    )
  await page.route('**/content/experience.json', (route) =>
    route.fulfill({ json: data }),
  )
  await page.goto('/')
  const scene = page.locator('.collection-details .gallery-photo').first()
  await scene.scrollIntoViewIfNeeded()
  const frame = await scene.boundingBox()
  const note = await scene.locator('figcaption').boundingBox()
  expect(note!.y).toBeGreaterThanOrEqual(frame!.y)
  expect(note!.y + note!.height).toBeLessThanOrEqual(frame!.y + frame!.height)
})

for (const width of [1440, 390]) {
  test(`collection clouds follow scrolling and stop with motion paused at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    for (const selector of [
      '.collection-cloud--opening',
      '.collection-cloud--closing',
    ]) {
      const cloud = page.locator(selector)
      await page
        .locator(
          selector.includes('opening')
            ? '.collection-opening'
            : '.collection-closing',
        )
        .scrollIntoViewIfNeeded()
      await page.waitForTimeout(1200)
      const top = await cloud.evaluate(
        (element) =>
          element.parentElement!.getBoundingClientRect().top + window.scrollY,
      )
      const sample = async (position: number) => {
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: 'instant' }),
          position,
        )
        await expect
          .poll(() => page.evaluate(() => window.scrollY))
          .toBeCloseTo(position, 0)
        const translation = () =>
          cloud.evaluate(
            (element) =>
              new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
          )
        let previous = await translation()
        let stableSamples = 0
        await expect
          .poll(
            async () => {
              const current = await translation()
              stableSamples =
                Math.abs(current - previous) < 0.05 ? stableSamples + 1 : 0
              previous = current
              return stableSamples
            },
            { intervals: [100], timeout: 10000 },
          )
          .toBeGreaterThanOrEqual(3)
        return previous
      }
      const before = await sample(top - 650)
      const after = await sample(top - 100)
      expect(
        Math.abs(after - before),
        `${selector}: top=${top}, before=${before}, after=${after}`,
      ).toBeGreaterThan(10)
      expect(await sample(top - 650)).toBeCloseTo(before, 0)
    }
    await page.getByRole('button', { name: 'Pause motion' }).click()
    const cloud = page.locator('.collection-cloud--opening')
    const staticTransform = await cloud.evaluate(
      (element) => getComputedStyle(element).transform,
    )
    await page.locator('.collection-opening').scrollIntoViewIfNeeded()
    expect(
      await cloud.evaluate((element) => getComputedStyle(element).transform),
    ).toBe(staticTransform)
  })
}

for (const [width, height] of [
  [1440, 900],
  [1024, 768],
  [390, 844],
  [320, 844],
  [360, 844],
]) {
  test(`editorial collection remains readable and contained at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const gallery = page.locator('#gallery')
    await gallery.scrollIntoViewIfNeeded()
    await expect(gallery.locator('.gallery-photo')).toHaveCount(20)
    await expect(gallery.locator('.collection-spread')).toHaveCount(3)
    await expect(
      gallery.locator('.collection-details .gallery-photo'),
    ).toHaveCount(10)
    await expect(gallery.locator('.collection-detail-spread')).toHaveCount(2)
    await expect(
      gallery.locator('.collection-detail-spread').first().locator('figure'),
    ).toHaveCount(9)
    await expect(
      gallery.locator('.collection-detail-spread').last().locator('figure'),
    ).toHaveCount(1)
    if (width >= 701) {
      const rows = await gallery
        .locator('.collection-detail-spread')
        .first()
        .locator('figure')
        .evaluateAll((figures) =>
          figures.map((e) => e.getBoundingClientRect().top),
        )
      for (const start of [0, 3, 6])
        expect(
          Math.max(...rows.slice(start, start + 3)) -
            Math.min(...rows.slice(start, start + 3)),
        ).toBeLessThan(1)
      const remaining = await gallery
        .locator('.collection-detail-spread')
        .last()
        .locator('figure')
        .boundingBox()
      expect(
        Math.abs(remaining!.x + remaining!.width / 2 - width / 2),
      ).toBeLessThan(2)
    }
    expect(
      await gallery
        .locator('.gallery-photo img')
        .evaluateAll((images) =>
          images.map((image) => image.getAttribute('src')),
        ),
    ).toEqual(content.gallery.map((photo) => photo.src))
    for (const photo of await gallery.locator('.gallery-photo').all()) {
      await photo.scrollIntoViewIfNeeded()
      const box = await photo.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(-1)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
      await expect
        .poll(
          () =>
            photo
              .locator('img')
              .evaluate(
                (image: HTMLImageElement) =>
                  image.complete && image.naturalWidth > 0,
              ),
          { timeout: 15000 },
        )
        .toBe(true)
      const image = await photo
        .locator('img')
        .evaluate((element: HTMLImageElement) => ({
          ratio:
            element.getBoundingClientRect().width /
            element.getBoundingClientRect().height,
          originalRatio:
            Number(element.getAttribute('width')) /
            Number(element.getAttribute('height')),
        }))
      const keepsake = await photo.evaluate((element) =>
        element.classList.contains('collection-photo--keepsake'),
      )
      expect(image.ratio).toBeCloseTo(keepsake ? 3 / 4 : image.originalRatio, 2)
    }
    const boxes = await gallery
      .locator('.gallery-photo')
      .evaluateAll((photos) =>
        photos.map((photo) => {
          const { left, right, top, bottom } = photo.getBoundingClientRect()
          return { left, right, top, bottom }
        }),
      )
    for (let index = 0; index < boxes.length; index++) {
      for (const other of boxes.slice(index + 1)) {
        const photo = boxes[index]
        expect(
          photo.right <= other.left + 1 ||
            other.right <= photo.left + 1 ||
            photo.bottom <= other.top + 1 ||
            other.bottom <= photo.top + 1,
          `Photo ${index + 1} has its own space`,
        ).toBe(true)
      }
    }
    await expect(gallery.locator('.collection-favorite')).toHaveCount(0)
    if (width <= 700) {
      expect(boxes[7].bottom).toBeLessThanOrEqual(boxes[8].top)
      expect(boxes[7].bottom).toBeLessThanOrEqual(boxes[9].top)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width)
    for (const selector of [
      '.collection-opening',
      '.collection-spread--air',
      '.collection-spread--moments',
      '.collection-spread--wander',
      '.collection-details',
      '.collection-closing',
    ]) {
      const scene = gallery.locator(selector)
      await scene.scrollIntoViewIfNeeded()
      await scene.screenshot({
        path: `test-results/collection-editorial/${width}-${selector.slice(1)}.png`,
      })
    }
  })
}
