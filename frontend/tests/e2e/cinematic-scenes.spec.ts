import { expect, test } from '@playwright/test'
import { readStoryPanel } from './storyPosition.js'

test('story has varied framed scenes and unmasked native reading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.locator('.story-stage').waitFor()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  const first = page.locator('.story-spread').first()
  expect(
    await first
      .locator('.chapter-index')
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize)),
  ).toBeGreaterThan(72)
  expect(
    await first
      .locator('.chapter-photo')
      .evaluate((e) => parseFloat(getComputedStyle(e).paddingTop)),
  ).toBe(4)
  const grids = await page
    .locator('.story-memory')
    .evaluateAll((elements) =>
      elements.slice(0, 4).map((e) => getComputedStyle(e).gridTemplateColumns),
    )
  expect(new Set(grids).size).toBeGreaterThanOrEqual(3)
  const scene = page.locator('.story-spread').nth(2).locator('.story-memory')
  await readStoryPanel(page, 2)
  await expect(scene).toHaveCSS('clip-path', 'none')
  await expect(scene.locator('img')).toBeVisible()
  await expect(scene.locator('h3')).toBeVisible()
})

for (const width of [390, 320]) {
  test(`cinematic frames retain complete vertical reading at ${width}px with motion paused`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.story-spread')).toHaveCount(8)
    for (const spread of await page.locator('.story-spread').all()) {
      await spread.scrollIntoViewIfNeeded()
      await expect(spread.locator('h3')).toBeVisible()
      await expect(spread.locator('.story-memory')).toHaveCSS(
        'clip-path',
        'none',
      )
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width)
  })
}

test('the story exit hands off to the existing memory photo without scroll-driven zoom', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const photo = page.locator('#memory .memory-depth')
  await expect(photo).toHaveCount(1)
  const top = await page
    .locator('#memory')
    .evaluate((e) => e.getBoundingClientRect().top + window.scrollY)
  const samples = []
  for (const y of [top - 700, top, top - 700]) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      y,
    )
    await page.waitForTimeout(700)
    samples.push(
      await photo.evaluate(
        (e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m11,
      ),
    )
  }
  expect(samples).toEqual([1, 1, 1])
  expect(samples[2]).toBeCloseTo(samples[0], 2)
  await expect(photo.locator('img')).toHaveCSS('transform', 'none')
})
