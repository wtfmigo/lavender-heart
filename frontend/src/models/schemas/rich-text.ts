import { z } from 'zod'

export const limitedRichTextRunSchema = z.strictObject({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(z.enum(['bold', 'italic'])).optional(),
})

export const limitedRichTextInlineSchema = z.discriminatedUnion('type', [
  limitedRichTextRunSchema,
  z.strictObject({ type: z.literal('line_break') }),
])

export const limitedRichTextBlockSchema = z.strictObject({
  type: z.enum(['paragraph', 'blockquote']),
  children: z.array(limitedRichTextInlineSchema),
})

export const limitedRichTextDocumentSchema = z.strictObject({
  blocks: z.array(limitedRichTextBlockSchema),
})
