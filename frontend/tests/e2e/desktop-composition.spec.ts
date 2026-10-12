import { expect, test } from './experienceTest.js'
import { readStoryPanel } from './storyPosition.js'

for (const [width, height] of [
  [375, 667],
  [440, 956],
  [956, 440],
  [768, 1024],
  [1024, 768],
]) {
  test(`desktop composition and entrance motion persist at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await expect(page.locator('#finale')).toBeAttached()
    await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    for (const name of await page.locator('.hero h1 span').all()) {
      await expect(name).toBeInViewport({ ratio: 1 })
    }
    await expect(page.locator('.scroll-cue')).toBeInViewport({ ratio: 1 })
    const firstName = await page.locator('.hero h1 span').first().boundingBox()
    expect(firstName!.y / height).toBeLessThan(0.25)
    await expect(page.locator('.collection-opening')).toHaveCSS(
      'display',
      'grid',
    )
    await expect(page.locator('.collection-spread--air')).toHaveCSS(
      'display',
      'grid',
    )
    await expect(page.locator('.story-memory').first()).toHaveCSS(
      'display',
      'grid',
    )
    const positions = await page
      .locator('.story-memory')
      .first()
      .evaluate((element) => {
        const copy = element
          .querySelector('.story-copy')!
          .getBoundingClientRect()
        const photo = element
          .querySelector('.chapter-photo')!
          .getBoundingClientRect()
        return { copyRight: copy.right, photoLeft: photo.left }
      })
    expect(positions.copyRight).toBeLessThan(positions.photoLeft)
    const intro = page.locator('.intro-reading')
    const message = page.locator('.intro-message-wrap')
    await expect
      .poll(() =>
        message.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        ),
      )
      .toBeCloseTo(55, 1)
    await expect(message).toHaveCSS('clip-path', /100%/)
    await intro.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        message.evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        ),
      )
      .toBeCloseTo(0, 1)
    await expect(message).toHaveCSS(
      'clip-path',
      /^(?:none|inset\(0(?:px|%)(?: 0(?:px|%)){0,3}\))$/,
    )
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .focus()
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .click()
    await expect(intro).toHaveCSS('opacity', '1')
    await expect(message).toHaveCSS('transform', 'none')
    await expect(message).toHaveCSS('clip-path', 'none')
    await expect(page.locator('.hero-cloud-passage')).toHaveCount(0)
    const backdrop = page.locator('.photo-galaxy-backdrop')
    await expect(backdrop).toBeAttached()
    await expect(backdrop).toHaveCSS('pointer-events', 'none')
    for (const [name, selector] of [
      ['home', '#home'],
      ['story', '.story-spread'],
      ['photos', '.collection-opening'],
      ['sphere', '.photo-galaxy'],
    ]) {
      const region = page.locator(selector).first()
      await region.scrollIntoViewIfNeeded()
      await region.screenshot({
        path: `playwright-report/composition-${name}-${width}x${height}.png`,
      })
    }
  })
}

test('the live heart changes chapter scale and returns while gallery keeps its static motif', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const heart = page.locator('.persistent-heart')
  const scale = () =>
    heart.evaluate(
      (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).m11,
    )
  const heroScale = await scale()
  await expect(heart).toHaveCSS('opacity', '1')
  await readStoryPanel(page, 0)
  await expect(page.locator('#story')).toHaveAttribute(
    'data-live-heart',
    'true',
  )
  await expect(page.locator('#story .chapter-heart')).toBeHidden()
  await expect
    .poll(() =>
      heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeCloseTo(0.55, 2)
  await expect.poll(scale).toBeLessThan(heroScale / 2)
  await page.locator('.collection-opening').scrollIntoViewIfNeeded()
  await expect(page.locator('#gallery')).toHaveAttribute(
    'data-live-heart',
    'false',
  )
  await expect(page.locator('#gallery .chapter-heart svg')).toBeVisible()
  await expect
    .poll(() =>
      heart.evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeLessThan(0.05)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(heart).toHaveCSS('opacity', '1')
  await expect.poll(scale).toBeCloseTo(heroScale, 2)
})
