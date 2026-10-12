import { expect, test } from './experienceTest.js'
import { readStoryPanel } from './storyPosition.js'

test('horizontal travel stays aligned when the sticky height is smaller than the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.addStyleTag({
    content:
      '.story-spread {min-height:700px;height:700px} .story-stage[data-story-flow="horizontal"] {height:calc(700px + var(--story-distance))} .story-stage[data-story-flow="horizontal"] .story-window {height:700px}',
  })
  await expect(page.locator('.story-stage')).toHaveAttribute(
    'data-story-flow',
    'horizontal',
  )
  await readStoryPanel(page, 3)
  await readStoryPanel(page, 7)
})

test('a smaller sticky viewport exposes oversized memories in vertical reading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const stage = page.locator('.story-stage')
  await expect(stage).toHaveAttribute('data-story-flow', 'horizontal')
  await page.addStyleTag({
    content:
      '.story-spread {min-height:700px;height:800px} .story-stage[data-story-flow="horizontal"] .story-window {height:700px}',
  })
  await expect(stage).toHaveAttribute('data-story-flow', 'vertical')
  const last = page.locator('.story-spread').last()
  await last.locator('h3').scrollIntoViewIfNeeded()
  await expect(last.locator('h3')).toBeInViewport()
})

test('pausing and resuming motion keeps the current story memory', async ({
  page,
}) => {
  await page.goto('/')
  await readStoryPanel(page, 3)
  const panel = page.locator('.story-spread').nth(3)
  for (const name of ['Pause motion', 'Resume motion']) {
    const button = page.getByRole('button', { name, exact: true })
    await button.focus()
    await button.click()
    await expect(panel).toBeInViewport({ ratio: 0.2 })
  }
})

test('manual horizontal fallback disables the native timeline animation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = CSS.supports.bind(CSS)
    CSS.supports = ((property: string, value?: string) =>
      property === 'animation-timeline'
        ? false
        : value === undefined
          ? original(property)
          : original(property, value)) as typeof CSS.supports
  })
  await page.goto('/')
  await expect(page.locator('.story-stage')).toHaveAttribute(
    'data-story-flow',
    'horizontal',
  )
  await expect(page.locator('.story-track')).toHaveCSS('animation-name', 'none')
  await readStoryPanel(page, 2)
})
