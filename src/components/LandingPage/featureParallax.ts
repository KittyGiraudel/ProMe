type ParallaxInput = {
  rectTop: number
  rectHeight: number
  viewportHeight: number
  reversed: boolean
}

type ParallaxOutput = {
  translateY: number
  rotateY: number
  rotateX: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

export function getFeatureVisualParallax({
  rectTop,
  rectHeight,
  viewportHeight,
  reversed,
}: ParallaxInput): ParallaxOutput {
  const cardCenter = rectTop + rectHeight / 2
  const viewportCenter = viewportHeight / 2
  const offsetRatio = clamp(
    (cardCenter - viewportCenter) / viewportHeight,
    -1,
    1
  )

  const translateY = Number((offsetRatio * 18).toFixed(2))
  const rotateX = Number((5 + offsetRatio * 1.8).toFixed(2))
  const rotateY = Number(
    (reversed ? 10 + offsetRatio * 3.2 : -10 - offsetRatio * 3.2).toFixed(2)
  )

  return { translateY, rotateX, rotateY }
}
