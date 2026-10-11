export function scrollPosition(
  element: Element,
  viewportRatio: number,
  edge: 'top' | 'bottom' = 'top',
) {
  return (
    scrollY +
    element.getBoundingClientRect()[edge] -
    innerHeight * viewportRatio
  )
}
