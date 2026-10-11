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
    await readStoryPanel(page, 6)
    await expect(memory.locator('.story-copy')).toBeInViewport()
    await expect(page.locator('.persistent-heart')).not.toBeInViewport()
    await page
      .locator('.timeline-content--text')
      .last()
      .scrollIntoViewIfNeeded()
    await expect(page.locator('.timeline-copy').last()).toBeInViewport()
    await expect(page.locator('.persistent-heart')).not.toBeInViewport()
  })
}
