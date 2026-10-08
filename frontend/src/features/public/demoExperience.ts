import content from '../../../public/content/experience.json'
import { publicExperienceSchema } from './publicExperienceSchema'

// The removable development fixture and public local adapter share one content source.
export const demoExperience = publicExperienceSchema.parse(content)
