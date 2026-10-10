import { expect, test } from '@playwright/test'

test('gallery native dialog contains focus, supports keyboard and returns to its thumbnail', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const thumbnail = page.locator('#gallery .gallery-photo button').nth(1)
  await thumbnail.scrollIntoViewIfNeeded()
  await thumbnail.click()
  const dialog = page.getByRole('dialog', { name: 'Photographs' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('2 / 20', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('3 / 20', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  for (let index = 0; index < 6; index++) {
    await page.keyboard.press('Tab')
    expect(
      await dialog.evaluate(
        (element) =>
          element.contains(document.activeElement) ||
          document.activeElement === document.body,
      ),
    ).toBe(true)
  }
  await thumbnail.evaluate((element: HTMLButtonElement) => element.focus())
  await expect(thumbnail).not.toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(thumbnail).toBeFocused()
})

test('gallery supports touch swipe and visible previous/next controls on a phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('#gallery .gallery-photo button').first().click()
  const dialog = page.getByRole('dialog', { name: 'Photographs' })
  await dialog.evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, clientX: 280 })
    const end = new Touch({ identifier: 1, target: element, clientX: 100 })
    element.dispatchEvent(
      new TouchEvent('touchstart', { bubbles: true, touches: [start] }),
    )
    element.dispatchEvent(
      new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }),
    )
  })
  await expect(dialog.getByText('2 / 20', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Previous photo' }).click()
  await expect(dialog.getByText('1 / 20', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Next photo' }).click()
  await expect(dialog.getByText('2 / 20', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Close photographs' }).click()
  await expect(dialog).toBeHidden()
})
