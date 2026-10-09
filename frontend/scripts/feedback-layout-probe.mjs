/* global document, window, console */
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import process from 'node:process'
const before = process.argv.includes('before')
const output = '../docs/evidence/screenshot-fixes'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const results = []
try {
  for (const [width, height] of before
    ? [[1864, 968]]
    : [
        [1864, 968],
        [1920, 1080],
        [1440, 900],
        [1024, 768],
        [390, 844],
        [320, 844],
      ]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('.timeline-moment').first().waitFor()
    await page.locator('.opening').waitFor({ state: 'hidden', timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1400)
    const metrics = await page.evaluate(() => {
      const brokenWords = []
      for (const element of document.querySelectorAll(
        '.timeline-date strong, .timeline-copy h3',
      )) {
        const text = element.firstChild
        if (!text || text.nodeType !== 3) continue
        for (const word of text.textContent.matchAll(/\S+/g)) {
          const range = document.createRange()
          range.setStart(text, word.index)
          range.setEnd(text, word.index + word[0].length)
          const lines = new Set(
            Array.from(range.getClientRects(), (rect) => Math.round(rect.top)),
          )
          if (lines.size > 1) brokenWords.push(word[0])
        }
      }
      const timeline = document
        .querySelector('.timeline-moments')
        .getBoundingClientRect()
      const image = document
        .querySelector('.timeline-content img')
        .getBoundingClientRect()
      return {
        brokenWords,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        timelineWidth: timeline.width,
        firstImageWidth: image.width,
      }
    })
    for (const [name, selector] of [
      ['timeline-date', '.timeline-date'],
      ['timeline-content', '.timeline-content'],
      ['timeline-stagger', '.timeline-moment:nth-child(4) .timeline-content'],
      ['gallery', '.gallery-photo-2'],
    ]) {
      await page
        .locator(selector)
        .first()
        .evaluate((element) =>
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'instant',
          }),
        )
      await page.waitForTimeout(1000)
      if ([1864, 390, 320].includes(width))
        await page.screenshot({
          path: `${output}/${before ? 'before' : 'after'}-${name}-${width}.png`,
        })
    }
    console.log(JSON.stringify({ width, ...metrics }))
    results.push({ width, height, ...metrics })
    if (!before) {
      assert.deepEqual(metrics.brokenWords, [], `${width}px split a word`)
      assert.equal(metrics.overflow, false, `${width}px overflowed`)
      if (width >= 1024)
        assert.ok(
          metrics.firstImageWidth >= width * 0.3,
          `${width}px image remains too narrow`,
        )
    }
    await page.close()
  }
  await writeFile(
    `${output}/${before ? 'before' : 'after'}-layout.json`,
    JSON.stringify(results, null, 2),
  )
} finally {
  await browser.close()
}
