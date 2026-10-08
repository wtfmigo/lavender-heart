/* global Image, document, Buffer, console */
import { chromium } from '@playwright/test'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  const source = await readFile('public/atmosphere/cloud-bank.png')
  const optimized = await page.evaluate(async (base64) => {
    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()
    return [1536, 768].map((width) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = (width * image.height) / image.width
      canvas
        .getContext('2d')
        .drawImage(image, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/webp', 0.88).split(',')[1]
    })
  }, source.toString('base64'))
  await writeFile(
    'public/atmosphere/cloud-bank.webp',
    Buffer.from(optimized[0], 'base64'),
  )
  await writeFile(
    'public/atmosphere/cloud-bank-small.webp',
    Buffer.from(optimized[1], 'base64'),
  )
  await mkdir('public/fonts', { recursive: true })
  for (const [family, filename] of [
    ['Cormorant Garamond', 'cormorant-garamond'],
    ['Inter', 'inter'],
  ]) {
    const response = await page.request.get(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400..600&display=swap`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        },
      },
    )
    if (!response.ok()) throw new Error(`Font CSS: ${response.status()}`)
    const css = await response.text()
    const urls = [
      ...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g),
    ]
    if (!urls.length) throw new Error(`No WOFF2 for ${family}`)
    const font = await page.request.get(urls.at(-1)[1])
    if (!font.ok()) throw new Error(`Font file: ${font.status()}`)
    await writeFile(`public/fonts/${filename}-latin.woff2`, await font.body())
    const licenseUrl =
      family === 'Inter'
        ? 'https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt'
        : 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt'
    const license = await page.request.get(licenseUrl)
    if (!license.ok()) throw new Error(`Font license: ${license.status()}`)
    await writeFile(
      `public/fonts/${filename}-LICENSE.txt`,
      await license.text(),
    )
    console.log(`Saved ${family} Latin font and license`)
  }
  console.log(
    'Original cloud alpha preserved; saved desktop/mobile WebP derivatives',
  )
} finally {
  await browser.close()
}
