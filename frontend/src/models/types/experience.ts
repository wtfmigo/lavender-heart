import type { z } from 'zod'
import type {
  sectionKeySchema,
  themePresetSchema,
} from '../schemas/identifiers'
import type {
  limitedRichTextBlockSchema,
  limitedRichTextDocumentSchema,
  limitedRichTextInlineSchema,
  limitedRichTextRunSchema,
} from '../schemas/rich-text'
import type {
  publicSectionSchema,
  publicSiteSettingsSchema,
} from '../schemas/experience'

export type SectionKey = z.infer<typeof sectionKeySchema>
export type ThemePreset = z.infer<typeof themePresetSchema>
export type LimitedRichTextDocument = z.infer<
  typeof limitedRichTextDocumentSchema
>
export type LimitedRichTextBlock = z.infer<typeof limitedRichTextBlockSchema>
export type LimitedRichTextRun = z.infer<typeof limitedRichTextRunSchema>
export type LimitedRichTextInline = z.infer<typeof limitedRichTextInlineSchema>
export type PublicSiteSettings = z.infer<typeof publicSiteSettingsSchema>
export type PublicSection = z.infer<typeof publicSectionSchema>
