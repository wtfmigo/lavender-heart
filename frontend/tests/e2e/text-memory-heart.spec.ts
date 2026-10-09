import { expect, test } from '@playwright/test'

for (const vertical of [false, true]) {
  test(`large heart fills a photo-less Story panel in ${vertical ? 'vertical' : 'horizontal'} flow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1864, height: vertical ? 600 : 968 })
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
      timeout: 15000,
    })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1200)
    if (vertical)
      await expect(page.locator('.story-stage')).toHaveAttribute(
        'data-story-flow',
        'vertical',
      )
    else
      await expect(page.locator('.story-stage')).not.toHaveAttribute(
        'data-story-flow',
        'vertical',
      )
    const memory = page.locator('.story-memory--text').filter({
      has: page.getByRole('heading', { name: 'The day we became us' }),
    })
    const target = await memory.evaluate((element) => {
      const spread = element.closest('.story-spread')! as HTMLElement
      const stage = spread.closest('.story-stage')! as HTMLElement
      const track = spread.parentElement!
      return (
        stage.getBoundingClientRect().top +
        window.scrollY +
        (stage.dataset.storyFlow === 'vertical'
          ? spread.getBoundingClientRect().top -
            stage.getBoundingClientRect().top
          : spread.offsetLeft - (track as HTMLElement).offsetLeft)
      )
    })
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      target,
    )
    await page.waitForTimeout(1400)
    const heart = (await page.locator('.persistent-heart').boundingBox())!
    const copy = (await memory.locator('.story-copy').boundingBox())!
    expect(heart.width).toBeGreaterThan(400)
    expect(heart.x).toBeGreaterThan(copy.x + copy.width)
    expect(
      Math.abs(heart.y + heart.height / 2 - (vertical ? 600 : 968) / 2),
    ).toBeLessThan(20)
    await page.screenshot({
      path: `test-results/finale-agent/screenshots/story-text-heart-${vertical ? 'vertical' : 'horizontal'}.png`,
    })
  })
}

test('text-only Timeline memories reserve the right side for a large heart', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1864, height: 968 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const memory = page.locator('.timeline-content--text').last()
  await memory.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1400)
  const heart = (await page.locator('.persistent-heart').boundingBox())!
  const copy = (await memory.locator('.timeline-copy').boundingBox())!
  expect(heart.width).toBeGreaterThan(400)
  expect(heart.x).toBeGreaterThan(copy.x + copy.width)
  const date = page.locator(
    '.timeline-moment:nth-child(2) .timeline-date strong',
  )
  await date.evaluate((element) =>
    window.scrollTo({
      top:
        element.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight / 2,
      behavior: 'instant',
    }),
  )
  await page.waitForTimeout(1400)
  const companion = (await page.locator('.persistent-heart').boundingBox())!
  const dateFrame = (await date.boundingBox())!
  expect(companion.x).toBeGreaterThan(dateFrame.x + dateFrame.width)
})
