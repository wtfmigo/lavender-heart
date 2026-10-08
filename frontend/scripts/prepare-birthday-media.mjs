/* global console */
import { request } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import process from 'node:process'

const sources = [
  'photo-1500530855697-b586d89ba3ee',
  'photo-1470770841072-f978cf4d019e',
  'photo-1470252649378-9c29740c9fa8',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1441974231531-c6227db76b6e',
  'photo-1519681393784-d120267933ba',
  'photo-1501785888041-af3ef285b470',
  'photo-1469474968028-56623f02e42e',
  'photo-1494790108377-be9c29b29330',
  'photo-1534528741775-53994a69daeb',
  'photo-1524504388940-b1c1722653e1',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1517841905240-472988babdf9',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1524250502761-1ac6f2e30d43',
  'photo-1544005313-94ddf0286df2',
  'photo-1501854140801-50d01698950b',
  'photo-1518837695005-2083093ee35b',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1497250681960-ef046c08a56e',
  'photo-1490750967868-88aa4486c946',
  'photo-1455390582262-044cdead277a',
  'photo-1495474472287-4d71bcdd2085',
  'photo-1513519245088-0e12902e5a38',
  'photo-1511818966892-d7d671e672a2',
  'photo-1519501025264-65ba15a82390',
  'photo-1483985988355-763728e1935b',
  'photo-1476514525535-07fb3b4ae5f1',
  'photo-1507525428034-b723cf961d3e',
  'photo-1518495973542-4542c06a5843',
  'photo-1487412720507-e7ab37603c6f',
]
assert.equal(sources.length, 31)
assert.equal(new Set(sources).size, sources.length)
const portraits = new Set([
  0, 3, 5, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 21, 23, 26, 29, 30,
])
const client = await request.newContext()
try {
  await mkdir('public/photos', { recursive: true })
  for (const [index, source] of sources.entries()) {
    if (index < Number(process.argv[2] ?? 1) - 1) continue
    const portrait = portraits.has(index)
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
    if (!small.headers()['content-type']?.startsWith('image/'))
      throw new Error(`Not an image: ${source} mobile`)
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
