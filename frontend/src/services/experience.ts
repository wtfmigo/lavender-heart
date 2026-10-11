import { publicExperienceSchema } from '@/features/public/publicExperienceSchema'

export async function getExperience(signal: AbortSignal) {
  const response = await fetch('/content/experience.json', {
    signal,
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Content unavailable')
  return publicExperienceSchema.parse(await response.json())
}
