/* global window, document, console, getComputedStyle */
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import process from 'node:process'
import assert from 'node:assert/strict'
const before = process.argv.includes('before')
const output = '../docs/evidence/scroll-gallery-repair'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const results = []
try {
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [390, 844],
    [360, 844],
    [320, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      ...(!before && width === 1440
        ? { recordVideo: { dir: output, size: { width, height } } }
        : {}),
    })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('.story-stage').waitFor()
    await page.locator('.opening').waitFor({ state: 'hidden', timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1000)
    await page
      .locator('.story-stage')
      .evaluate((e) =>
        window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY),
      )
    await page.waitForTimeout(1000)
    const metrics = await page.evaluate(() => ({
      width: window.innerWidth,
      flow: document.querySelector('.story-stage').dataset.storyFlow,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      trackWidth: document.querySelector('.story-track').scrollWidth,
      trackHeight: document.querySelector('.story-track').scrollHeight,
      spreads: [...document.querySelectorAll('.story-spread')].map((e) => ({
        height: e.getBoundingClientRect().height,
        memories: e.querySelectorAll('.story-memory').length,
        photos: [...e.querySelectorAll('img')].map((i) => ({
          src: i.getAttribute('src'),
          loaded: i.complete && i.naturalWidth > 0,
        })),
      })),
    }))
    results.push(metrics)
    console.log(JSON.stringify(metrics))
    await page.screenshot({
      path: `${output}/${before ? 'before' : 'after'}-story-${width}.png`,
    })
    if (!before) {
      assert.equal(metrics.overflow, false)
      assert.ok(metrics.spreads.every((spread) => spread.memories === 1))
      if (width >= 1024) {
        const start = await page.evaluate(() => window.scrollY)
        const count = metrics.spreads.length
        for (const index of [
          0,
          Math.floor(count / 2),
          count - 1,
          Math.floor(count / 2),
          0,
        ]) {
          await page.evaluate(
            (top) => window.scrollTo({ top, behavior: 'instant' }),
            start + index * width,
          )
          await page.waitForTimeout(600)
          await page.screenshot({
            path: `${output}/after-story-${width}-${index}.png`,
          })
        }
        // Slow wheel travel followed by fast travel and reverse verifies continuous motion.
        for (const delta of [
          120,
          120,
          120,
          120,
          -120,
          -120,
          -120,
          -120,
          width * 3,
          -width * 3,
        ]) {
          await page.mouse.wheel(0, delta)
          await page.waitForTimeout(180)
        }
      }
    }
    await page.locator('.collection-opening').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: `${output}/${before ? 'before' : 'after'}-gallery-${width}.png`,
    })
    if (!before) {
      for (const [name, selector] of [
        ['spread', '.collection-spread'],
        ['favorite', '.collection-favorite'],
        ['details', '.collection-details'],
        ['closing', '.collection-closing'],
        ['letter', '#letter'],
        ['finale', '#finale'],
      ]) {
        await page.locator(selector).first().scrollIntoViewIfNeeded()
        await page.waitForTimeout(700)
        await page.screenshot({ path: `${output}/after-${name}-${width}.png` })
      }
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.reload()
      await page.locator('.story-stage').waitFor()
      await page.locator('.story-stage').scrollIntoViewIfNeeded()
      assert.equal(
        await page
          .locator('.story-track')
          .evaluate((e) => getComputedStyle(e).display),
        'block',
      )
      await page.screenshot({ path: `${output}/reduced-story-${width}.png` })
    }
    const video = page.video()
    await page.close()
    if (video) await video.saveAs(`${output}/scroll-review-${width}.webm`)
  }
  await writeFile(
    `${output}/${before ? 'before' : 'after'}.json`,
    JSON.stringify(results, null, 2),
  )
} finally {
  await browser.close()
}
