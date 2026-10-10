const chapterYaw = [-0.24, 0.3, -0.42, 0.34, -0.12, 0.38, -0.28, 0.18, -0.12]

export function heartYaw(progress: number, time: number, reduced = false) {
  if (reduced) return -0.24
  // Progress names the fixed nine chapters, including measured pinned travel.
  const chapter = Math.min(8, Math.max(0, progress))
  const index = Math.floor(chapter)
  const fraction = chapter - index
  const settle = fraction * fraction * (3 - 2 * fraction)
  const yaw =
    chapterYaw[index] +
    (chapterYaw[Math.min(8, index + 1)] - chapterYaw[index]) * settle
  return yaw + Math.sin(time * 0.3) * 0.012
}
