import { expect, test } from '@playwright/test'
import content from '../../public/content/experience.json' with { type: 'json' }
import { readStoryPanel } from './storyPosition.js'

for (const width of [1440, 390]) {
  test(`text-only memories keep the supporting heart small at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.route('**/content/experience.json', (route) =>
      route.fulfill({
        json: {
          ...content,
          story: content.story.map((memory) =>
            memory.id === 'memory-7' ? { ...memory, photo: null } : memory,
          ),
          timeline: content.timeline.map((moment) => ({
            ...moment,
            photo: null,
          })),
        },
      }),
    )
    await page.goto('/')
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    const memory = page.locator('.story-memory--text').first()
    const heart = page.locator('.persistent-heart')
    await readStoryPanel(page, 6)
    await expect(memory.locator('.story-copy')).toBeInViewport()
    await expect
      .poll(() =>
        heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeCloseTo(0.55, 2)
    await expect
      .poll(() =>
        heart.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeLessThanOrEqual(160)
    await page
      .locator('.timeline-content--text')
      .last()
      .scrollIntoViewIfNeeded()
    await expect(page.locator('.timeline-copy').last()).toBeInViewport()
    await expect
      .poll(() =>
        heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeLessThan(0.05)
  })
}
