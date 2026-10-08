import type { ExperiencePhoto } from './experience'

// Neutral reusable development imagery; replace with owner photographs through the adapter.
export const developmentPhotos: ExperiencePhoto[] = (
  [
    ['A quiet road winding between red sandstone cliffs', 800, 1067],
    ['A wooden boathouse beside a still mountain lake', 1200, 800],
    ['Morning sunlight above a misty meadow and fir trees', 1200, 800],
    ['Snow-covered mountains beyond a green alpine valley', 800, 1067],
    ['A sunlit woodland path between tall trees', 1200, 800],
    ['A star-filled violet sky above snow-covered mountains', 800, 1067],
    ['A small wooden boat on a clear turquoise mountain lake', 1200, 800],
    ['Warm evening light falling across a rugged mountain valley', 1200, 800],
  ] as const
).map(([alt, width, height], index) => ({
  id: `photo${String(index + 1).padStart(2, '0')}`,
  src: `/photos/photo${String(index + 1).padStart(2, '0')}.webp`,
  smallSrc: `/photos/photo${String(index + 1).padStart(2, '0')}-small.webp`,
  alt,
  width,
  height,
  caption: 'Photo caption',
  focalX: 0.5,
  focalY: 0.5,
}))
