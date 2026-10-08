import { expect, test } from 'vitest'
import content from '../../../public/content/experience.json'
import { publicExperienceSchema } from './publicExperienceSchema'

test('the complete local content satisfies the public contract', () => {
  expect(publicExperienceSchema.parse(content).sections).toHaveLength(9)
})

test('untrusted photo URLs, focal values and duplicate chapters are rejected', () => {
  for (const patch of [
    { src: 'javascript:alert(1)' },
    { src: '//untrusted.example/photo' },
    { focalX: 1.1 },
  ]) {
    expect(
      publicExperienceSchema.safeParse({
        ...content,
        gallery: [{ ...content.gallery[0], ...patch }],
      }).success,
    ).toBe(false)
  }
  expect(
    publicExperienceSchema.safeParse({
      ...content,
      sections: [...content.sections, content.sections[0]],
    }).success,
  ).toBe(false)
})

test('required chapters remain visible while optional chapters may be hidden', () => {
  const hidden = structuredClone(content)
  hidden.sections[1].visible = false
  expect(publicExperienceSchema.safeParse(hidden).success).toBe(true)
  hidden.sections[0].visible = false
  expect(publicExperienceSchema.safeParse(hidden).success).toBe(false)
})
