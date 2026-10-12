import { expect, test } from './experienceTest.js'

for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  test(`timeline reserves image space before photos load at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    let release!: () => void
    const ready = new Promise<void>((resolve) => {
      release = resolve
    })
    await page.route('**/photos/personal/**', async (route) => {
      await ready
      await route.continue()
    })
    try {
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)
      const images = page.locator('.timeline-content img')
      await images.evaluateAll((nodes) =>
        nodes.forEach((node) => ((node as HTMLImageElement).loading = 'eager')),
      )
      const before = await page
        .locator('#finale')
        .evaluate((node) => node.getBoundingClientRect().top + scrollY)
      for (const image of await images.all())
        expect((await image.boundingBox())!.height).toBeGreaterThan(100)
      release()
      for (const image of await images.all())
        await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          images.evaluateAll((nodes) =>
            nodes.every(
              (node) =>
                (node as HTMLImageElement).complete &&
                (node as HTMLImageElement).naturalWidth > 0,
            ),
          ),
        )
        .toBe(true)
      const after = await page
        .locator('#finale')
        .evaluate((node) => node.getBoundingClientRect().top + scrollY)
      expect(Math.abs(after - before)).toBeLessThan(2)
    } finally {
      release()
    }
  })
}

test('native chapters retain scroll reveals while the photo sphere keeps animating', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-scroll',
    'native',
  )
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await expect(page.locator('#story')).toHaveAttribute(
    'data-live-heart',
    'true',
  )
  await expect(page.locator('#finale')).toHaveAttribute(
    'data-live-heart',
    'true',
  )
  const photo = page.locator('.gallery-photo').first()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await expect(photo).toHaveCSS('clip-path', /inset\(/)
  const top = await photo.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY,
  )
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: 'instant' }),
    top,
  )
  await expect(photo).toHaveCSS('opacity', '1')
  await expect(photo).toHaveCSS(
    'clip-path',
    /^inset\(0(?:%|px)(?: 0(?:%|px)){0,3}\)$/,
  )
  const rotor = page.locator('.photo-galaxy-rotor')
  await rotor.scrollIntoViewIfNeeded()
  const yaw = await rotor.evaluate((element) =>
    element.style.getPropertyValue('--galaxy-yaw'),
  )
  await expect
    .poll(() =>
      rotor.evaluate((element) =>
        element.style.getPropertyValue('--galaxy-yaw'),
      ),
    )
    .not.toBe(yaw)
})

test('motion-off preview keeps responsive content and native scrolling without loading WebGL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 440, height: 956 })
  await page.goto('/?motion=off')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.experience')).toHaveAttribute(
    'data-motion',
    'reduced',
  )
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('.persistent-heart svg')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  for (const name of await page.locator('.hero h1 span').all()) {
    await expect(name).toBeInViewport({ ratio: 1 })
  }
  await page.mouse.move(100, 100)
  await page.mouse.wheel(0, 500)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400)
})

test('wheel scrolling remains native while full animations are enabled', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await page.evaluate(() => {
    window.addEventListener('wheel', (event) => {
      document.body.dataset.wheelPrevented = String(event.defaultPrevented)
    })
  })
  await page.mouse.move(100, 100)
  await page.mouse.wheel(0, 500)
  await expect(page.locator('body')).toHaveAttribute(
    'data-wheel-prevented',
    'false',
  )
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400)
})

test('vertical touch swipes over the galaxy scroll the page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 440, height: 956 })
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  const galaxy = page.locator('.photo-galaxy-stage')
  await galaxy.scrollIntoViewIfNeeded()
  const rect = await galaxy.boundingBox()
  const before = await page.evaluate(() => scrollY)
  const session = await page.context().newCDPSession(page)
  await session.send('Emulation.setTouchEmulationEnabled', {
    enabled: true,
    maxTouchPoints: 1,
  })
  const x = rect!.x + rect!.width / 2
  const y = Math.min(800, rect!.y + rect!.height / 2 + 100)
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y }],
  })
  for (let step = 1; step <= 8; step++) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: y - step * 30 }],
    })
    await page.waitForTimeout(20)
  }
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(before + 100)
})

test('photo loads do not reset scrolling while the wheel is moving', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await expect(page.locator('.opening')).toBeHidden({ timeout: 15000 })
  await page.evaluate(() => {
    const original = window.scrollTo
    let lastWheel = 0
    window.addEventListener(
      'wheel',
      () => {
        lastWheel = performance.now()
      },
      { passive: true },
    )
    document.body.dataset.scrollResets = '0'
    window.scrollTo = ((...args: [ScrollToOptions] | [number, number]) => {
      const top = typeof args[0] === 'number' ? args[1] : args[0]?.top
      if (top === 0 && scrollY > 100 && performance.now() - lastWheel < 150) {
        document.body.dataset.scrollResets = String(
          Number(document.body.dataset.scrollResets) + 1,
        )
      }
      Reflect.apply(original, window, args)
    }) as typeof window.scrollTo
  })
  await page.mouse.move(100, 100)
  for (let step = 0; step < 10; step++) {
    await page.mouse.wheel(0, 160)
    await page.evaluate(() => {
      document
        .querySelector('.gallery-photo img')
        ?.dispatchEvent(new Event('load'))
    })
    await page.waitForTimeout(30)
  }
  await expect(page.locator('body')).toHaveAttribute('data-scroll-resets', '0')
})

test('mobile address-bar height changes do not interrupt native scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 440, height: 956 })
  await page.goto('/')
  await expect(page.locator('#finale')).toBeAttached()
  await page.locator('.story-spread').first().scrollIntoViewIfNeeded()
  await page.evaluate(() => {
    const original = window.scrollTo
    document.body.dataset.scrollRestores = '0'
    window.scrollTo = ((...args: [ScrollToOptions] | [number, number]) => {
      document.body.dataset.scrollRestores = String(
        Number(document.body.dataset.scrollRestores) + 1,
      )
      Reflect.apply(original, window, args)
    }) as typeof window.scrollTo
  })
  await page.setViewportSize({ width: 440, height: 900 })
  await page.waitForTimeout(250)
  await expect(page.locator('body')).toHaveAttribute(
    'data-scroll-restores',
    '0',
  )
})
