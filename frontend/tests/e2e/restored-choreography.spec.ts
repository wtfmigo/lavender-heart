import { expect, test } from '@playwright/test'
import { readStoryPanel } from './storyPosition.js'

test('photo captions keep their reveal range after a same-orientation height resize', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await page.setViewportSize({ width: 1440, height: 650 })
  await page.waitForTimeout(350)
  const caption = page.locator('.timeline-copy > p').first()
  await caption.evaluate((node) => {
    const top =
      scrollY +
      node.getBoundingClientRect().top -
      new DOMMatrix(getComputedStyle(node).transform).m42
    scrollTo({ top: top - innerHeight * 0.8, behavior: 'instant' })
  })
  await page.waitForTimeout(650)
  const opacity = await caption.evaluate((node) =>
    Number(getComputedStyle(node).opacity),
  )
  expect(opacity).toBeGreaterThan(0.4)
  expect(opacity).toBeLessThan(0.7)
})

for (const [width, height] of [
  [1440, 900],
  [440, 956],
  [956, 440],
  [768, 1024],
  [1024, 768],
]) {
  test(`original choreography remains active at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await expect
      .poll(() =>
        page.locator('.persistent-heart').evaluate((node) => {
          const rect = node.getBoundingClientRect()
          return rect.left + rect.width / 2
        }),
      )
      .toBeCloseTo(width / 2, 0)
    const cloud = page.locator('.cloud-layer--foreground')
    const before = await cloud.evaluate(
      (node) => getComputedStyle(node).transform,
    )
    await page.mouse.wheel(0, height * 0.35)
    await expect
      .poll(() => cloud.evaluate((node) => getComputedStyle(node).transform))
      .not.toBe(before)
    await expect
      .poll(() =>
        page
          .locator('.hero-type-travel')
          .evaluate((node) => getComputedStyle(node).clipPath),
      )
      .not.toBe('none')
    await readStoryPanel(page, 2)
    await expect(page.locator('.story-memory').nth(2)).toHaveCSS(
      'clip-path',
      /^inset\(0%(?: 0%){0,3}\)$/,
    )
    const storyDepth = await page
      .locator('.story-spread')
      .nth(2)
      .evaluate((node) => node.style.getPropertyValue('--story-depth'))
    const storyPhoto = page
      .locator('.story-spread')
      .nth(2)
      .locator('.chapter-photo')
    const photoTravel = await storyPhoto.evaluate(
      (node) => getComputedStyle(node).translate,
    )
    await readStoryPanel(page, 3)
    await expect
      .poll(() =>
        storyPhoto.evaluate((node) => getComputedStyle(node).translate),
      )
      .not.toBe(photoTravel)
    await expect
      .poll(() =>
        page
          .locator('.story-spread')
          .nth(2)
          .evaluate((node) => node.style.getPropertyValue('--story-depth')),
      )
      .not.toBe(storyDepth)
    const memory = page.locator('.memory-depth')
    const top = await page
      .locator('#memory')
      .evaluate((node) => scrollY + node.getBoundingClientRect().top)
    await page.evaluate(
      (top) => scrollTo({ top, behavior: 'instant' }),
      top - height * 0.65,
    )
    await expect
      .poll(() =>
        memory.evaluate(
          (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m11,
        ),
      )
      .toBeGreaterThan(1.01)
    const loveStage = page.locator('.love-stage')
    await expect(loveStage).toHaveAttribute('data-love-flow', 'staged')
    await loveStage.evaluate((node) =>
      scrollTo({
        top:
          scrollY +
          node.getBoundingClientRect().top +
          node.querySelector<HTMLElement>('.love-window')!.clientHeight,
        behavior: 'instant',
      }),
    )
    const statement = page.locator('.love-entry').nth(1).locator('h3')
    await expect(statement).toBeInViewport()
    await expect
      .poll(() =>
        statement.evaluate((node) =>
          Number(getComputedStyle(node.parentElement!).opacity),
        ),
      )
      .toBeGreaterThan(0.99)
    const finale = page.locator('#finale')
    await finale.evaluate((node) =>
      scrollTo({
        top: scrollY + node.getBoundingClientRect().top,
        behavior: 'instant',
      }),
    )
    await expect(finale).toHaveAttribute('data-live-heart', 'true')
    await expect
      .poll(() =>
        page
          .locator('.persistent-heart')
          .evaluate((node) => Number(getComputedStyle(node).opacity)),
      )
      .toBeGreaterThan(0.9)
    await expect(page.locator('.persistent-heart')).toBeInViewport()
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .focus()
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .click()
    await expect(cloud).toHaveCSS('transform', 'none')
    await expect(memory).toHaveCSS('transform', 'none')
    await expect(finale).not.toHaveAttribute('data-live-heart', 'true')
  })
}

test('personal photos continue moving after their entrance without cropping their inner image', async ({
  page,
}) => {
  await page.setViewportSize({ width: 440, height: 956 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const frame = page.locator('.timeline-content .chapter-photo').first()
  const top = await frame.evaluate(
    (node) => scrollY + node.getBoundingClientRect().top,
  )
  await page.evaluate(
    (top) => scrollTo({ top, behavior: 'instant' }),
    top - 956 * 0.4,
  )
  await expect(frame).toHaveCSS('opacity', '1')
  const before = await frame.evaluate(
    (node) => getComputedStyle(node).translate,
  )
  await page.mouse.wheel(0, 150)
  await expect
    .poll(() => frame.evaluate((node) => getComputedStyle(node).translate))
    .not.toBe(before)
  await expect(frame.locator('img')).toHaveCSS('transform', 'none')
})

test('the rendered heart shows its side during scroll and resumes without catch-up spins', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  const positions = await page.evaluate(() => {
    const start =
      scrollY + document.querySelector('#story')!.getBoundingClientRect().top
    const end =
      scrollY + document.querySelector('#memory')!.getBoundingClientRect().top
    return [start, start + (end - start) / 4]
  })
  const widths = (count = 1) =>
    canvas.evaluate(async (node: HTMLCanvasElement, count) => {
      const gl = node.getContext('webgl2')!
      const pixels = new Uint8Array(node.width * node.height * 4)
      const samples: number[] = []
      for (let sample = 0; sample < count; sample++) {
        await new Promise(requestAnimationFrame)
        gl.readPixels(
          0,
          0,
          node.width,
          node.height,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          pixels,
        )
        let left = node.width,
          right = 0
        for (let y = 0; y < node.height; y++)
          for (let x = 0; x < node.width; x++) {
            if (pixels[(y * node.width + x) * 4 + 3] > 16) {
              left = Math.min(left, x)
              right = Math.max(right, x)
            }
          }
        samples.push(right - left)
      }
      return samples
    }, count)
  await page.evaluate(
    (top) => scrollTo({ top, behavior: 'instant' }),
    positions[0],
  )
  await page.waitForTimeout(1100)
  const [front] = await widths()
  await page.evaluate(
    (top) => scrollTo({ top, behavior: 'instant' }),
    positions[1],
  )
  await page.waitForTimeout(1100)
  const [side] = await widths()
  expect(side).toBeGreaterThan(0)
  expect(side).toBeLessThan(front * 0.8)
  await page.evaluate(
    (top) => scrollTo({ top, behavior: 'instant' }),
    positions[0],
  )
  await page.waitForTimeout(1100)
  expect((await widths())[0]).toBeGreaterThan(front * 0.95)
  await page.evaluate(
    (top) => scrollTo({ top, behavior: 'instant' }),
    positions[1],
  )
  await page.waitForTimeout(1100)
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click()
  await page.getByRole('button', { name: 'Resume motion', exact: true }).click()
  const resumed = await widths(8)
  expect(Math.min(...resumed)).toBeGreaterThan(0)
  expect(Math.max(...resumed) - Math.min(...resumed)).toBeLessThan(front * 0.1)
})
