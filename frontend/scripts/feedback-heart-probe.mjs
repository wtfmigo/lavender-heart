/* global window, document */
import assert from 'node:assert/strict'
import { writeFile, mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const evidence = '../docs/evidence/screenshot-fixes'
await mkdir(evidence, { recursive: true })
const browser = await chromium.launch()
const results = []
try {
  for (const [width, height, dpr] of [
    [1864, 968, 1],
    [1243, 645, 1.5],
    [390, 844, 1],
    [320, 844, 1],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: dpr,
    })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('canvas[data-webgl="ready"]').waitFor()
    await page.locator('.opening').waitFor({ state: 'hidden' })
    await page.evaluate(() => document.fonts.ready)
    const canvas = page.locator('canvas[data-webgl="ready"]')
    const buffer = await canvas.evaluate((e) => [e.width, e.height])
    for (const offset of [0, 100, 500]) {
      await page.locator('#intro').evaluate(
        (e, offset) =>
          window.scrollTo({
            top: e.getBoundingClientRect().top + window.scrollY + offset,
            behavior: 'instant',
          }),
        offset,
      )
      await page.waitForTimeout(700)
      const state = await canvas.evaluate((e) => {
        const frame = e.closest('.crystal-heart').getBoundingClientRect()
        const rect = e.getBoundingClientRect()
        return {
          buffer: [e.width, e.height],
          contained:
            rect.left >= frame.left - 2 &&
            rect.right <= frame.right + 2 &&
            rect.top >= frame.top - 2 &&
            rect.bottom <= frame.bottom + 2,
        }
      })
      assert.deepEqual(
        state.buffer,
        buffer,
        'Chapter motion must not resize the GPU buffer',
      )
      assert.ok(
        state.contained,
        'Render surface must fit inside the heart frame',
      )
      assert.equal(await page.locator('canvas').count(), 1)
      results.push({ width, height, dpr, offset, ...state })
      await page.screenshot({
        path: `${evidence}/after-heart-${width}-dpr${dpr}-${offset}.png`,
      })
    }
    await page.close()
  }
  await writeFile(
    `${evidence}/after-heart.json`,
    JSON.stringify(results, null, 2),
  )
} finally {
  await browser.close()
}
