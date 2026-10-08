/* global console */
import { request } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const sources = [
  'photo-1500530855697-b586d89ba3ee',
  'photo-1470770841072-f978cf4d019e',
  'photo-1470252649378-9c29740c9fa8',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1441974231531-c6227db76b6e',
  'photo-1519681393784-d120267933ba',
  'photo-1501785888041-af3ef285b470',
  'photo-1469474968028-56623f02e42e',
]
const client = await request.newContext()
try {
  await mkdir('public/photos', { recursive: true })
  for (const [index, source] of sources.entries()) {
    const portrait = index === 0 || index === 3 || index === 5
    const width = portrait ? 800 : 1200
    const height = portrait ? 1067 : 800
    const url = `https://images.unsplash.com/${source}?fm=webp&q=80&fit=crop&w=${width}&h=${height}`
    const response = await client.get(url)
    if (!response.ok()) throw new Error(`${source}: ${response.status()}`)
    const bytes = await response.body()
    if (!response.headers()['content-type']?.startsWith('image/'))
      throw new Error(`Not an image: ${source}`)
    await writeFile(
      `public/photos/photo${String(index + 1).padStart(2, '0')}.webp`,
      bytes,
    )
    console.log(`${index + 1}: ${bytes.length} bytes ${width}x${height}`)
    const smallHeight = Math.round((height / width) * 600)
    const small = await client.get(
      `https://images.unsplash.com/${source}?fm=webp&q=78&fit=crop&w=600&h=${smallHeight}`,
    )
    if (!small.ok()) throw new Error(`${source} mobile: ${small.status()}`)
    const smallBytes = await small.body()
    await writeFile(
      `public/photos/photo${String(index + 1).padStart(2, '0')}-small.webp`,
      smallBytes,
    )
    console.log(
      `Mobile ${index + 1}: ${smallBytes.length} bytes 600x${smallHeight}`,
    )
  }
} finally {
  await client.dispose()
}
