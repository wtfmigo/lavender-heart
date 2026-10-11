import { expect, type Page } from '@playwright/test'

export async function readStoryPanel(page: Page, index: number) {
  const stage = page.locator('.story-stage')
  const panel = page.locator('.story-spread').nth(index)
  if ((await stage.getAttribute('data-story-flow')) === 'horizontal') {
    await stage.evaluate(
      (element, index) =>
        window.scrollTo({
          top:
            scrollY + element.getBoundingClientRect().top + index * innerWidth,
          behavior: 'instant',
        }),
      index,
    )
    await expect
      .poll(() =>
        panel.evaluate((element) =>
          Math.abs(element.getBoundingClientRect().left),
        ),
      )
      .toBeLessThan(3)
  } else await panel.scrollIntoViewIfNeeded()
  await expect(panel.locator('h3')).toBeInViewport()
}
