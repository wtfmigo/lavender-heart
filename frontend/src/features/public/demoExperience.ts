import content from '../../../public/content/experience.json'
import { publicExperienceSchema } from './publicExperienceSchema'

// The local gift fixture and public adapter share one content source.
export const demoExperience = publicExperienceSchema.parse(content)
