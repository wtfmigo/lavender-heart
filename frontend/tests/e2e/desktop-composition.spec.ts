import { expect, test } from '@playwright/test'

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
    await intro.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        intro.evaluate((element) =>
          element
            .getAnimations()
            .some((animation) => animation.playState === 'running'),
        ),
      )
      .toBe(true)
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .focus()
    await page
      .getByRole('button', { name: 'Pause motion', exact: true })
      .click()
    await expect(intro).toHaveCSS('opacity', '1')
    await expect
      .poll(() => intro.evaluate((element) => element.getAnimations().length))
      .toBe(0)
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

test('chapter hearts animate only while visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  const heart = page.locator('.chapter-heart').first()
  await heart.scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      heart
        .locator('svg')
        .evaluate((element) => element.getAnimations().length),
    )
    .toBe(1)
  await page.locator('.photo-galaxy').scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      heart
        .locator('svg')
        .evaluate((element) => element.getAnimations().length),
    )
    .toBe(0)
})
