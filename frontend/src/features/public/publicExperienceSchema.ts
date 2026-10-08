import { z } from 'zod'
import {
  publicSectionSchema,
  publicSiteSettingsSchema,
} from '@/models/schemas/experience'
import { limitedRichTextDocumentSchema } from '@/models/schemas/rich-text'
import { dateOnlySchema } from '@/models/schemas/identifiers'

const photo = z.strictObject({
  id: z.string(),
  src: z.string().regex(/^(\/(?!\/)|https:\/\/)/),
  smallSrc: z
    .string()
    .regex(/^(\/(?!\/)|https:\/\/)/)
    .optional(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string(),
  focalX: z.number().min(0).max(1),
  focalY: z.number().min(0).max(1),
})
const memory = z.strictObject({
  id: z.string(),
  title: z.string(),
  date: dateOnlySchema.nullable(),
  dateLabel: z.string().optional(),
  message: limitedRichTextDocumentSchema,
  photo: photo.nullable(),
  position: z.number().int().nonnegative(),
})
export const publicExperienceSchema = z.strictObject({
  settings: publicSiteSettingsSchema,
  hero: z.strictObject({ title: z.string(), subtitle: z.string() }),
  intro: z.strictObject({
    message: limitedRichTextDocumentSchema,
    supportingText: z.string(),
  }),
  sections: z.array(publicSectionSchema).superRefine((sections, context) => {
    if (new Set(sections.map((s) => s.key)).size !== sections.length)
      context.addIssue({ code: 'custom', message: 'Duplicate chapters' })
    for (const key of ['hero', 'final_closing'])
      if (!sections.some((s) => s.key === key && s.visible))
        context.addIssue({ code: 'custom', message: `Missing required ${key}` })
  }),
  story: z.array(memory),
  memoryPhoto: photo.nullable(),
  gallery: z.array(photo),
  loveEntries: z.array(
    z.strictObject({
      id: z.string(),
      statement: z.string(),
      supportingText: z.string(),
      position: z.number().int().nonnegative(),
    }),
  ),
  timeline: z.array(memory),
})
