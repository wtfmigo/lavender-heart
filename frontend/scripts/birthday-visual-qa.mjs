/* global window, document, console, getComputedStyle */
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import process from 'node:process'

const output = '../docs/evidence/birthday-ready'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const chapters = [
  'home',
  'intro',
  'story',
  'memory',
  'gallery',
  'love',
  'timeline',
  'letter',
  'finale',
]
const results = []
const captures = []
async function scrollTo(page, target) {
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    target,
  )
  await page.waitForTimeout(1000)
}
async function capture(page, name, selector, offset = 0) {
  const top = await page
    .locator(selector)
    .first()
    .evaluate((element) => element.getBoundingClientRect().top + window.scrollY)
  await scrollTo(page, Math.max(0, top + offset))
  captures.push(
    await page.evaluate((name) => {
      const heart = document.querySelector('.persistent-heart')
      const bounds = heart?.getBoundingClientRect()
      return {
        name,
        scrollY: window.scrollY,
        heart: bounds
          ? {
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height,
              opacity: getComputedStyle(heart).opacity,
            }
          : null,
        finale: document
          .querySelector('#finale')
          ?.getBoundingClientRect()
          .toJSON(),
      }
    }, name),
  )
  await page.screenshot({ path: `${output}/${name}.png` })
}
try {
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [390, 844],
    [320, 844],
    [360, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(process.env.BIRTHDAY_QA_URL ?? 'http://127.0.0.1:5174/')
    await page.locator('h1').waitFor()
    await page.locator('.opening').waitFor({ state: 'hidden', timeout: 15000 })
    await page.locator('[data-webgl="ready"]').waitFor({ timeout: 20000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(2200)
    const actual = await page
      .locator('main section[id]')
      .evaluateAll((elements) => elements.map((element) => element.id))
    assert.deepEqual(actual, chapters)
    await capture(page, `hero-${width}`, '#home')
    const pageHeight = await page.evaluate(
      () => document.documentElement.scrollHeight,
    )
    for (let top = 0; top < pageHeight; top += height * 0.75) {
      await page.evaluate(
        (position) => window.scrollTo({ top: position, behavior: 'instant' }),
        top,
      )
      await page.waitForTimeout(100)
    }
    await scrollTo(page, pageHeight)
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      pageHeight: document.documentElement.scrollHeight,
      failedImages: [...document.querySelectorAll('main img')]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src')),
      canvasCount: document.querySelectorAll('canvas').length,
    }))
    assert.equal(layout.overflow, false, `${width}px horizontal overflow`)
    assert.deepEqual(layout.failedImages, [], `${width}px unloaded images`)
    assert.deepEqual(errors, [], `${width}px runtime errors`)
    assert.equal(layout.canvasCount, 1, `${width}px persistent Canvas count`)
    await capture(page, `intro-${width}`, '#intro', 80)
    await capture(
      page,
      `story-${width}`,
      width >= 1024 ? '#story' : '.story-spread',
      width >= 1024
        ? await page
            .locator('#story .chapter-scene')
            .evaluate((element) => element.getBoundingClientRect().height)
        : 50,
    )
    await capture(page, `mid-heart-${width}`, '#love', 60)
    await capture(page, `memory-${width}`, '#memory', 80)
    await capture(page, `gallery-${width}`, '.gallery-composition', -100)
    await capture(page, `love-${width}`, '#love', 100)
    await capture(page, `timeline-${width}`, '#timeline', 100)
    await capture(page, `editorial-date-${width}`, '.timeline-moment', 0)
    await capture(page, `letter-${width}`, '#letter', 80)
    await capture(page, `finale-${width}`, '#finale', 100)
    if (width === 390) {
      await page.locator('#gallery .gallery-photo button').nth(1).click()
      await page.getByRole('dialog', { name: 'Photographs' }).waitFor()
      await page.waitForTimeout(250)
      await page.screenshot({ path: `${output}/lightbox-mobile.png` })
      await page.keyboard.press('Escape')
    }
    results.push({ width, height, chapters: actual, ...layout, errors })
    console.log(
      `${width}x${height}: all nine chapters, images, overflow and runtime checks passed`,
    )
    await page.close()
  }
} finally {
  await writeFile(`${output}/qa-results.json`, JSON.stringify(results, null, 2))
  await writeFile(
    `${output}/capture-positions.json`,
    JSON.stringify(captures, null, 2),
  )
  await browser.close()
}
