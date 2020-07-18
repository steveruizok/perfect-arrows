/**
 * Modulate a value between two ranges
 * @param value
 * @param a from [low, high]
 * @param b to [low, high]
 * @param clamp
 */
export function mod(value: number, a: number[], b: number[], clamp = false) {
  const [low, high] = b[0] < b[1] ? [b[0], b[1]] : [b[1], b[0]]
  const result = b[0] + ((value - a[0]) / (a[1] - b[0])) * (b[1] - b[0])

  if (clamp) {
    if (result < low) return low
    if (result > high) return high
  }

  return result
}

/**
 * Rotate a point around a center.
 * @param x
 * @param y
 * @param cx
 * @param cy
 * @param angle
 */
export function rotatePoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
) {
  const s = Math.sin(angle)
  const c = Math.cos(angle)

  const px = x - cx
  const py = y - cy

  const nx = px * c - py * s
  const ny = px * s + py * c

  return [nx + cx, ny + cy]
}

/**
 * Get the distance between two points.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
export function getDistance(x0: number, y0: number, x1: number, y1: number) {
  return Math.hypot(y1 - y0, x1 - x0)
}

/**
 * Get an angle (radians) between two points.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
export function getAngle(x0: number, y0: number, x1: number, y1: number) {
  return Math.atan2(y1 - y0, x1 - x0)
}

/**
 * Move a point in an angle by a distance.
 * @param x0
 * @param y0
 * @param a angle (radians)
 * @param d distance
 */
export function projectPoint(x0: number, y0: number, a: number, d: number) {
  return [Math.cos(a) * d + x0, Math.sin(a) * d + y0]
}

/**
 * Get a point between two points.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @param d Normalized
 */
export function getPointBetween(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  d = 0.5
) {
  return [x0 + (x1 - x0) * d, y0 + (y1 - y0) * d]
}

/**
 * Get the sector of an angle (e.g. quadrant, octant)
 * @param a angle
 * @param s number of sectors
 */
export function getSector(a: number, s = 8) {
  return Math.floor(s * (0.5 + ((a / (Math.PI * 2)) % s)))
}

/**
 * Get a normal value representing how close two points are from being at a 45 degree angle.
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
export function getAngliness(x0: number, y0: number, x1: number, y1: number) {
  return Math.abs((x1 - x0) / 2 / ((y1 - y0) / 2))
}
