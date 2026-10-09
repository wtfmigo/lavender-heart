import { expect, test } from '@playwright/test'

for (const width of [1864, 390]) {
  test(`finale heart stays in its reserved space as the message scrolls at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(60000)
    await page.setViewportSize({ width, height: 968 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
      timeout: 15000,
    })
    const space = page.locator('.finale-heart-space')
    const message = page.locator('.finale-message')
    const heart = page.locator('.persistent-heart')
    await page.evaluate(() => document.fonts.ready)
    await page.locator('#finale').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    const top = await space.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    )
    const entry = await page
      .locator('#finale')
      .evaluate(
        (element) =>
          element.getBoundingClientRect().top +
          window.scrollY -
          window.innerHeight * 0.1,
      )
    let previousCenter = 0
    for (const y of [entry - 2, entry + 2, entry - 2]) {
      await page.evaluate(
        (value) => window.scrollTo({ top: value, behavior: 'instant' }),
        y,
      )
      await page.waitForTimeout(1000)
      const frame = (await heart.boundingBox())!
      const center = frame.y + frame.height / 2
      if (previousCenter)
        expect(
          Math.abs(center - previousCenter),
          JSON.stringify(
            await heart.evaluate((element) => ({
              top: element.style.top,
              offsetTop: (element as HTMLElement).offsetTop,
              transform: element.style.transform,
              scroll: window.scrollY,
              spaceOffset: (
                document.querySelector('.finale-heart-space') as HTMLElement
              ).offsetTop,
              spaceParent: (
                document.querySelector('.finale-heart-space') as HTMLElement
              ).offsetParent?.className,
            })),
          ),
        ).toBeLessThan(10)
      previousCenter = center
    }
    for (const offset of [360, 160, 0, 160, 360]) {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: 'instant' }),
        top + offset,
      )
      await page.waitForTimeout(1200)
      const frame = (await heart.boundingBox())!
      const reserved = (await space.boundingBox())!
      const copy = (await message.boundingBox())!
      expect(frame.y + frame.height).toBeLessThan(copy.y)
      expect(frame.y).toBeGreaterThanOrEqual(reserved.y - 2)
      expect(frame.y + frame.height).toBeLessThanOrEqual(
        reserved.y + reserved.height + 2,
      )
    }
    await page.screenshot({
      path: `test-results/finale-agent/screenshots/${width}-finale-heart-reading.png`,
    })
    await page.setViewportSize({ width, height: 844 })
    await page.waitForTimeout(1200)
    let reserved = (await space.boundingBox())!
    let frame = (await heart.boundingBox())!
    expect(frame.y).toBeGreaterThanOrEqual(reserved.y - 2)
    expect(frame.y + frame.height).toBeLessThanOrEqual(
      reserved.y + reserved.height + 2,
    )
    await page.getByRole('button', { name: 'Pause motion' }).focus()
    await page.getByRole('button', { name: 'Pause motion' }).click()
    reserved = (await space.boundingBox())!
    frame = (await page.locator('.finale-static-heart').boundingBox())!
    expect(frame.y).toBeGreaterThanOrEqual(reserved.y - 2)
    expect(frame.y + frame.height).toBeLessThanOrEqual(
      reserved.y + reserved.height + 2,
    )
  })
}
