/* global window, document, console */
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import process from 'node:process'
import assert from 'node:assert/strict'

const before = process.argv[2] === 'before'
const closing = process.argv[2] === 'closing'
const output = `../docs/evidence/recomposition/${before ? 'before' : 'after'}`
const url =
  process.env.RECOMPOSITION_QA_URL ??
  (before ? 'http://127.0.0.1:5175/' : 'http://127.0.0.1:5174/')
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
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const results = []
async function jump(page, selector, offset = 0) {
  await page
    .locator(selector)
    .first()
    .evaluate((element, offset) => {
      const anchor = element.parentElement.classList.contains('pin-spacer')
        ? element.parentElement
        : element
      window.scrollTo({
        top: anchor.getBoundingClientRect().top + window.scrollY + offset,
        behavior: 'instant',
      })
    }, offset)
  await page.waitForTimeout(1000)
}
try {
  const viewports = before
    ? [
        [1440, 900],
        [390, 844],
      ]
    : [
        [1440, 900],
        [1024, 768],
        [390, 844],
        [320, 844],
        [360, 844],
      ]
  for (const [width, height] of viewports) {
    for (const reduced of before ? [true] : [false, true]) {
      const page = await browser.newPage({ viewport: { width, height } })
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.emulateMedia({
        reducedMotion: reduced ? 'reduce' : 'no-preference',
      })
      await page.goto(url)
      await page.locator('h1').waitFor()
      await page
        .locator('.opening')
        .waitFor({ state: 'hidden', timeout: 15000 })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1400)
      const initialHeight = await page.evaluate(
        () => document.documentElement.scrollHeight,
      )
      for (let y = 0; y < initialHeight; y += height * 0.65) {
        await page.evaluate(
          (top) => window.scrollTo({ top, behavior: 'instant' }),
          y,
        )
        await page.waitForTimeout(100)
      }
      await page.waitForTimeout(1400)
      const state = await page.evaluate(() => ({
        pageHeight: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        failedImages: [...document.querySelectorAll('main img')]
          .filter((image) => !image.complete || !image.naturalWidth)
          .map((image) => image.getAttribute('src')),
        chapterIds: [...document.querySelectorAll('main section[id]')].map(
          (section) => section.id,
        ),
        chapterHeights: [...document.querySelectorAll('main section[id]')].map(
          (section) => ({
            id: section.id,
            height: section.getBoundingClientRect().height,
          }),
        ),
        canvasCount: document.querySelectorAll('canvas').length,
      }))
      assert.equal(state.overflow, false)
      assert.deepEqual(state.failedImages, [])
      assert.deepEqual(state.chapterIds, chapters)
      assert.equal(state.canvasCount, 1)
      assert.deepEqual(errors, [])
      results.push({ width, height, reduced, url, ...state, errors })
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: 'instant' }),
      )
      await page.waitForTimeout(1500)
      const mode = reduced ? 'static' : 'motion'
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `${output}/${mode}-fullpage-${width}.jpg`,
          fullPage: true,
          type: 'jpeg',
          quality: 85,
        })
      if (closing && !reduced) {
        await jump(page, '#finale', 80)
        await page.screenshot({ path: `${output}/finale-${width}.png` })
      }
      if (!before && !reduced && !closing) {
        for (const id of chapters) {
          await jump(page, `#${id}`, id === 'home' ? 0 : 80)
          await page.screenshot({ path: `${output}/${id}-${width}.png` })
        }
        for (const [name, selector, offset] of [
          ['gallery-wall', '.gallery-composition', 0],
          ['timeline-date', '.timeline-date', 0],
          ['love-statement', '.love-stage', 0],
        ]) {
          await jump(page, selector, offset)
          await page.screenshot({ path: `${output}/${name}-${width}.png` })
        }
        if (width >= 1024) {
          await jump(page, '#story')
          const stage = page.locator('.story-stage')
          assert.notEqual(
            await stage.getAttribute('data-story-flow'),
            'vertical',
          )
          assert.equal(
            await stage.evaluate((element) =>
              element.parentElement.classList.contains('pin-spacer'),
            ),
            true,
          )
          const distance = await page
            .locator('.story-track')
            .evaluate((track) =>
              Math.max(0, track.scrollWidth - window.innerWidth),
            )
          const top = await stage.evaluate(
            (element) => element.getBoundingClientRect().top + window.scrollY,
          )
          for (const [name, ratio] of [
            ['entry', 0],
            ['middle', 0.5],
            ['exit', 1],
          ]) {
            await page.evaluate(
              (y) => window.scrollTo({ top: y, behavior: 'instant' }),
              top + distance * ratio,
            )
            await page.waitForTimeout(1400)
            await page.screenshot({
              path: `${output}/story-${name}-${width}.png`,
            })
          }
          for (let index = 0; index < 7; index++) {
            await page.evaluate(
              (y) => window.scrollTo({ top: y, behavior: 'instant' }),
              top + width * index,
            )
            await page.waitForTimeout(1200)
            await page.screenshot({
              path: `${output}/story-panel-${index + 1}-${width}.png`,
            })
          }
          await page.evaluate(
            (y) => window.scrollTo({ top: y, behavior: 'instant' }),
            top + height * 0.2,
          )
          await page.waitForTimeout(1400)
          const x = () =>
            page
              .locator('.story-track')
              .evaluate(
                (element) =>
                  new window.DOMMatrixReadOnly(
                    window.getComputedStyle(element).transform,
                  ).m41,
              )
          const entryX = await x()
          await page.mouse.move(width / 2, height / 2)
          await page.mouse.wheel(0, height)
          await page.waitForTimeout(1800)
          const forwardX = await x()
          assert.ok(forwardX < entryX - height * 0.5)
          await page.mouse.wheel(0, -height)
          await page.waitForTimeout(1800)
          const reverseX = await x()
          assert.ok(Math.abs(reverseX - entryX) < 80)
          results.at(-1).storyWheel = { entryX, forwardX, reverseX, distance }
          await jump(page, '#love')
          const love = page.locator('.love-stage')
          assert.notEqual(await love.getAttribute('data-love-flow'), 'vertical')
          const loveTop = await love.evaluate(
            (element) =>
              element.parentElement.getBoundingClientRect().top +
              window.scrollY,
          )
          const loveTravel = await page
            .locator('.love-sequence')
            .evaluate(
              (element) =>
                element.scrollHeight - element.parentElement.clientHeight,
            )
          for (const [name, offset] of [
            ['entry', 0],
            ['middle', height * 3],
            ['exit', loveTravel],
          ]) {
            await page.evaluate(
              (top) => window.scrollTo({ top, behavior: 'instant' }),
              loveTop + offset,
            )
            await page.waitForTimeout(1400)
            await page.screenshot({
              path: `${output}/love-${name}-${width}.png`,
            })
          }
        }
      }
      console.log(
        `${width}px ${mode}: ${state.pageHeight}px, all chapters/images/overflow/runtime checks pass`,
      )
      await page.close()
    }
  }
} finally {
  await writeFile(`${output}/qa-results.json`, JSON.stringify(results, null, 2))
  await browser.close()
}
