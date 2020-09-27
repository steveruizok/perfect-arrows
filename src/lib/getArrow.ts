import {
  getAngle,
  getDistance,
  getAngliness,
  projectPoint,
  getPointBetween,
  getSector,
  rotatePoint,
  modulate,
} from "./utils"

export type ArrowOptions = {
  bow?: number
  stretchMin?: number
  stretchMax?: number
  stretch?: number
  padStart?: number
  padEnd?: number
  flip?: boolean
  straights?: boolean
}

/**
 * getArrow
 * Get the points for a linking line between two points.
 * @description Draw an arrow between two points.
 * @param x0 The x position of the "from" point.
 * @param y0 The y position of the "from" point.
 * @param x1 The x position of the "to" point.
 * @param y1 The y position of the "to" point.
 * @param options Additional options for computing the line.
 * @returns [sx, sy, cx, cy, e1, e2, ae, as, ac]
 * @example
 * const arrow = getArrow(0, 0, 100, 200, {
    bow: 0
    stretch: .5
    stretchMin: 0
    stretchMax: 420
    padStart: 0
    padEnd: 0
    flip: false
    straights: true
 * })
 * 
 * const [
 *  startX, startY, 
 *  controlX, controlY, 
 *  endX, endY, 
 *  endAngle, 
 *  startAngle,
 *  controlAngle
 *  ] = arrow
 */
export default function getArrow(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  options: ArrowOptions = {} as ArrowOptions
): number[] {
  const {
    bow = 0,
    stretch = 0.5,
    stretchMin = 0,
    stretchMax = 420,
    padStart = 0,
    padEnd = 0,
    flip = false,
    straights = true,
  } = options

  const angle = getAngle(x0, y0, x1, y1)
  const dist = getDistance(x0, y0, x1, y1)
  const angliness = getAngliness(x0, y0, x1, y1)

  // Step 0 ⤜⤏ Should the arrow be straight?

  if (
    dist < (padStart + padEnd) * 2 || // Too short
    (bow === 0 && stretch === 0) || // No bow, no stretch
    (straights && [0, 1, Infinity].includes(angliness)) // 45 degree angle
  ) {
    // ⤜⤏ Arrow is straight! Just pad start and end points.

    // Padding distances
    const ps = Math.max(0, Math.min(dist - padStart, padStart))
    const pe = Math.max(0, Math.min(dist - ps, padEnd))

    // Move start point toward end point
    let [px0, py0] = projectPoint(x0, y0, angle, ps)

    // Move end point toward start point
    let [px1, py1] = projectPoint(x1, y1, angle + Math.PI, pe)

    // Get midpoint between new points
    const [mx, my] = getPointBetween(px0, py0, px1, py1, 0.5)

    return [px0, py0, mx, my, px1, py1, angle, angle, angle]
  }

  // ⤜⤏ Arrow is an arc!

  // Is the arc clockwise or counterclockwise?
  let rot = (getSector(angle) % 2 === 0 ? 1 : -1) * (flip ? -1 : 1)

  // Calculate how much the line should "bow" away from center
  const arc =
    bow + modulate(dist, [stretchMin, stretchMax], [1, 0], true) * stretch

  // Step 1 ⤜⤏ Find padded points.

  // Get midpoint.
  const [mx, my] = getPointBetween(x0, y0, x1, y1, 0.5)

  // Get control point.
  let [cx, cy] = getPointBetween(x0, y0, x1, y1, 0.5 - arc)

    // Rotate control point (clockwise or counterclockwise).
  ;[cx, cy] = rotatePoint(cx, cy, mx, my, (Math.PI / 2) * rot)

  // Get padded start point.
  const a0 = getAngle(x0, y0, cx, cy)
  const [px0, py0] = projectPoint(x0, y0, a0, padStart)

  // Get padded end point.
  const a1 = getAngle(x1, y1, cx, cy)
  const [px1, py1] = projectPoint(x1, y1, a1, padEnd)

  // Step 2  ⤜⤏ Find start and end angles.

  // Start angle
  const as = getAngle(cx, cy, x0, y0)

  // End angle
  const ae = getAngle(cx, cy, x1, y1)

  // Step 3 ⤜⤏ Find control point for padded points.

  // Get midpoint between padded start / end points.
  const [mx1, my1] = getPointBetween(px0, py0, px1, py1, 0.5)

  // Get control point for padded start / end points.
  let [cx1, cy1] = getPointBetween(px0, py0, px1, py1, 0.5 - arc)

    // Rotate control point (clockwise or counterclockwise).
  ;[cx1, cy1] = rotatePoint(cx1, cy1, mx1, my1, (Math.PI / 2) * rot)

  // Finally, average the two control points.
  let [cx2, cy2] = getPointBetween(cx, cy, cx1, cy1, 0.5)

  return [px0, py0, cx2, cy2, px1, py1, ae, as, angle]
}
