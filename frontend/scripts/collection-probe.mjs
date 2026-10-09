/* global window, document */
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const output = '../docs/evidence/collection-scroll'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
try {
  for (const width of [1864, 1440, 1024, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('.opening').waitFor({ state: 'hidden' })
    await page.locator('canvas[data-webgl="ready"]').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(3500)
    for (const [name, selector] of [
      ['heading', '#gallery'],
      ['photos', '.gallery-composition'],
    ]) {
      await page.locator(selector).evaluate((e) =>
        window.scrollTo({
          top: e.getBoundingClientRect().top + window.scrollY,
          behavior: 'instant',
        }),
      )
      await page.waitForTimeout(1200)
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        'No horizontal overflow',
      )
      if (width >= 1024 && name === 'photos') {
        const opacity = await page
          .locator('.persistent-heart')
          .evaluate((e) => Number(window.getComputedStyle(e).opacity))
        assert.ok(opacity < 0.05, 'Heart clears the photo spread')
      }
      await page.screenshot({ path: `${output}/${name}-${width}.png` })
    }
    const boxes = await page
      .locator('.gallery-photo')
      .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().toJSON()))
    for (let i = 0; i < boxes.length; i++) {
      assert.ok(
        boxes[i].height > 20 && boxes[i].width > 20,
        'Every photo has space',
      )
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i],
          b = boxes[j]
        assert.ok(
          a.right <= b.left + 1 ||
            b.right <= a.left + 1 ||
            a.bottom <= b.top + 1 ||
            b.bottom <= a.top + 1,
          'Photos do not overlap',
        )
      }
    }
    await page.close()
  }
} finally {
  await browser.close()
}
