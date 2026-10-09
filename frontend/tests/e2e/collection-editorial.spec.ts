import { expect, test } from '@playwright/test'
import content from '../../public/content/experience.json' with { type: 'json' }

test('long owner captions stay inside the cinematic composition', async ({
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
  const scene = page.locator('.collection-favorite')
  await scene.scrollIntoViewIfNeeded()
  const frame = await scene.boundingBox()
  const note = await scene.locator('.collection-note').boundingBox()
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
        await page.waitForTimeout(1100)
        return cloud.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        )
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
    await expect(gallery.locator('.gallery-photo')).toHaveCount(27)
    await expect(gallery.locator('.collection-spread')).toHaveCount(3)
    await expect(
      gallery.locator('.collection-details .gallery-photo'),
    ).toHaveCount(16)
    for (const photo of await gallery.locator('.gallery-photo').all()) {
      await photo.scrollIntoViewIfNeeded()
      const box = await photo.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(-1)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
      expect(
        await photo
          .locator('img')
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      ).toBe(true)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width)
    for (const selector of [
      '.collection-opening',
      '.collection-spread--air',
      '.collection-spread--moments',
      '.collection-spread--wander',
      '.collection-favorite',
      '.collection-details',
      '.collection-closing',
    ]) {
      const scene = gallery.locator(selector)
      await scene.scrollIntoViewIfNeeded()
      await scene.screenshot({
        path: `../docs/evidence/collection-editorial/${width}-${selector.slice(1)}.png`,
      })
    }
  })
}
