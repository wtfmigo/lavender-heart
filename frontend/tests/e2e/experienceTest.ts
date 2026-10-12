import { expect, test as base } from '@playwright/test'

export { expect, type Locator } from '@playwright/test'

// Chapter tests enter the gift; folder tests use Playwright's base fixture.
export const test = base.extend({
  page: async ({ page }, runTest) => {
    const navigate = page.goto.bind(page)
    page.goto = async (...args) => {
      const response = await navigate(...args)
      if (new URL(page.url()).pathname === '/') {
        await page
          .locator('.folder-button, .experience-unavailable')
          .first()
          .waitFor({ state: 'visible' })
        const folder = page.locator('.folder-button')
        if (await folder.count()) {
          await folder.click()
          await expect(page.locator('.opening')).toBeHidden()
        }
      }
      return response
    }
    await runTest(page)
  },
})
