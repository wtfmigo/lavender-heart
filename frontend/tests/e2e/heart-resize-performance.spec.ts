import { expect, test } from '@playwright/test'

test('desktop to iPhone emulation keeps complete responsive text and interactive controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1870, height: 970 })
  await page.goto('/')
  await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
    timeout: 15000,
  })
  await page.evaluate(() => document.fonts.ready)
  const session = await page.context().newCDPSession(page)
  await page.setViewportSize({ width: 440, height: 956 })
  await session.send('Emulation.setDeviceMetricsOverride', {
    width: 440,
    height: 956,
    deviceScaleFactor: 3,
    mobile: true,
  })
  await expect.poll(() => page.evaluate(() => innerWidth)).toBe(440)
  for (const name of await page.locator('.hero h1 span').all()) {
    await expect(name).toBeInViewport({ ratio: 1 })
  }
  await expect(page.locator('.scroll-cue')).toBeInViewport()
  await page
    .getByRole('button', { name: 'Pause motion', exact: true })
    .click({ timeout: 5000 })
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-motion',
    'reduced',
  )
  await page.screenshot({ path: 'playwright-report/iphone-440x956.png' })
})

test('animated heart renders without a refraction framebuffer on every frame', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const tracked = window as unknown as { offscreenHeartPasses: number }
    tracked.offscreenHeartPasses = 0
    const original = WebGL2RenderingContext.prototype.bindFramebuffer
    WebGL2RenderingContext.prototype.bindFramebuffer = function (
      target,
      framebuffer,
    ) {
      if (framebuffer) tracked.offscreenHeartPasses++
      return original.call(this, target, framebuffer)
    }
  })
  await page.goto('/')
  await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
    timeout: 15000,
  })
  const passes = await page.evaluate(async () => {
    const tracked = window as unknown as { offscreenHeartPasses: number }
    for (let frame = 0; frame < 20; frame++)
      await new Promise(requestAnimationFrame)
    tracked.offscreenHeartPasses = 0
    for (let frame = 0; frame < 30; frame++)
      await new Promise(requestAnimationFrame)
    return tracked.offscreenHeartPasses
  })
  expect(passes).toBe(0)
})
