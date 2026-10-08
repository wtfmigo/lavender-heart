import { apiBaseUrl } from '@/services/http/client'
import { publicExperienceSchema } from '@/features/public/publicExperienceSchema'
import type { ExperiencePhoto } from '@/features/public/experience'

async function read(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal, cache: 'no-store' })
  if (!response.ok) throw new Error('Content unavailable')
  return publicExperienceSchema.parse(await response.json())
}

export async function getExperience(signal: AbortSignal) {
  if (apiBaseUrl) {
    try {
      const base = new URL(
        `${apiBaseUrl.replace(/\/$/, '')}/`,
        window.location.origin,
      )
      const data = await read(
        new URL('experience', base).href,
        AbortSignal.any([signal, AbortSignal.timeout(2500)]),
      )
      const resolve = (photo: ExperiencePhoto): ExperiencePhoto => ({
        ...photo,
        src: new URL(photo.src, base).href,
        ...(photo.smallSrc
          ? { smallSrc: new URL(photo.smallSrc, base).href }
          : {}),
      })
      return {
        ...data,
        gallery: data.gallery.map(resolve),
        story: data.story.map((item) => ({
          ...item,
          photo: item.photo ? resolve(item.photo) : null,
        })),
        timeline: data.timeline.map((item) => ({
          ...item,
          photo: item.photo ? resolve(item.photo) : null,
        })),
        memoryPhoto: data.memoryPhoto ? resolve(data.memoryPhoto) : null,
      }
    } catch (error) {
      if (signal.aborted) throw error
      // ponytail: keep the gift usable with local content until the API is configured and healthy.
    }
  }
  return read('/content/experience.json', signal)
}
