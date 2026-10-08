/* global document, window, console, process, HTMLCanvasElement */
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const directory = '../docs/evidence/visible-experience'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch()
const results = []
try {
  if (process.argv.includes('--reference')) {
    await mkdir('test-results/reference-study', { recursive: true })
    const reference = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    })
    try {
      await reference.goto('https://thediamonds.framer.website/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      })
      await reference.waitForTimeout(3500)
      await reference.screenshot({
        path: 'test-results/reference-study/hero.png',
      })
      console.log(
        'Reference:',
        (await reference.locator('body').innerText()).slice(0, 400),
      )
      await reference.evaluate(() => window.scrollTo(0, 650))
      await reference.waitForTimeout(1000)
      await reference.screenshot({
        path: 'test-results/reference-study/scroll.png',
      })
    } catch (error) {
      console.log('Reference unavailable:', error.message)
    }
    await reference.close()
  }
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [390, 844],
    [320, 844],
    [360, 844],
    [375, 844],
    [414, 844],
    [768, 1024],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('h1').waitFor()
    await page.locator('canvas[data-webgl="ready"]').waitFor({ timeout: 15000 })
    await page.waitForTimeout(4000)
    await page.screenshot({ path: `${directory}/hero-${width}.png` })
    const hero = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      canvas: !!document.querySelector('canvas[data-webgl="ready"]'),
      font: document.fonts.check('400 24px "Cormorant Garamond"'),
    }))
    if (width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 630))
      await page.waitForTimeout(1600)
      await page.screenshot({ path: `${directory}/transition-desktop.png` })
    }
    await page.locator('#intro').scrollIntoViewIfNeeded()
    await page.evaluate(() =>
      window.scrollTo(0, document.querySelector('#intro').offsetTop),
    )
    await page.waitForTimeout(1600)
    if ([1440, 390].includes(width))
      await page.screenshot({ path: `${directory}/intro-${width}.png` })
    results.push({ width, height, ...hero, errors })
    await page.close()
  }
  for (const mode of ['reduced', 'fallback']) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference',
    })
    if (mode === 'fallback')
      await page.addInitScript(() => {
        HTMLCanvasElement.prototype.getContext = () => null
      })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('h1').waitFor()
    await page.waitForTimeout(3500)
    await page.screenshot({ path: `${directory}/${mode}-mobile.png` })
    results.push({
      mode,
      motion: await page.locator('.experience').getAttribute('data-motion'),
      fallbackVisible: await page.locator('.heart-fallback').last().isVisible(),
    })
    await page.close()
  }
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'no-preference',
    })
    await page.route('**/demoExperience.ts*', async (route) => {
      const response = await route.fetch()
      await route.fulfill({
        response,
        body: (await response.text()).replace(
          'Recipient Name',
          'Alexandra Maria Isabel de la Cruz Santos',
        ),
      })
    })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('h1').waitFor()
    await page.waitForTimeout(4000)
    await page.screenshot({
      path: `${directory}/long-name-${width}.png`,
      fullPage: true,
    })
    await page.locator('h1 span').last().scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: `${directory}/long-name-scroll-${width}.png`,
    })
    results.push({
      mode: 'long-name',
      width,
      heading: await page.locator('h1').innerText(),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    })
    await page.close()
  }
  await writeFile(
    `${directory}/qa-results.json`,
    JSON.stringify(results, null, 2),
  )
  console.log(JSON.stringify(results))
} finally {
  await browser.close()
}
