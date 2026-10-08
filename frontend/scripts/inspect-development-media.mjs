/* global console */
import { chromium } from '@playwright/test'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const output = '../docs/evidence/visual-recomposition'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1200 },
  })
  const dimensions = []
  for (let start = 1; start <= 31; start += 16) {
    const tiles = []
    for (let number = start; number <= Math.min(start + 15, 31); number++) {
      const id = `photo${String(number).padStart(2, '0')}`
      const bytes = await readFile(`public/photos/${id}.webp`)
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF')
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP')
      tiles.push(
        `<figure><img id="${id}" src="data:image/webp;base64,${bytes.toString('base64')}"><figcaption>${id}</figcaption></figure>`,
      )
    }
    await page.setContent(
      `<style>body{margin:20px;background:#f3f0e8;font:18px sans-serif}main{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}figure{margin:0}img{width:100%;height:260px;object-fit:contain;background:#ded9d0}figcaption{text-align:center;padding:8px}</style><main>${tiles.join('')}</main>`,
    )
    await page.locator('img').evaluateAll(async (images) => {
      await Promise.all(images.map((image) => image.decode()))
    })
    dimensions.push(
      ...(await page.locator('img').evaluateAll((images) =>
        images.map((image) => ({
          id: image.id,
          width: image.naturalWidth,
          height: image.naturalHeight,
        })),
      )),
    )
    await page.screenshot({
      path: `${output}/media-contact-${start}.png`,
      fullPage: true,
    })
  }
  await writeFile(
    `${output}/media-dimensions.json`,
    JSON.stringify(dimensions, null, 2) + '\n',
  )
  assert.equal(dimensions.length, 31)
  assert.ok(
    dimensions.every(
      ({ width, height }) =>
        width > 0 && height > 0 && width <= 1200 && height <= 1067,
    ),
  )
  const content = JSON.parse(
    await readFile('public/content/experience.json', 'utf8'),
  )
  assert.equal(content.story.length, 8)
  assert.equal(content.gallery.length, 16)
  assert.equal(content.timeline.length, 6)
  const photos = [
    ...content.story.map((entry) => entry.photo),
    content.memoryPhoto,
    ...content.gallery,
    ...content.timeline.map((entry) => entry.photo),
  ]
  assert.equal(new Set(photos.map((photo) => photo.src)).size, 31)
  assert.ok(
    [...content.story, ...content.timeline].every(
      (entry) => entry.date === null,
    ),
  )
  for (const photo of photos) {
    const id = photo.src.split('/').pop().replace('.webp', '')
    const actual = dimensions.find((image) => image.id === id)
    assert.equal(photo.width, actual.width)
    assert.equal(photo.height, actual.height)
    const small = await readFile(`public${photo.smallSrc}`)
    await page.setContent(
      `<img src="data:image/webp;base64,${small.toString('base64')}">`,
    )
    const smallDimensions = await page
      .locator('img')
      .evaluate(async (image) => {
        await image.decode()
        return [image.naturalWidth, image.naturalHeight]
      })
    assert.deepEqual(smallDimensions, [
      600,
      Math.round((actual.height / actual.width) * 600),
    ])
  }
  console.log(
    '31 WebP photographs decode with bounded dimensions; two contact sheets saved.',
  )
} finally {
  await browser.close()
}
