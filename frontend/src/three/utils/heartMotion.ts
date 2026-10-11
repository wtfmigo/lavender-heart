export function heartYaw(progress: number, time: number, reduced = false) {
  if (reduced) return -0.24
  // Scroll progress drives complete horizontal turns, including Story travel.
  const chapter = Math.min(8, Math.max(0, progress))
  return -0.24 + chapter * Math.PI * 2 + Math.sin(time * 0.3) * 0.012
}
