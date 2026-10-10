export function heartYaw(progress: number, time: number, reduced = false) {
  return reduced
    ? -0.24
    : -0.24 + Math.sin(progress * 0.35) * 0.08 + Math.sin(time * 0.3) * 0.015
}
