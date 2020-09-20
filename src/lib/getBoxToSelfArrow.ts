import {
  projectPoint,
  getAngle,
  getCircleRoundedRectangleIntersection,
  getSegmentRoundedRectangleIntersectionPoints,
} from "./utils"

export type ArrowOptions = {
  radius?: number
  angle?: number
  padStart?: number
  padEnd?: number
  flip?: boolean
  straights?: boolean
}

/**
 * getArrowBetweenBoxes
 * Get the points for a linking line between two boxes.
 * @param x0 The x-axis coordinate of the first box.
 * @param y0 The y-axis coordinate of the first box.
 * @param w0 The width of the first box.
 * @param h0 The height of the first box.
 * @param x1 The x-axis coordinate of the second box.
 * @param y1 The y-axis coordinate of the second box.
 * @param w1 The width of the second box.
 * @param h1 The height of the second box.
 * @param options
 */
export default function getBoxToSelfArrow(
  x: number,
  y: number,
  w: number,
  h: number,
  options: ArrowOptions = {} as ArrowOptions
) {
  const { radius = 16, angle = -Math.PI / 4, padStart = 0 } = options

  const cx = x + w / 2,
    cy = y + h / 2,
    px = x - padStart,
    py = y - padStart,
    pw = w + padStart * 2,
    ph = h + padStart * 2

  const [bx, by] = projectPoint(cx, cy, angle, pw + ph)

  // TODO: Get a proper ray -> rounded rectange intersection
  const [[ix, iy]] = getSegmentRoundedRectangleIntersectionPoints(
    cx,
    cy,
    bx,
    by,
    px,
    py,
    pw,
    ph,
    padStart
  )

  const startIntersections = getCircleRoundedRectangleIntersection(
    ix,
    iy,
    radius,
    px,
    py,
    pw,
    ph,
    0
  )

  const [sx, sy] = startIntersections[1]

  const sa = getAngle(ix, iy, sx, sy)

  const endIntersections = getCircleRoundedRectangleIntersection(
    ix,
    iy,
    radius,
    px,
    py,
    pw,
    ph,
    0
  )

  const [ex, ey] = endIntersections[0]

  const ea = getAngle(ix, iy, ex, ey)

  return [sx, sy, ix, iy, ex, ey, sa, ea, angle + Math.PI / 2]
}
