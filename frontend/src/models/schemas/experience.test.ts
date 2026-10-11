// @vitest-environment node
/// <reference types="node" />
import { describe, expect, expectTypeOf, test } from 'vitest'
import {
  dateOnlySchema,
  defaultThemePreset,
  sectionKeySchema,
  themePresetSchema,
} from './identifiers'
import { limitedRichTextDocumentSchema } from './rich-text'
import { publicSectionSchema, publicSiteSettingsSchema } from './experience'
import type { PublicSection } from '../types/experience'

const schemas = {
  dateOnlySchema,
  sectionKeySchema,
  themePresetSchema,
  limitedRichTextDocumentSchema,
  publicSectionSchema,
  publicSiteSettingsSchema,
}
const parses = (name: keyof typeof schemas, value: unknown) =>
  schemas[name].safeParse(value).success
const keys = [
  'hero',
  'intro',
  'horizontal_story',
  'full_width_memory',
  'gallery',
  'things_i_love',
  'timeline',
  'birthday_letter',
  'final_closing',
]
const presets = ['lavender_mist', 'lavender_night', 'pearl_lavender']
const doc = { blocks: [] }
const contents: Record<string, object> = {
  hero: { title: '', subtitle: '' },
  intro: { message: doc, supportingText: '' },
  horizontal_story: { heading: '' },
  full_width_memory: { caption: '', date: null },
  gallery: { heading: '' },
  things_i_love: { heading: '' },
  timeline: { heading: '' },
  birthday_letter: {
    heading: '',
    opening: '',
    body: doc,
    signature: '',
    date: null,
  },
  final_closing: { message: doc, date: null },
}
const settings = {
  recipientName: '',
  nickname: '',
  birthdayDate: null,
  relationshipStartDate: null,
  relationshipCounterVisible: false,
  closingSignature: '',
  themePreset: 'lavender_mist',
}

describe('finite identifiers', () => {
  test.each(keys)('accepts chapter %s', (key) => {
    expect(parses('sectionKeySchema', key)).toBe(true)
  })
  test.each(presets)('accepts preset %s', (preset) => {
    expect(parses('themePresetSchema', preset)).toBe(true)
  })
  test.each(['custom', '', 'Hero', 1])(
    'rejects unknown chapter %s',
    (value) => {
      expect(parses('sectionKeySchema', value)).toBe(false)
    },
  )
  test.each(['custom', '', 'Lavender Mist', 1])(
    'rejects unknown preset %s',
    (value) => {
      expect(parses('themePresetSchema', value)).toBe(false)
    },
  )
  test('retains the curated chapter order and default theme', () => {
    expect(sectionKeySchema.options).toEqual(keys)
    expect(themePresetSchema.options).toEqual(presets)
    expect(defaultThemePreset).toBe('lavender_mist')
  })
})

describe('editor-independent rich text', () => {
  test.each(['paragraph', 'blockquote'])(
    'accepts %s with supported runs and breaks',
    (type) => {
      expect(
        parses('limitedRichTextDocumentSchema', {
          blocks: [
            {
              type,
              children: [
                {
                  type: 'text',
                  text: 'Your message here',
                  marks: ['bold', 'italic'],
                },
                { type: 'line_break' },
                { type: 'text', text: '' },
              ],
            },
          ],
        }),
      ).toBe(true)
    },
  )
  test('accepts empty technical structure', () => {
    expect(parses('limitedRichTextDocumentSchema', doc)).toBe(true)
  })
  test.each(['heading', 'image', 'embed', 'html', 'custom'])(
    'rejects block type %s',
    (type) => {
      expect(
        parses('limitedRichTextDocumentSchema', {
          blocks: [{ type, children: [] }],
        }),
      ).toBe(false)
    },
  )
  test.each([
    { type: 'link', text: 'text', href: 'https://example.com' },
    { type: 'text', text: 'text', marks: ['underline'] },
    { type: 'text', text: 'text', style: { color: 'red' } },
    { type: 'text', text: 'text', class: 'arbitrary' },
    { type: 'text', text: 'text', html: '<b>text</b>' },
    { type: 'line_break', text: 'unexpected' },
    { type: 'paragraph', children: [] },
  ])('rejects unsupported inline structure %#', (run) => {
    expect(
      parses('limitedRichTextDocumentSchema', {
        blocks: [{ type: 'paragraph', children: [run] }],
      }),
    ).toBe(false)
  })
  test('rejects extra document and block properties', () => {
    expect(
      parses('limitedRichTextDocumentSchema', { blocks: [], html: '' }),
    ).toBe(false)
    expect(
      parses('limitedRichTextDocumentSchema', {
        blocks: [{ type: 'blockquote', children: [], layout: 'custom' }],
      }),
    ).toBe(false)
  })
})

describe('date-only content', () => {
  test.each(['2026-10-08', '2024-02-29', '2000-02-29'])(
    'accepts real canonical date %s',
    (value) => {
      expect(parses('dateOnlySchema', value)).toBe(true)
    },
  )
  test.each([
    '2023-02-29',
    '1900-02-29',
    '2026-04-31',
    '2026-13-01',
    '2026-00-01',
    '2026-01-00',
    '2026-1-01',
    '2026-10-08T00:00:00Z',
    '',
    null,
  ])('rejects invalid date %s', (value) => {
    expect(parses('dateOnlySchema', value)).toBe(false)
  })
})

describe('bounded settings and chapter contracts', () => {
  test('inferred section types retain key-specific content and visibility', () => {
    expectTypeOf<Extract<PublicSection, { key: 'hero' }>>().toEqualTypeOf<{
      key: 'hero'
      visible: true
      content: { title: string; subtitle: string }
    }>()
  })
  test('supports public settings and real relationship dates', () => {
    expect(parses('publicSiteSettingsSchema', settings)).toBe(true)
    expect(
      parses('publicSiteSettingsSchema', {
        ...settings,
        birthdayDate: '2024-02-29',
        relationshipStartDate: '2020-01-01',
      }),
    ).toBe(true)
  })
  test.each(['ownerUserId', 'version', 'timezone', 'customTheme'])(
    'public settings reject internal/unsupported %s',
    (field) => {
      expect(
        parses('publicSiteSettingsSchema', { ...settings, [field]: 1 }),
      ).toBe(false)
    },
  )
  test('validates public settings dates and theme', () => {
    expect(
      parses('publicSiteSettingsSchema', {
        ...settings,
        birthdayDate: '2023-02-29',
      }),
    ).toBe(false)
    expect(
      parses('publicSiteSettingsSchema', {
        ...settings,
        relationshipStartDate: '2026-01-01T00:00:00Z',
      }),
    ).toBe(false)
    expect(
      parses('publicSiteSettingsSchema', {
        ...settings,
        themePreset: 'custom',
      }),
    ).toBe(false)
  })
  test.each(keys)(
    '%s accepts bounded content and rejects extra or missing fields',
    (key) => {
      const section = { key, visible: true, content: contents[key] }
      expect(parses('publicSectionSchema', section)).toBe(true)
      expect(parses('publicSectionSchema', { ...section, version: 1 })).toBe(
        false,
      )
      expect(
        parses('publicSectionSchema', {
          ...section,
          content: { ...contents[key], html: '' },
        }),
      ).toBe(false)
      expect(parses('publicSectionSchema', { ...section, content: {} })).toBe(
        false,
      )
    },
  )
  test.each(keys)('%s visibility follows required chapters', (key) => {
    expect(
      parses('publicSectionSchema', {
        key,
        visible: false,
        content: contents[key],
      }),
    ).toBe(!['hero', 'final_closing'].includes(key))
  })
  test('rejects custom chapters and mismatched chapter payloads', () => {
    expect(
      parses('publicSectionSchema', {
        key: 'custom',
        visible: true,
        content: {},
      }),
    ).toBe(false)
    expect(
      parses('publicSectionSchema', {
        key: 'hero',
        visible: true,
        content: contents.intro,
      }),
    ).toBe(false)
  })
  test.each(['full_width_memory', 'birthday_letter', 'final_closing'])(
    '%s validates its optional date',
    (key) => {
      expect(
        parses('publicSectionSchema', {
          key,
          visible: true,
          content: { ...contents[key], date: '2024-02-29' },
        }),
      ).toBe(true)
      expect(
        parses('publicSectionSchema', {
          key,
          visible: true,
          content: { ...contents[key], date: '2023-02-29' },
        }),
      ).toBe(false)
    },
  )
})
