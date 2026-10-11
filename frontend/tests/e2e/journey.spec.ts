import { expect, test } from '@playwright/test'
import content from '../../public/content/experience.json' with { type: 'json' }

test('hidden chapters and empty collections have no navigation or animation targets', async ({
  page,
}) => {
  const data = structuredClone(content)
  data.sections.find((section) => section.key === 'intro')!.visible = false
  data.sections.find((section) => section.key === 'birthday_letter')!.visible =
    false
  data.gallery = []
  data.story.reverse()
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.route('**/content/experience.json', (route) =>
    route.fulfill({ json: data }),
  )
  await page.goto('/')
  await expect(page.locator('#story')).toBeVisible()
  await expect(page.locator('#intro, #gallery, #letter')).toHaveCount(0)
  await expect(page.locator('.scroll-cue')).toHaveAttribute('href', '#story')
  await expect(
    page
      .getByRole('navigation')
      .locator('a[href="#intro"], a[href="#gallery"], a[href="#letter"]'),
  ).toHaveCount(0)
  await expect(page.locator('.story-copy h3').first()).toHaveText(
    [...data.story].sort((a, b) => a.position - b.position)[0].title,
  )
  await page.locator('#finale').scrollIntoViewIfNeeded()
  await expect(page.locator('#finale')).toBeInViewport()
  expect(errors).toEqual([])
})

test('reduced motion exposes all nine chapters and every story memory in vertical flow', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-motion',
    'reduced',
  )
  for (const id of [
    'home',
    'intro',
    'story',
    'memory',
    'gallery',
    'love',
    'timeline',
    'letter',
    'finale',
  ]) {
    await expect(page.locator(`#${id}`)).toBeAttached()
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await expect(page.locator(`#${id}`)).toBeInViewport()
  }
  expect(
    await page
      .locator('.story-track')
      .evaluate((element) => getComputedStyle(element).display),
  ).toBe('block')
  await expect(page.locator('.story-copy h3')).toHaveCount(8)
  await expect(page.locator('.finale-static-heart')).toBeVisible()
})

test('late long content stays reachable without rebuilding pins', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await page.addStyleTag({
    content:
      '.story-spread:first-child .memory-message, .love-entry:first-child > div { min-height: 1200px; }',
  })
  for (const selector of ['.story-spread', '.love-entry', '#finale']) {
    const target = page.locator(selector).last()
    await target.scrollIntoViewIfNeeded()
    await expect(target).toBeInViewport()
  }
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    1440,
  )
})
