import type {
  PublicSection,
  PublicSiteSettings,
} from '@/models/types/experience'

export type ExperienceSlice = {
  settings: PublicSiteSettings
  hero: Extract<PublicSection, { key: 'hero' }>['content']
  intro: Extract<PublicSection, { key: 'intro' }>['content']
}

export type ExperiencePhoto = {
  id: string
  src: string
  smallSrc?: string
  alt: string
  width: number
  height: number
  caption: string
  focalX: number
  focalY: number
}
export type ExperienceMemory = {
  id: string
  title: string
  date: string | null
  message: import('@/models/types/experience').LimitedRichTextDocument
  photo: ExperiencePhoto | null
  position: number
}
export type PublicExperience = ExperienceSlice & {
  sections: PublicSection[]
  story: ExperienceMemory[]
  memoryPhoto: ExperiencePhoto | null
  gallery: ExperiencePhoto[]
  loveEntries: {
    id: string
    statement: string
    supportingText: string
    position: number
  }[]
  timeline: ExperienceMemory[]
}
