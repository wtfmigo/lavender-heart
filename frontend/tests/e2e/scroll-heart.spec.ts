import { expect, test } from '@playwright/test'

test('closing heart keeps a broad recognizable silhouette at scroll stops', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1864, height: 968 })
  await page.goto('/')
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  for (const offset of [0, 75, 150]) {
    await page.evaluate(
      (offset) =>
        window.scrollTo({
          top:
            document.documentElement.scrollHeight - window.innerHeight - offset,
          behavior: 'instant',
        }),
      offset,
    )
    await page.waitForTimeout(900)
    const ratio = await canvas.evaluate(
      (e: HTMLCanvasElement) =>
        new Promise<number>((resolve) =>
          requestAnimationFrame(() => {
            const gl = e.getContext('webgl2')!
            const pixels = new Uint8Array(e.width * e.height * 4)
            gl.readPixels(
              0,
              0,
              e.width,
              e.height,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              pixels,
            )
            let left = e.width,
              right = 0,
              top = e.height,
              bottom = 0
            for (let y = 0; y < e.height; y++)
              for (let x = 0; x < e.width; x++) {
                if (pixels[(y * e.width + x) * 4 + 3] > 16) {
                  left = Math.min(left, x)
                  right = Math.max(right, x)
                  top = Math.min(top, y)
                  bottom = Math.max(bottom, y)
                }
              }
            resolve(
              right > left && bottom > top
                ? (right - left) / (bottom - top)
                : 0,
            )
          }),
        ),
    )
    expect(
      ratio,
      `Heart silhouette at ${offset}px from bottom`,
    ).toBeGreaterThan(0.8)
    if (offset === 0)
      await page.screenshot({
        path: '../docs/evidence/collection-scroll/finale-heart-fixed.png',
      })
  }
})

test('heart turns with scroll, stays still at rest, and reverses to the same pose', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible()
  const jump = async (offset: number) => {
    await page.locator('#intro').evaluate(
      (e, offset) =>
        window.scrollTo({
          top: e.getBoundingClientRect().top + window.scrollY + offset,
          behavior: 'instant',
        }),
      offset,
    )
    await page.waitForTimeout(1200)
  }
  await jump(0)
  const first = await canvas.screenshot()
  await page.waitForTimeout(700)
  expect((await canvas.screenshot()).equals(first), 'No idle rotation').toBe(
    true,
  )
  await jump(240)
  expect(
    (await canvas.screenshot()).equals(first),
    'Scroll changes the pose',
  ).toBe(false)
  await jump(0)
  expect(
    (await canvas.screenshot()).equals(first),
    'Reverse scroll restores the pose',
  ).toBe(true)
})
