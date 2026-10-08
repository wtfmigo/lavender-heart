import type {
  PublicSection,
  PublicSiteSettings,
} from '@/models/types/experience'

export type ExperienceSlice = {
  settings: PublicSiteSettings
  hero: Extract<PublicSection, { key: 'hero' }>['content']
  intro: Extract<PublicSection, { key: 'intro' }>['content']
}
