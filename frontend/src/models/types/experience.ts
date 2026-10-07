import type { z } from 'zod'
import type {
  sectionKeySchema,
  themePresetSchema,
  versionedContentSchema,
} from '../schemas/identifiers'
import type {
  limitedRichTextBlockSchema,
  limitedRichTextDocumentSchema,
  limitedRichTextInlineSchema,
  limitedRichTextRunSchema,
} from '../schemas/rich-text'
import type {
  adminSectionSchema,
  adminSiteSettingsSchema,
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
export type VersionedContent = z.infer<typeof versionedContentSchema>
export type PublicSiteSettings = z.infer<typeof publicSiteSettingsSchema>
export type AdminSiteSettings = z.infer<typeof adminSiteSettingsSchema>
export type PublicSection = z.infer<typeof publicSectionSchema>
export type AdminSection = z.infer<typeof adminSectionSchema>
