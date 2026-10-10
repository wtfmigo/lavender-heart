import { expect, test } from '@playwright/test'

test('the rendered heart keeps a broad silhouette through forward and reverse scroll', async ({
  page,
}) => {
  test.setTimeout(90000)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  const story = await page.locator('.story-stage').evaluate((element) => ({
    start: element.getBoundingClientRect().top + window.scrollY,
    travel:
      element.querySelector('.story-track')!.scrollWidth - element.clientWidth,
  }))
  const intro = await page
    .locator('#intro')
    .evaluate((element) => element.getBoundingClientRect().top + window.scrollY)
  const finale = await page
    .locator('#finale')
    .evaluate((element) => element.getBoundingClientRect().top + window.scrollY)
  for (const top of [
    0,
    intro,
    story.start,
    story.start + story.travel / 2,
    story.start + story.travel,
    finale,
    story.start + story.travel / 2,
    intro,
    0,
  ]) {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      top,
    )
    await page.waitForTimeout(1100)
    const silhouette = await canvas.evaluate(
      (element: HTMLCanvasElement) =>
        new Promise<{ ratio: number; clipped: boolean }>((resolve) =>
          requestAnimationFrame(() => {
            const gl = element.getContext('webgl2')!
            const pixels = new Uint8Array(element.width * element.height * 4)
            gl.readPixels(
              0,
              0,
              element.width,
              element.height,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              pixels,
            )
            let left = element.width,
              right = 0,
              top = element.height,
              bottom = 0
            for (let y = 0; y < element.height; y++)
              for (let x = 0; x < element.width; x++) {
                if (pixels[(y * element.width + x) * 4 + 3] > 16) {
                  left = Math.min(left, x)
                  right = Math.max(right, x)
                  top = Math.min(top, y)
                  bottom = Math.max(bottom, y)
                }
              }
            resolve({
              ratio:
                right > left && bottom > top
                  ? (right - left) / (bottom - top)
                  : 0,
              clipped:
                left === 0 ||
                top === 0 ||
                right === element.width - 1 ||
                bottom === element.height - 1,
            })
          }),
        ),
    )
    expect(
      silhouette.ratio,
      `Front silhouette at scroll ${top}`,
    ).toBeGreaterThan(0.65)
    expect(silhouette.clipped).toBe(false)
  }
})
