import { expect, test } from '@playwright/test'

test('the rendered heart changes chapter scale and returns with an unclipped silhouette', async ({
  page,
}) => {
  test.setTimeout(90000)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  const heart = page.locator('.persistent-heart')
  const intro = await page
    .locator('#intro')
    .evaluate((element) => element.getBoundingClientRect().top + window.scrollY)
  const finale = await page
    .locator('#finale')
    .evaluate((element) => element.getBoundingClientRect().top + window.scrollY)
  const buffer = await canvas.evaluate((element: HTMLCanvasElement) => ({
    width: element.width,
    height: element.height,
  }))
  const ratios: number[] = []
  const scales: number[] = []
  for (const top of [0, intro, finale, intro, 0]) {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      top,
    )
    await page.waitForTimeout(1100)
    await expect
      .poll(() =>
        heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0.5)
    scales.push(
      await heart.evaluate(
        (element) =>
          new DOMMatrixReadOnly(getComputedStyle(element).transform).m11,
      ),
    )
    expect(
      await canvas.evaluate((element: HTMLCanvasElement) => ({
        width: element.width,
        height: element.height,
      })),
    ).toEqual(buffer)
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
    ratios.push(silhouette.ratio)
  }
  expect(scales[0]).toBeGreaterThan(scales[1] * 2)
  expect(scales[2]).toBeGreaterThan(scales[1] * 2)
  expect(scales[3]).toBeCloseTo(scales[1], 2)
  expect(scales[4]).toBeCloseTo(scales[0], 2)
  expect(ratios[4]).toBeCloseTo(ratios[0], 1)
  await expect(page.locator('#finale')).toHaveAttribute(
    'data-live-heart',
    'true',
  )
  await test.info().attach('rendered-heart-silhouettes', {
    body: JSON.stringify(ratios),
    contentType: 'application/json',
  })
})
