import { expect, test } from '@playwright/test'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

test('generated browser reports do not reload the preview or rebuild its CSS', async ({
  page,
}) => {
  const updates: string[] = []
  page.on('websocket', (socket) => {
    socket.on('framereceived', ({ payload }) => {
      const message = JSON.parse(String(payload))
      if (message.type === 'full-reload' || message.type === 'update') {
        updates.push(message.type)
      }
    })
  })
  await page.goto('/?motion=off')
  await expect(page.locator('#finale')).toBeAttached()
  await page.waitForTimeout(500)
  updates.length = 0
  const reports = ['playwright-report', 'test-results'].map((directory) =>
    fileURLToPath(
      new URL(`../../${directory}/preview-stability.html`, import.meta.url),
    ),
  )
  try {
    for (const report of reports) {
      await mkdir(dirname(report), { recursive: true })
      await writeFile(
        report,
        '<html><body class="text-[123px]">Test report</body></html>',
      )
    }
    await page.waitForTimeout(2000)
    expect(updates).toEqual([])
  } finally {
    for (const report of reports) await rm(report, { force: true })
  }
})
