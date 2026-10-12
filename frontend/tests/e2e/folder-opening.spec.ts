import { expect, test } from '@playwright/test'
import content from '../../public/content/experience.json' with { type: 'json' }

test.use({ hasTouch: true })

for (const [width, height] of [
  [1440, 900],
  [390, 844],
  [844, 390],
  [568, 320],
  [768, 1024],
  [1024, 768],
]) {
  test(`the named folder waits for a click and opens Home at ${width}x${height}`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height })
    await page.goto('/')
    const button = page.getByRole('button', {
      name: `Open letter for ${content.settings.recipientName}`,
    })
    await expect(button).toBeVisible()
    await expect(button).toBeFocused()
    await expect(page.locator('.folder-tab')).toHaveText(
      content.settings.recipientName,
    )
    await expect(page.locator('.folder-letter-title')).toHaveText('Letter')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(0)
    await expect(page.locator('canvas')).toHaveCount(0)
    await page.waitForTimeout(2200)
    await expect(button).toBeVisible()
    await page.mouse.wheel(0, 600)
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
    await page.keyboard.press('Tab')
    await expect(button).toBeFocused()
    const box = await button.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    expect(box!.y).toBeGreaterThanOrEqual(0)
    expect(box!.y + box!.height).toBeLessThanOrEqual(height)
    await page.screenshot({ path: `test-results/folder-closed-${width}.png` })
    if (width < 600) await button.tap()
    else await page.keyboard.press('Enter')
    await expect(button).toBeDisabled()
    await expect(page.locator('.folder-opening')).toHaveAttribute(
      'data-opening',
      'true',
    )
    await page.waitForTimeout(450)
    await page.screenshot({ path: `test-results/folder-opening-${width}.png` })
    await expect(page.locator('.opening')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      content.settings.recipientName,
    )
    await expect(page.locator('#content')).toBeFocused()
    await expect(page.locator('.experience-content')).not.toHaveAttribute(
      'inert',
    )
    await expect(page.locator('#home')).toBeInViewport()
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
    await page.mouse.wheel(0, 400)
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
    expect(errors).toEqual([])
  })
}

test('reduced motion still requires activation, reveals immediately and waits again on reload', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#letter')
  const button = page.getByRole('button', {
    name: `Open letter for ${content.settings.recipientName}`,
  })
  await expect(button).toBeVisible()
  await page.keyboard.press('Space')
  await expect(page.locator('.opening')).toHaveCount(0)
  await expect(page.locator('#home')).toBeInViewport()
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await page.reload()
  await expect(button).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(0)
})

test('a live reduced-motion change finishes an opening folder without getting stuck', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .getByRole('button', {
      name: `Open letter for ${content.settings.recipientName}`,
    })
    .click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.opening')).toHaveCount(0)
  await expect(page.locator('#content')).toBeFocused()
  await expect(page.locator('.experience-content')).not.toHaveAttribute('inert')
})

test('a long recipient name remains complete on the folder tab', async ({
  page,
}) => {
  const name = 'Alexandra Maria Isabel de la Cruz Santos'
  await page.setViewportSize({ width: 320, height: 640 })
  await page.route('**/content/experience.json', (route) =>
    route.fulfill({
      json: {
        ...content,
        settings: { ...content.settings, recipientName: name },
      },
    }),
  )
  await page.goto('/')
  const button = page.getByRole('button', { name: `Open letter for ${name}` })
  await expect(button).toBeVisible()
  const tab = page.locator('.folder-tab')
  await expect(tab).toHaveText(name)
  const bounds = await tab.boundingBox()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
  expect(bounds!.y).toBeGreaterThanOrEqual(0)
  await button.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(name)
})
