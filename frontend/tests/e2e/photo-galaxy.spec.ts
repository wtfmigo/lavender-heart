import { expect, test } from '@playwright/test'

for (const width of [1440, 390, 320]) {
  test(`photo sphere supports rotation, full-size photos and list access at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const galaxy = page.locator('.photo-galaxy')
    await expect(galaxy).toHaveAttribute('data-view', 'sphere')
    await galaxy.scrollIntoViewIfNeeded()
    expect(
      await galaxy
        .locator('.photo-galaxy-controls')
        .evaluate((e) => e.getBoundingClientRect().height),
    ).toBe(1)
    expect(
      await galaxy
        .locator('.photo-galaxy-instructions')
        .evaluate((e) => e.getBoundingClientRect().height),
    ).toBe(1)
    if (width === 1440) {
      expect(
        await galaxy.evaluate((e) =>
          getComputedStyle(e).getPropertyValue('--galaxy-radius'),
        ),
      ).toContain('340px')
      expect(
        await galaxy
          .locator('.photo-galaxy-position')
          .first()
          .evaluate((e) => e.getBoundingClientRect().width),
      ).toBeGreaterThan(140)
    }
    const stage = galaxy.locator('.photo-galaxy-stage')
    const rotor = galaxy.locator('.photo-galaxy-rotor')
    const before = await rotor.evaluate((e) => getComputedStyle(e).transform)
    await stage.focus()
    await page.keyboard.press('ArrowRight')
    await expect
      .poll(() => rotor.evaluate((e) => getComputedStyle(e).transform))
      .not.toBe(before)
    const rotated = await rotor.evaluate((e) => getComputedStyle(e).transform)
    const box = await stage.boundingBox()
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(
      box!.x + box!.width / 2 + 50,
      box!.y + box!.height / 2 + 35,
      { steps: 6 },
    )
    await page.mouse.up()
    await expect
      .poll(() => rotor.evaluate((e) => getComputedStyle(e).transform))
      .not.toBe(rotated)
    await expect(page.getByRole('dialog', { name: 'Photographs' })).toBeHidden()
    const spherePhoto = galaxy.locator('.gallery-photo button').first()
    await spherePhoto.focus()
    await spherePhoto.click()
    await expect(
      page.getByRole('dialog', { name: 'Photographs' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
    if (width === 390) {
      const touchBefore = await rotor.evaluate(
        (e) => getComputedStyle(e).transform,
      )
      const session = await page.context().newCDPSession(page)
      const x = box!.x + box!.width / 2
      const y = box!.y + box!.height / 2
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x, y }],
      })
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x - 55, y: y - 35 }],
      })
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      })
      await expect
        .poll(() => rotor.evaluate((e) => getComputedStyle(e).transform))
        .not.toBe(touchBefore)
      await session.detach()
    }
    await expect(page.getByRole('dialog', { name: 'Photographs' })).toBeHidden()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width)
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur())
    const galaxyBox = await galaxy.boundingBox()
    for (const photo of await galaxy.locator('.gallery-photo').all()) {
      const photoBox = await photo.boundingBox()
      expect(photoBox!.y).toBeGreaterThanOrEqual(galaxyBox!.y)
      expect(photoBox!.y + photoBox!.height).toBeLessThanOrEqual(
        galaxyBox!.y + galaxyBox!.height,
      )
    }
    await galaxy.screenshot({ path: `test-results/photo-galaxy-${width}.png` })
    await galaxy
      .getByRole('button', { name: 'Show photo list', exact: true })
      .focus()
    await galaxy
      .getByRole('button', { name: 'Show photo list', exact: true })
      .click()
    await expect(galaxy).toHaveAttribute('data-view', 'list')
    const photos = galaxy.locator('.gallery-photo button')
    await expect(photos).toHaveCount(10)
    await photos.first().click()
    const dialog = page.getByRole('dialog', { name: 'Photographs' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('11 / 20', { exact: true })).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await expect(dialog.getByText('12 / 20', { exact: true })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(photos.first()).toBeFocused()
    await galaxy
      .getByRole('button', { name: 'Show galaxy', exact: true })
      .focus()
    await galaxy
      .getByRole('button', { name: 'Show galaxy', exact: true })
      .click()
    await expect(galaxy).toHaveAttribute('data-view', 'sphere')
  })
}

test('automatic sphere rotation honors its pause and global motion pause', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const galaxy = page.locator('.photo-galaxy')
  await galaxy.scrollIntoViewIfNeeded()
  const rotor = galaxy.locator('.photo-galaxy-rotor')
  const rotation = () => rotor.evaluate((e) => getComputedStyle(e).transform)
  const initial = await rotation()
  await expect.poll(rotation).not.toBe(initial)
  await galaxy
    .getByRole('button', { name: 'Pause rotation', exact: true })
    .focus()
  await galaxy
    .getByRole('button', { name: 'Pause rotation', exact: true })
    .click()
  await page.mouse.move(0, 0)
  const paused = await rotation()
  await page.waitForTimeout(150)
  expect(await rotation()).toBe(paused)
  await galaxy
    .getByRole('button', { name: 'Resume rotation', exact: true })
    .focus()
  await galaxy
    .getByRole('button', { name: 'Resume rotation', exact: true })
    .click()
  await page.locator('body').click({ position: { x: 5, y: 5 } })
  await page.mouse.move(0, 0)
  await expect.poll(rotation).not.toBe(paused)
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click()
  const globalPaused = await rotation()
  await page.waitForTimeout(150)
  expect(await rotation()).toBe(globalPaused)
})

test('starts with the mouse over it and resumes immediately after dragging a photo', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const galaxy = page.locator('.photo-galaxy')
  await galaxy.scrollIntoViewIfNeeded()
  const stage = galaxy.locator('.photo-galaxy-stage')
  const rotor = galaxy.locator('.photo-galaxy-rotor')
  const box = await stage.boundingBox()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
  const rotation = () => rotor.evaluate((e) => getComputedStyle(e).transform)
  const hovered = await rotation()
  await expect
    .poll(rotation, { timeout: 1000, intervals: [50] })
    .not.toBe(hovered)
  const photo = galaxy.locator('.gallery-photo button').first()
  await photo.focus()
  const photoBox = await photo.boundingBox()
  await page.mouse.move(
    photoBox!.x + photoBox!.width / 2,
    photoBox!.y + photoBox!.height / 2,
  )
  await page.mouse.down()
  await page.mouse.move(
    photoBox!.x + photoBox!.width / 2 + 50,
    photoBox!.y + photoBox!.height / 2 + 20,
    { steps: 5 },
  )
  await page.mouse.up()
  await expect(page.getByRole('dialog', { name: 'Photographs' })).toBeHidden()
  const released = await rotation()
  await expect
    .poll(rotation, { timeout: 1000, intervals: [50] })
    .not.toBe(released)
})
