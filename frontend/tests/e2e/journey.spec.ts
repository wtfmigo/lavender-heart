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
      await page.locator(`#${id}`).evaluate((section, offset) => {
        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY + offset,
          behavior: 'instant',
        })
      }, 100)
      if (id === 'memory' && width < 1024)
        await page.locator('.full-memory-copy').evaluate((element) =>
          window.scrollTo({
            top:
              element.getBoundingClientRect().top +
              window.scrollY -
              window.innerHeight * 0.2,
            behavior: 'instant',
          }),
        )
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
        .toBeCloseTo(id === 'finale' ? 1 : 0, 1)
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

test('desktop Story pans through measured panels and restores the first panel on reverse', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const stage = page.locator('.story-stage')
  const track = page.locator('.story-track')
  await expect(stage).not.toHaveAttribute('data-story-flow', 'vertical')
  const geometry = await stage.evaluate((element) => ({
    start: element.getBoundingClientRect().top + window.scrollY,
    travel:
      element.querySelector('.story-track')!.scrollWidth - element.clientWidth,
  }))
  async function pan(progress: number) {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      geometry.start + geometry.travel * progress,
    )
    await expect
      .poll(() =>
        track.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m41,
        ),
      )
      .toBeCloseTo(-geometry.travel * progress, -1)
  }
  await pan(0)
  await expect(page.locator('.story-spread').first()).toBeInViewport()
  await pan(0.5)
  await pan(1)
  await expect(page.locator('.story-spread').last()).toBeInViewport()
  await pan(0)
  await expect(page.locator('.story-spread').first()).toBeInViewport()
})

test('desktop Love stages a single statement and reverses through measured vertical travel', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const stage = page.locator('.love-stage')
  const sequence = page.locator('.love-sequence')
  await expect(stage).not.toHaveAttribute('data-love-flow', 'vertical')
  const geometry = await stage.evaluate((element) => ({
    start: element.getBoundingClientRect().top + window.scrollY,
    travel:
      element.querySelector('.love-sequence')!.scrollHeight -
      element.clientHeight,
    count: element.querySelectorAll('.love-entry').length,
  }))
  for (const index of [
    0,
    Math.floor(geometry.count / 2),
    geometry.count - 1,
    0,
  ]) {
    const progress = index / (geometry.count - 1)
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: 'instant' }),
      geometry.start + geometry.travel * progress,
    )
    await expect
      .poll(() =>
        sequence.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        ),
      )
      .toBeCloseTo(-geometry.travel * progress, -1)
    await expect(page.locator('.love-entry').nth(index)).toBeInViewport({
      ratio: 0.9,
    })
    expect(
      await page.locator('.love-entry').evaluateAll(
        (elements) =>
          elements.filter((element) => {
            const bounds = element.getBoundingClientRect()
            return (
              Math.max(
                0,
                Math.min(window.innerHeight, bounds.bottom) -
                  Math.max(0, bounds.top),
              ) /
                bounds.height >
              0.7
            )
          }).length,
      ),
    ).toBe(1)
  }
})

test('late overflow rebuilds downstream pins and Finale after Story and Love return to native flow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await expect(page.locator('.story-stage')).not.toHaveAttribute(
    'data-story-flow',
    'vertical',
  )
  await page.addStyleTag({
    content:
      '.story-spread:first-child .memory-message { min-height: 1200px; }',
  })
  await page.evaluate(() => window.dispatchEvent(new Event('resize')))
  await expect(page.locator('.story-stage')).toHaveAttribute(
    'data-story-flow',
    'vertical',
  )
  const love = await page.locator('.love-stage').evaluate((element) => ({
    top: element.getBoundingClientRect().top + window.scrollY,
    travel:
      element.querySelector('.love-sequence')!.scrollHeight -
      element.clientHeight,
  }))
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    love.top + love.travel / 2,
  )
  await expect
    .poll(() =>
      page
        .locator('.love-sequence')
        .evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        ),
    )
    .toBeCloseTo(-love.travel / 2, -1)
  await page.addStyleTag({
    content: '.love-entry:first-child > div { min-height: 1200px; }',
  })
  await page.evaluate(() => window.dispatchEvent(new Event('resize')))
  await expect(page.locator('.love-stage')).toHaveAttribute(
    'data-love-flow',
    'vertical',
  )
  await page.locator('#finale').evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY + 100,
      behavior: 'instant',
    }),
  )
  const heart = page.locator('.persistent-heart')
  await expect
    .poll(() =>
      heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeCloseTo(1, 1)
  await expect
    .poll(() =>
      heart.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return bounds.left + bounds.width / 2
      }),
    )
    .toBeCloseTo(720, 0)
})

test('phone heart remains centered at introductions and fades during reading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const heart = page.locator('.persistent-heart')
  async function position(selector: string, offset = 0) {
    await page
      .locator(selector)
      .first()
      .evaluate(
        (element, extra) =>
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY + extra,
            behavior: 'instant',
          }),
        offset,
      )
  }
  async function opacity(value: number) {
    await expect
      .poll(() =>
        heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeCloseTo(value, 1)
  }
  for (const id of ['story', 'timeline']) {
    await position(`#${id}`)
    await expect
      .poll(() =>
        heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0.3)
  }
  for (const selector of [
    '.timeline-moment',
    '.timeline-moment:nth-child(2)',
    '.love-entry',
  ]) {
    for (const offset of [0, 100]) {
      await position(selector, offset)
      await page.waitForTimeout(350)
      expect(
        await heart.evaluate((element) => {
          if (Number(getComputedStyle(element).opacity) <= 0.04) return false
          const heartBounds = element.getBoundingClientRect()
          return [
            ...document.querySelectorAll(
              '.timeline-date time, .timeline-content img, .love-entry h3',
            ),
          ].some((content) => {
            const bounds = content.getBoundingClientRect()
            return (
              heartBounds.left < bounds.right &&
              heartBounds.right > bounds.left &&
              heartBounds.top < bounds.bottom &&
              heartBounds.bottom > bounds.top
            )
          })
        }),
      ).toBe(false)
    }
  }
  await position('.timeline-content', 100)
  await opacity(0)
  await position('#gallery')
  await opacity(0)
  await expect(page.locator('canvas')).toHaveCount(1)
})
