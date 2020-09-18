import {
  projectPoint,
  getDistance,
  getSector,
  mod,
  getDelta,
  getAngle,
  getAngliness,
  rotatePoint,
  getPointBetween,
  doRectanglesCollide,
  getRayRectangleIntersectionPoints,
  getSegmentRectangleIntersectionPoints,
  getSegmentRoundedRectangleIntersectionPoints,
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
export default function getBoxToBoxArrow(
  x0: number,
  y0: number,
  w0: number,
  h0: number,
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  options: ArrowOptions = {} as ArrowOptions
) {
  let i0x: number, i0y: number, i1x: number, i1y: number

  const {
    bow = 0,
    stretch = 0.5,
    stretchMin = 0,
    stretchMax = 420,
    padStart = 0,
    padEnd = 20,
    flip = false,
    straights = true,
  } = options

  const cx0 = x0 + w0 / 2,
    cy0 = y0 + h0 / 2,
    cx1 = x1 + w1 / 2,
    cy1 = y1 + h1 / 2,
    px0 = x0 - padStart,
    py0 = y0 - padStart,
    pw0 = w0 + padStart * 2,
    ph0 = h0 + padStart * 2,
    px1 = x1 - padEnd,
    py1 = y1 - padEnd,
    pw1 = w1 + padEnd * 2,
    ph1 = h1 + padEnd * 2

  const [mx, my] = getPointBetween(cx0, cy0, cx1, cy1, 0.5)
  const angle = getAngle(cx0, cy0, cx1, cy1)
  const angliness = getAngliness(cx0, cy0, cx1, cy1)
  const minLength = Math.min(pw0, ph0, pw1, ph1) * 2
  const direct = getDistance(x0, y0, x1, y1)
  const overflow = minLength - direct
  const isColliding = doRectanglesCollide(
    px0,
    py0,
    pw0,
    ph0,
    px1,
    py1,
    pw1,
    ph1
  )

  if (
    straights &&
    ([0, 1, Infinity].includes(angliness) || cx0 === cx1 || cy0 === cy1) &&
    !isColliding
  ) {
    // Straight line between points
    ;[[i0x, i0y]] = getSegmentRectangleIntersectionPoints(
      cx0,
      cy0,
      cx1,
      cy1,
      px0,
      py0,
      pw0,
      ph0
    )
    ;[[i1x, i1y]] = getSegmentRectangleIntersectionPoints(
      cx0,
      cy0,
      cx1,
      cy1,
      px1,
      py1,
      pw1,
      ph1
    )
    return [i0x, i0y, mx, my, i1x, i1y, angle, angle + Math.PI, angle]
  }

  // ⤜⤏ Arrow is an arc!

  // Is the arc clockwise or counterclockwise?
  let rot = (getSector(angle) % 2 === 0 ? 1 : -1) * (flip ? -1 : 1)

  // Calculate how much the line should "bow" away from center
  const stretchEffect = mod(direct, [stretchMin, stretchMax], [1, 0], true)
  let arc = bow + (stretchEffect * stretch) / 2

  // Step 1 ⤜⤏ Find padded points.

  // Get control point.
  let [cx, cy] = getPointBetween(cx0, cy0, cx1, cy1, 0.5 - arc)

    // Rotate control point (clockwise or counterclockwise).
  ;[cx, cy] = rotatePoint(cx, cy, mx, my, (Math.PI / 2) * rot)

  if (overflow > 0) {
    ;[cx, cy] = projectPoint(
      cx,
      cy,
      angle + (Math.PI / 2) * -rot,
      overflow * arc
    )
  }

  // Get padded start point.
  let i0 = getSegmentRoundedRectangleIntersectionPoints(
    cx0,
    cy0,
    cx1,
    cy1,
    px0,
    py0,
    pw0,
    ph0,
    padStart
  )

  // Get padded end point.
  let i1 = getSegmentRoundedRectangleIntersectionPoints(
    cx0,
    cy0,
    cx1,
    cy1,
    px1,
    py1,
    pw1,
    ph1,
    padEnd
  )

  const boxesOverlapped =
    px0 < px1 + pw1 && px0 + pw0 > px1 && py0 < py1 + ph1 && py0 + ph0 > py1

  if (boxesOverlapped) {
    // Basically, shoot a ray based on the opposite angle between
    // the two centers, and see where it intersects the rectangles.
    // This part can definitely be improved!

    const [dx, dy] = getDelta(angle + Math.PI)
    ;[[i0x, i0y]] = getRayRectangleIntersectionPoints(
      cx0,
      cy0,
      dx,
      dy,
      px0,
      py0,
      pw0,
      ph0
    )
    ;[[i1x, i1y]] = getRayRectangleIntersectionPoints(
      cx1,
      cy1,
      dx,
      dy,
      px1,
      py1,
      pw1,
      ph1
    )
    arc = (bow + stretchEffect * stretch) * -1
  } else {
    // Otherwise, destructure out the intersection points
    ;[[i0x, i0y]] = i0
    ;[[i1x, i1y]] = i1
    arc = bow + stretchEffect * stretch
  }

  // Step 3 ⤜⤏ Calculate arrow points using same algorithm as getArrow

  const [mx1, my1] = getPointBetween(i0x, i0y, i1x, i1y, 0.5)
  ;[cx, cy] = getPointBetween(i0x, i0y, i1x, i1y, 0.5 - arc)
  ;[cx, cy] = rotatePoint(cx, cy, mx1, my1, Math.PI / (2 * rot))

  const as = getAngle(cx, cy, i0x, i0y)
  const ae = getAngle(cx, cy, i1x, i1y)

  return [i0x, i0y, cx, cy, i1x, i1y, ae, as, angle]
}
