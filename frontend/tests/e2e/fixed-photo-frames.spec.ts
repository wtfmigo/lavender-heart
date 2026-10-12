import { expect, test } from './experienceTest.js'
import { writeFile } from 'node:fs/promises'
import content from '../../public/content/experience.json' with { type: 'json' }

for (const [width, height, reduced] of [
  [1440, 900, true],
  [390, 844, true],
  [844, 390, true],
  [568, 320, true],
  [768, 1024, true],
  [1440, 900, false],
  [390, 844, false],
] as const) {
  test(`replacement images preserve every existing frame at ${width}x${height}${reduced ? '' : ' with motion'}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    })
    let replacement = false
    const changed = structuredClone(content)
    const photos = [
      ...changed.story.flatMap((item) => (item.photo ? [item.photo] : [])),
      changed.memoryPhoto!,
      ...changed.gallery,
      ...changed.timeline.flatMap((item) => (item.photo ? [item.photo] : [])),
    ]
    photos.forEach((photo, index) => {
      photo.width = index % 2 ? 240 : 960
      photo.height = index % 2 ? 960 : 240
      photo.src = `/photos/frame-test-${index}.svg`
      delete photo.smallSrc
    })
    await page.route('**/photos/frame-test-*.svg', (route) => {
      const index = Number(
        route
          .request()
          .url()
          .match(/frame-test-(\d+)/)![1],
      )
      const photo = photos[index]
      return route.fulfill({
        contentType: 'image/svg+xml',
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="${photo.width}" height="${photo.height}"><rect width="100%" height="100%" fill="#a78bc7"/></svg>`,
      })
    })
    await page.route('**/content/experience.json', (route) =>
      route.fulfill({ json: replacement ? changed : content }),
    )
    const sample = async () => {
      await page.goto('/')
      await expect(page.locator('#finale')).toBeAttached()
      await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
      await page.evaluate(() => document.fonts.ready)
      const toggle = page.getByRole('button', {
        name: 'Show photo list',
        exact: true,
      })
      // Keep the same scroll position so gallery entry tweens cannot skew frame measurements.
      await toggle.evaluate((button) => (button as HTMLButtonElement).click())
      const images = page.locator(
        '.story-spread img, .memory-image, .gallery-photo img, .timeline-moment img',
      )
      await images.evaluateAll((images) =>
        images.forEach(
          (image) => ((image as HTMLImageElement).loading = 'eager'),
        ),
      )
      await expect
        .poll(() =>
          images.evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
        )
        .toBe(true)
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
      await page.waitForTimeout(700)
      const bounds = await images.evaluateAll((images) =>
        images.map((image) => {
          const box = image.getBoundingClientRect()
          return {
            x: box.x,
            y: box.y + scrollY,
            width: box.width,
            height: box.height,
          }
        }),
      )
      const lightbox = []
      for (const index of [0, 2, 18]) {
        const button = page.locator('.gallery-photo button').nth(index)
        await button.scrollIntoViewIfNeeded()
        await button.click()
        const image = page.locator('.gallery-lightbox img')
        await expect
          .poll(() =>
            image.evaluate(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          )
          .toBe(true)
        const box = await image.boundingBox()
        lightbox.push({ width: box!.width, height: box!.height })
        await page.keyboard.press('Escape')
      }
      return { bounds, lightbox }
    }
    const before = await sample()
    if (height === 320) {
      expect(before.lightbox[0].height).toBeCloseTo(height * 0.48, 0)
    }
    await writeFile(
      testInfo.outputPath('original-bounds.json'),
      JSON.stringify(before),
    )
    await testInfo.attach('original-frame-bounds', {
      body: JSON.stringify(before),
      contentType: 'application/json',
    })
    replacement = true
    const after = await sample()
    expect(after.bounds).toHaveLength(before.bounds.length)
    for (let index = 0; index < before.bounds.length; index++) {
      for (const key of ['x', 'y', 'width', 'height'] as const) {
        expect(after.bounds[index][key], `photo ${index} ${key}`).toBeCloseTo(
          before.bounds[index][key],
          0,
        )
      }
    }
    after.lightbox.forEach((box, index) => {
      expect(box.width).toBeCloseTo(before.lightbox[index].width, 0)
      expect(box.height).toBeCloseTo(before.lightbox[index].height, 0)
    })
  })
}
