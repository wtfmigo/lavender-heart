/* global window, document, console */
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const output = '../docs/evidence/recomposition/before'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const results = []
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto('http://127.0.0.1:5174/')
    await page.locator('.opening').waitFor({ state: 'hidden', timeout: 15000 })
    await page.locator('h1').waitFor()
    await page.evaluate(() => document.fonts.ready)
    const pageHeight = await page.evaluate(
      () => document.documentElement.scrollHeight,
    )
    for (let y = 0; y < pageHeight; y += height * 0.8) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(80)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(1800)
    await page.screenshot({
      path: `${output}/fullpage-${width}.png`,
      fullPage: true,
    })
    results.push({ width, height, pageHeight })
    console.log(`Baseline ${width}: ${pageHeight}px`)
    await page.close()
  }
  await writeFile(`${output}/dimensions.json`, JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
