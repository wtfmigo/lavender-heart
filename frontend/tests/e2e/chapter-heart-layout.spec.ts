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
    .toBe('hidden')
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
        path: `../docs/evidence/atmosphere-tuning/${width}-${id}-heart.png`,
      })
    }
    await page.locator('.timeline-content').first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    expect((await heart.boundingBox())!.width).toBeLessThan(400)
    const coversContent = () =>
      heart.evaluate((element) => {
        if (
          Number(getComputedStyle(element).opacity) <= 0.04 ||
          getComputedStyle(element.querySelector('.heart-reveal')!)
            .visibility === 'hidden'
        )
          return []
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
      path: `../docs/evidence/atmosphere-tuning/${width}-timeline-reading.png`,
    })
    await page
      .locator('.timeline-moment:nth-child(2) .timeline-content')
      .scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)
    expect(await coversContent()).toEqual([])
    await page.screenshot({
      path: `../docs/evidence/atmosphere-tuning/${width}-timeline-reading-even.png`,
    })
  })
}
