import { expect, test } from '@playwright/test'

for (const chapter of ['home', 'collection']) {
  for (const width of [1440, 390]) {
    test(`cloud passage after ${chapter} fills the transition and reverses at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
        timeout: 15000,
      })
      await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
      const passage = page.locator(
        chapter === 'home'
          ? '#home .hero-cloud-passage'
          : '.collection-cloud-passage',
      )
      await expect(passage).toHaveCount(1)
      const top = await passage.evaluate(
        (element) => element.getBoundingClientRect().top + window.scrollY,
      )
      const cloud = passage.locator('.cloud-passage-bank').first()
      const jump = async (offset: number) => {
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: 'instant' }),
          top + offset,
        )
        await page.waitForTimeout(1000)
        return cloud.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        )
      }
      const first = await jump(-300)
      expect(await jump(180)).not.toBe(first)
      expect(await jump(-300)).toBeCloseTo(first, 0)
      await jump(0)
      const box = (await passage.boundingBox())!
      expect(box.width).toBe(width)
      expect(box.height).toBeGreaterThanOrEqual(900)
      await page.screenshot({
        path: `../docs/evidence/atmosphere-tuning/${width}-${chapter === 'home' ? '' : 'collection-'}cloud-passage.png`,
      })
      await page.getByRole('button', { name: 'Pause motion' }).focus()
      await page.getByRole('button', { name: 'Pause motion' }).click()
      await expect(passage).toBeHidden()
      await page.getByRole('button', { name: 'Resume motion' }).click()
      await expect(passage).toHaveCSS('display', 'block')
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await expect(passage).toBeHidden()
    })
  }
}
