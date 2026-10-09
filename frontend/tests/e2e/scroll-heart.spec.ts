import { expect, test } from '@playwright/test'

test('native wheel scroll turns smoothly in one direction', async ({
  page,
}) => {
  await page.goto('/')
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  await page.locator('#intro').evaluate((e) =>
    window.scrollTo({
      top: e.getBoundingClientRect().top + window.scrollY + 100,
      behavior: 'instant',
    }),
  )
  await page.waitForTimeout(1500)
  const sampling = canvas.evaluate(
    (e: HTMLCanvasElement) =>
      new Promise<number[][]>((resolve) => {
        const angles: number[][] = []
        const capture = () => {
          const gl = e.getContext('webgl2')!
          const program = gl.getParameter(gl.CURRENT_PROGRAM)
          const matrix = gl.getUniform(
            program,
            gl.getUniformLocation(program, 'modelViewMatrix')!,
          )
          angles.push([
            Math.atan2(matrix[8], matrix[0] / Math.cos(-0.08)),
            matrix[4] + matrix[0] * Math.tan(-0.08),
          ])
          if (angles.length < 45) requestAnimationFrame(capture)
          else resolve(angles)
        }
        requestAnimationFrame(capture)
      }),
  )
  await page.mouse.wheel(0, 300)
  const frames = await sampling
  expect(
    frames.every((frame) => Math.abs(frame[1]) < 0.001),
    'Heart stays upright during a horizontal turn',
  ).toBe(true)
  const angles = frames.map((frame) => frame[0])
  const changes = angles
    .slice(1)
    .map((angle, i) =>
      Math.atan2(Math.sin(angle - angles[i]), Math.cos(angle - angles[i])),
    )
  expect(
    changes.every((change) => change <= 0.01),
    'No backwards snaps during downward scroll',
  ).toBe(true)
  expect(
    changes.every((change) => Math.abs(change) < 0.3),
    'No abrupt angle jumps',
  ).toBe(true)
  expect(changes.reduce((sum, change) => sum + change, 0)).toBeLessThan(-0.1)
})

test('scroll makes a complete horizontal turn instead of rocking back and forth', async ({
  page,
}) => {
  test.setTimeout(120000)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  await expect(page.locator('.opening')).toBeHidden()
  await page.waitForTimeout(1800)
  const start = await page
    .locator('#intro')
    .evaluate((e) => e.getBoundingClientRect().top + window.scrollY + 120)
  const silhouette = async (scroll: number) => {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      scroll,
    )
    await page.waitForTimeout(900)
    const mask = await canvas.evaluate(
      (e: HTMLCanvasElement) =>
        new Promise<number[]>((resolve) =>
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
            resolve(
              Array.from({ length: e.width * e.height }, (_, i) =>
                pixels[i * 4 + 3] > 16 ? 1 : 0,
              ),
            )
          }),
        ),
    )
    const width = await canvas.evaluate((e: HTMLCanvasElement) => e.width)
    expect(
      mask.some((value) => value === 1),
      'Rendered heart exists',
    ).toBe(true)
    expect(
      mask.some(
        (value, i) =>
          value === 1 &&
          (i < width ||
            i >= mask.length - width ||
            i % width === 0 ||
            i % width === width - 1),
      ),
      'Heart fits at every turn angle',
    ).toBe(false)
    return mask
  }
  const original = await silhouette(start)
  const difference = (mask: number[]) =>
    mask.reduce((sum, value, i) => sum + Math.abs(value - original[i]), 0) /
    original.reduce((sum, value) => sum + value, 0)
  for (const quarter of [1, 2, 3, 4]) {
    const mask = await silhouette(start + (900 * quarter * Math.PI) / (2 * 1.8))
    if (quarter === 1) expect(difference(mask)).toBeGreaterThan(0.1)
    if (quarter === 4) expect(difference(mask)).toBeLessThan(0.025)
    await page.screenshot({
      path: `../docs/evidence/collection-scroll/horizontal-turn-${quarter}.png`,
    })
  }
})

test('closing heart stays visible through front and side views', async ({
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
    ).toBeGreaterThan(0.35)
    if (offset === 0) {
      expect(
        ratio,
        'The closing heart finishes facing forward',
      ).toBeGreaterThan(0.8)
      await page.screenshot({
        path: '../docs/evidence/collection-scroll/strong-front-finale.png',
      })
    }
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
