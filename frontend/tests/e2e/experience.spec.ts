import { expect, test } from '@playwright/test'

test('long supplied names remain readable during full-motion mobile scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.route('**/content/experience.json', async (route) => {
    const response = await route.fetch()
    await route.fulfill({
      response,
      body: (await response.text()).replace(
        'Jeriann Alexa',
        'Alexandra Maria Isabel de la Cruz Santos',
      ),
    })
  })
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText(
    'Alexandra Maria Isabel de la Cruz Santos',
  )
  await expect(page.locator('.opening')).toBeHidden({ timeout: 5000 })
  await page.locator('h1 span').last().scrollIntoViewIfNeeded()
  await expect(page.locator('.hero-type-travel')).toHaveCSS('opacity', '1')
  await expect(page.locator('.hero-type-travel')).toHaveCSS('clip-path', 'none')
  const bounds = await page.locator('h1').boundingBox()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
})

test('medium multi-part names use readable natural flow around the crystal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.route('**/content/experience.json', async (route) => {
    const response = await route.fetch()
    await route.fulfill({
      response,
      body: (await response.text()).replace(
        'Jeriann Alexa',
        'Alexandra Maria Isabel Lopez',
      ),
    })
  })
  await page.goto('/')
  await expect(page.locator('.hero')).toHaveAttribute('data-long-name', 'true')
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative')
  await expect(page.locator('h1')).toHaveText('Alexandra Maria Isabel Lopez')
  await page.locator('h1 span').last().scrollIntoViewIfNeeded()
  await expect(page.locator('.hero-type-travel')).toHaveCSS('clip-path', 'none')
})

test('cloud travel, implemented anchors, focus protection and motion pause', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('.experience')).toBeVisible()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 5000 })
  await expect(page.locator('[data-depth] img')).toHaveCount(4)
  expect(
    await page
      .getByRole('navigation')
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
  ).toEqual(['#home', '#intro', '#gallery', '#letter'])
  await page.evaluate(() => window.scrollTo(0, 500))
  await expect(page.getByRole('navigation')).toHaveAttribute(
    'data-hidden',
    'true',
  )
  const travel = await page
    .locator('.cloud-layer--foreground')
    .evaluate((element) => getComputedStyle(element).transform)
  expect(travel).not.toBe('none')
  await page.getByRole('link', { name: 'Intro', exact: true }).focus()
  await expect(page.getByRole('navigation')).toHaveAttribute(
    'data-hidden',
    'false',
  )
  await page.evaluate(() => window.scrollTo(0, 650))
  await expect(page.getByRole('navigation')).toHaveAttribute(
    'data-hidden',
    'false',
  )
  await page.getByRole('link', { name: 'Intro', exact: true }).press('Enter')
  await expect(page).toHaveURL(/#intro$/)
  await expect(page.locator('#intro h2')).toBeVisible()
  await page.getByRole('button', { name: 'Pause motion' }).focus()
  await page.getByRole('button', { name: 'Pause motion' }).click()
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-motion',
    'reduced',
  )
  await expect(
    page.getByRole('button', { name: 'Resume motion' }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('reduced motion is immediate and follows changes live', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-motion',
    'reduced',
  )
  await expect(page.locator('.opening')).toBeHidden()
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative')
  await expect(page.locator('.cloud-layer--foreground')).toHaveCSS(
    'transform',
    'none',
  )
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-motion',
    'full',
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.cloud-layer--foreground')).toHaveCSS(
    'transform',
    'none',
  )
})

test('blocked WebGL preserves clouds, original heart and text', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null
  })
  await page.goto('/')
  await expect(page.locator('.experience')).toBeVisible()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 5000 })
  await expect(
    page.locator('.persistent-heart').getByTestId('heart-fallback').last(),
  ).toBeVisible()
  await expect(page.locator('.cloud-layer--foreground img')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Jeriann Alexa',
  )
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.heart-reveal')).toHaveCSS('opacity', '1')
  await expect(page.locator('.hero-type-reveal')).toHaveCSS('opacity', '1')
  await page.screenshot({
    path: '../docs/evidence/recomposition/after/fallback-mobile.png',
  })
})

test('context loss replaces the canvas with the heart fallback', async ({
  page,
}) => {
  await page.goto('/')
  const canvas = page.locator('canvas[data-webgl="ready"]')
  await expect(canvas).toBeVisible({ timeout: 15000 })
  await canvas.evaluate((element) =>
    element.dispatchEvent(new Event('webglcontextlost', { cancelable: true })),
  )
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(
    page.locator('.persistent-heart').getByTestId('heart-fallback').last(),
  ).toBeVisible()
})

test('failed crystal backdrop preserves the static heart and supplied name', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      if (args[0] === '2d') return null
      return Reflect.apply(original, this, args)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('.experience')).toBeVisible()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 5000 })
  await expect(
    page.locator('.persistent-heart').getByTestId('heart-fallback').last(),
  ).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Jeriann Alexa',
  )
})

for (const width of [1440, 1024, 768, 390, 320, 360]) {
  test(`composition remains within ${width}px and Intro is reachable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    await page.locator('.scroll-cue').click()
    await expect(page.locator('#intro h2')).toBeInViewport()
    await expect(page.locator('.cloud-layer--foreground img')).toBeAttached()
  })
}
