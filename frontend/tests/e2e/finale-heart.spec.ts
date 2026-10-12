import { expect, test } from './experienceTest.js'

for (const width of [1864, 390]) {
  for (const reduced of [false, true])
    test(`finale heart stays above the message at ${width}px with reduced motion ${reduced}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 968 })
      await page.emulateMedia({
        reducedMotion: reduced ? 'reduce' : 'no-preference',
      })
      await page.goto('/')
      await expect(page.locator('#finale')).toBeAttached()
      await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
      const space = page.locator('.finale-heart-space')
      const heart = page.locator(
        reduced ? '.finale-static-heart' : '.persistent-heart',
      )
      for (const height of [968, 844]) {
        await page.setViewportSize({ width, height })
        await page.locator('#finale').evaluate((node) =>
          scrollTo({
            top: scrollY + node.getBoundingClientRect().top,
            behavior: 'instant',
          }),
        )
        if (reduced) await expect(heart.locator('svg')).toBeVisible()
        else
          await expect
            .poll(() =>
              heart.evaluate((node) => Number(getComputedStyle(node).opacity)),
            )
            .toBeGreaterThan(0.99)
        await expect
          .poll(async () => {
            const frame = (await heart.boundingBox())!
            const reserved = (await space.boundingBox())!
            return (
              frame.y >= reserved.y - 2 &&
              frame.y + frame.height <= reserved.y + reserved.height + 2
            )
          })
          .toBe(true)
        const frame = (await heart.boundingBox())!
        const reserved = (await space.boundingBox())!
        const copy = (await page.locator('.finale-message').boundingBox())!
        expect(frame.y).toBeGreaterThanOrEqual(reserved.y - 2)
        expect(frame.y + frame.height).toBeLessThanOrEqual(
          reserved.y + reserved.height + 2,
        )
        expect(frame.y + frame.height).toBeLessThan(copy.y)
      }
    })
}
