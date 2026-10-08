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
  await expect(page.locator('.story-copy h3').first()).toHaveText('Memory 01')
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

for (const width of [1440, 390]) {
  test(`heart restores its chapter position after reverse scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.locator('canvas[data-webgl="ready"]')).toBeVisible({
      timeout: 15000,
    })
    const heart = page.locator('.persistent-heart')
    async function jump(id: string) {
      await page.locator(`#${id}`).evaluate((section) => {
        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY + 100,
          behavior: 'instant',
        })
      })
    }
    for (const id of [
      'gallery',
      'finale',
      'gallery',
      'letter',
      'memory',
      'finale',
    ]) {
      await jump(id)
      await expect
        .poll(() =>
          heart.evaluate((element) =>
            Number(getComputedStyle(element).opacity),
          ),
        )
        .toBeCloseTo(
          id === 'finale' ? 1 : id === 'gallery' && width >= 1024 ? 0.75 : 0,
          1,
        )
      if (id === 'finale') {
        await expect
          .poll(() =>
            heart.evaluate(
              (element) =>
                element.getBoundingClientRect().x +
                element.getBoundingClientRect().width / 2,
            ),
          )
          .toBeCloseTo(width / 2, 0)
        const message = await page.locator('.finale-message').boundingBox()
        const sculpture = await heart.boundingBox()
        expect(sculpture!.y + sculpture!.height).toBeLessThan(message!.y)
      }
      await expect(page.locator('canvas')).toHaveCount(1)
    }
  })
}
