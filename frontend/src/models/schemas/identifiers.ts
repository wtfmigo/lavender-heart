import { z } from 'zod'

export const sectionKeySchema = z.enum([
  'hero',
  'intro',
  'horizontal_story',
  'full_width_memory',
  'gallery',
  'things_i_love',
  'timeline',
  'birthday_letter',
  'final_closing',
])

export const themePresetSchema = z.enum([
  'lavender_mist',
  'lavender_night',
  'pearl_lavender',
])

export const defaultThemePreset = themePresetSchema.enum.lavender_mist
export const dateOnlySchema = z.iso.date()
