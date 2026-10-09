import { expect, test } from '@playwright/test'
import content from '../../public/content/experience.json' with { type: 'json' }

test.setTimeout(60000)

test('the Timeline heart leaves long memory messages clear', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 968 })
  const data = structuredClone(content)
  data.timeline[0].message.blocks[0].children[0].text =
    'A longer memory message with details that should stay readable as the visitor scrolls. '.repeat(
      50,
    )
  await page.route('**/content/experience.json', (route) =>
    route.fulfill({ json: data }),
  )
  await page.goto('/')
  await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
    timeout: 15000,
  })
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await page.locator('.timeline-copy').first().scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      page
        .locator('.persistent-heart .heart-reveal')
        .evaluate((element) => getComputedStyle(element).visibility),
    )
    .toBe('visible')
  await expect
    .poll(() =>
      page
        .locator('.persistent-heart')
        .evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeGreaterThan(0.5)
  const heart = (await page.locator('.persistent-heart').boundingBox())!
  const copy = (await page.locator('.timeline-copy').first().boundingBox())!
  expect(heart.x).toBeGreaterThanOrEqual(copy.x + copy.width)
})

for (const width of [1024, 1440, 1864]) {
  test(`chapter hearts occupy the open space and recede for reading at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 968 })
    await page.goto('/')
    await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
      timeout: 15000,
    })
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    const heart = page.locator('.persistent-heart')
    for (const id of ['story', 'love', 'timeline']) {
      const scene = page.locator(`#${id} .chapter-scene`)
      await scene.evaluate((element) =>
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: 'instant',
        }),
      )
      await expect
        .poll(async () => (await heart.boundingBox())!.width)
        .toBeGreaterThan(width * 0.2)
      await page.waitForTimeout(1200)
      const box = (await heart.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width * 0.95 + 1)
      await page.screenshot({
        path: `test-results/chapter-hearts-agent/screenshots/${width}-${id}-heart.png`,
      })
    }
    const firstMemory = page.locator('.timeline-content').first()
    await firstMemory.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    const textOnly = await firstMemory.evaluate((element) =>
      element.classList.contains('timeline-content--text'),
    )
    if (textOnly)
      expect((await heart.boundingBox())!.width).toBeGreaterThan(200)
    else expect((await heart.boundingBox())!.width).toBeLessThan(200)
    const coversContent = () =>
      heart.evaluate((element) => {
        const heartBox = element.getBoundingClientRect()
        return [
          ...document.querySelectorAll(
            '.timeline-date strong, .timeline-content .photo-window, .timeline-copy',
          ),
        ]
          .filter((content) => {
            const box = content.getBoundingClientRect()
            return (
              heartBox.left < box.right &&
              heartBox.right > box.left &&
              heartBox.top < box.bottom &&
              heartBox.bottom > box.top
            )
          })
          .map(
            (content) =>
              `${content.className}: ${content.textContent?.slice(0, 25)} ${JSON.stringify(content.getBoundingClientRect().toJSON())}`,
          )
      })
    expect(await coversContent()).toEqual([])
    await page.screenshot({
      path: `test-results/chapter-hearts-agent/screenshots/${width}-timeline-reading.png`,
    })
    await page
      .locator('.timeline-moment:nth-child(2) .timeline-content')
      .scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    expect(await coversContent()).toEqual([])
    await page.screenshot({
      path: `test-results/chapter-hearts-agent/screenshots/${width}-timeline-reading-even.png`,
    })
  })
}

for (const width of [1024, 1440]) {
  test(`heart stays visible through Timeline, Letter and reverse scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 968 })
    await page.goto('/')
    await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
      timeout: 15000,
    })
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    for (const selector of [
      '.timeline-content',
      '.timeline-moment:nth-child(2) .timeline-content',
      '.timeline-moment:last-child .timeline-content',
      '#letter',
      '#finale',
      '#letter',
      '.timeline-content',
    ]) {
      await page
        .locator(selector)
        .first()
        .evaluate((element) =>
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY,
            behavior: 'instant',
          }),
        )
      await page.waitForTimeout(1000)
      const heart = page.locator('.persistent-heart')
      await expect
        .poll(() =>
          heart.evaluate((element) =>
            Number(getComputedStyle(element).opacity),
          ),
        )
        .toBeGreaterThan(0.5)
      await expect(heart.locator('.heart-reveal')).toBeVisible()
      expect(
        await heart
          .locator('.heart-reveal')
          .evaluate((element) => getComputedStyle(element).visibility),
      ).toBe('visible')
      await expect(page.locator('canvas')).toHaveCount(1)
    }
  })
}
