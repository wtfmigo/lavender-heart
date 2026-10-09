import { expect, test } from '@playwright/test'

for (const width of [1440, 1864, 390]) {
  test(`Home name stays clear of the rendered heart at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 968 })
    await page.goto('/')
    await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
      timeout: 15000,
    })
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await page.waitForTimeout(1500)
    const overlaps = await page.locator('canvas').evaluate(
      (canvas: HTMLCanvasElement) =>
        new Promise<number[]>((resolve, reject) =>
          requestAnimationFrame(() => {
            const gl = canvas.getContext('webgl2')!
            const pixels = new Uint8Array(canvas.width * canvas.height * 4)
            gl.readPixels(
              0,
              0,
              canvas.width,
              canvas.height,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              pixels,
            )
            if (!pixels.some((alpha, index) => index % 4 === 3 && alpha > 32)) {
              reject(
                new Error(
                  'The overlap check requires a visibly rendered heart',
                ),
              )
              return
            }
            const frame = canvas.getBoundingClientRect()
            resolve(
              [...document.querySelectorAll('#home h1 span')].map((word) => {
                const box = word.getBoundingClientRect()
                let ink = 0
                for (
                  let x = Math.max(
                    0,
                    Math.floor(
                      ((box.left - frame.left) / frame.width) * canvas.width,
                    ),
                  );
                  x <
                  Math.min(
                    canvas.width,
                    Math.ceil(
                      ((box.right - frame.left) / frame.width) * canvas.width,
                    ),
                  );
                  x++
                )
                  for (
                    let y = Math.max(
                      0,
                      Math.floor(
                        ((frame.bottom - box.bottom) / frame.height) *
                          canvas.height,
                      ),
                    );
                    y <
                    Math.min(
                      canvas.height,
                      Math.ceil(
                        ((frame.bottom - box.top) / frame.height) *
                          canvas.height,
                      ),
                    );
                    y++
                  )
                    if (pixels[(y * canvas.width + x) * 4 + 3] > 32) ink++
                return ink
              }),
            )
          }),
        ),
    )
    expect(overlaps).toEqual([0, 0])
    await page.screenshot({
      path: `../docs/evidence/atmosphere-tuning/${width}-personal-home.png`,
    })
  })
}

test('approved birthday text and real milestones appear in the gift', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Jeriann Alexa')
  await expect(page.locator('#letter h2')).toHaveText(
    'Happy Birthday, Jeriann Alexa',
  )
  await expect(page.locator('#letter')).toContainText('With all my love,')
  await expect(page.locator('#letter')).toContainText('Jalebong')
  for (const date of ['2025-05-18', '2025-05-29', '2025-07-17'])
    await expect(
      page.locator(`#timeline time[datetime="${date}"]`),
    ).toHaveCount(1)
  await expect(page.locator('#letter time')).toHaveAttribute(
    'datetime',
    '2026-10-09',
  )
  await expect(page.locator('#love')).toContainText('Your kind heart')
})
