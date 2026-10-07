import { z } from 'zod'
import {
  dateOnlySchema,
  themePresetSchema,
  versionedContentSchema,
} from './identifiers'
import { limitedRichTextDocumentSchema } from './rich-text'

const nullableDate = dateOnlySchema.nullable()

export const publicSiteSettingsSchema = z.strictObject({
  recipientName: z.string(),
  nickname: z.string(),
  birthdayDate: nullableDate,
  relationshipStartDate: nullableDate,
  relationshipCounterVisible: z.boolean(),
  closingSignature: z.string(),
  themePreset: themePresetSchema,
})

export const adminSiteSettingsSchema = publicSiteSettingsSchema.extend({
  ...versionedContentSchema.shape,
  ownerUserId: z.number().int().positive().nullable(),
})

const headingContent = z.strictObject({ heading: z.string() })

export const sectionContentSchemas = {
  hero: z.strictObject({ title: z.string(), subtitle: z.string() }),
  intro: z.strictObject({
    message: limitedRichTextDocumentSchema,
    supportingText: z.string(),
  }),
  horizontal_story: headingContent,
  full_width_memory: z.strictObject({
    caption: z.string(),
    date: nullableDate,
  }),
  gallery: headingContent,
  things_i_love: headingContent,
  timeline: headingContent,
  birthday_letter: z.strictObject({
    heading: z.string(),
    opening: z.string(),
    body: limitedRichTextDocumentSchema,
    signature: z.string(),
    date: nullableDate,
  }),
  final_closing: z.strictObject({
    message: limitedRichTextDocumentSchema,
    date: nullableDate,
  }),
}

const sectionSchemas = [
  z.strictObject({
    key: z.literal('hero'),
    visible: z.literal(true),
    content: sectionContentSchemas.hero,
  }),
  z.strictObject({
    key: z.literal('intro'),
    visible: z.boolean(),
    content: sectionContentSchemas.intro,
  }),
  z.strictObject({
    key: z.literal('horizontal_story'),
    visible: z.boolean(),
    content: sectionContentSchemas.horizontal_story,
  }),
  z.strictObject({
    key: z.literal('full_width_memory'),
    visible: z.boolean(),
    content: sectionContentSchemas.full_width_memory,
  }),
  z.strictObject({
    key: z.literal('gallery'),
    visible: z.boolean(),
    content: sectionContentSchemas.gallery,
  }),
  z.strictObject({
    key: z.literal('things_i_love'),
    visible: z.boolean(),
    content: sectionContentSchemas.things_i_love,
  }),
  z.strictObject({
    key: z.literal('timeline'),
    visible: z.boolean(),
    content: sectionContentSchemas.timeline,
  }),
  z.strictObject({
    key: z.literal('birthday_letter'),
    visible: z.boolean(),
    content: sectionContentSchemas.birthday_letter,
  }),
  z.strictObject({
    key: z.literal('final_closing'),
    visible: z.literal(true),
    content: sectionContentSchemas.final_closing,
  }),
] as const

export const publicSectionSchema = z.discriminatedUnion('key', sectionSchemas)
export const adminSectionSchema = z.discriminatedUnion('key', [
  sectionSchemas[0].extend(versionedContentSchema.shape),
  ...sectionSchemas
    .slice(1)
    .map((schema) => schema.extend(versionedContentSchema.shape)),
])
