import {
  getDistance,
  getSector,
  modulate,
  getDelta,
  getAngle,
  rotatePoint,
  getPointBetween,
  doRectanglesCollide,
  getIntermediate,
  getLineBetweenRoundedRectangles,
  normalizeAngle,
  getRayRoundedRectangleIntersection,
  getRectangleSegmentIntersectedByRay,
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

const PI = Math.PI
const PI2 = PI * 2
const MIN_ANGLE = PI / 24

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
  let sx: number, sy: number, ex: number, ey: number

  const {
    bow = 0,
    stretch = 0.25,
    stretchMin = 50,
    stretchMax = 420,
    padStart = 0,
    padEnd = 20,
    flip = false,
    straights = true,
  } = options

  const px0 = x0 - padStart,
    py0 = y0 - padStart,
    pw0 = w0 + padStart * 2,
    ph0 = h0 + padStart * 2,
    px1 = x1 - padEnd,
    py1 = y1 - padEnd,
    pw1 = w1 + padEnd * 2,
    ph1 = h1 + padEnd * 2,
    cx0 = x0 + w0 / 2,
    cy0 = y0 + h0 / 2,
    cx1 = x1 + w1 / 2,
    cy1 = y1 + h1 / 2

  // Angle between centers
  const angle = normalizeAngle(getAngle(cx0, cy0, cx1, cy1))

  // Distance between centers
  const distance = getDistance(cx0, cy0, cx1, cy1)

  // Perfect overlap, no arrow.
  if (distance === 0) {
    const [sx, sy] = [cx0, py0]
    const [ex, ey] = [cx1, py1]
    const [cx, cy] = getPointBetween(sx, sy, ex, ey, 0.5)
    const ca = getAngle(sx, sy, ex, ey)
    return [sx, sy, cx, cy, ex, ey, ca, ca, ca]
  }

  // Rotation of the arrow, clockwise or anticlockwise
  const rot = (getSector(angle) % 2 === 0 ? -1 : 1) * (flip ? -1 : 1)

  // How cardinal is the angle? 0 = 45deg, 1 = 90deg
  let card = getIntermediate(angle)

  if (card < 1 && card > 0.85) card = 0.99

  // Are the boxes colliding / overlapping?
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

  // Direct line between boxes
  const [dix0, diy0, dix1, diy1] = getLineBetweenRoundedRectangles(
    px0,
    py0,
    pw0,
    ph0,
    padStart,
    px1,
    py1,
    pw1,
    ph1,
    padEnd
  )

  // Length of the direct line between boxes
  const distanceBetween = getDistance(dix0, diy0, dix1, diy1)

  /* ------------- RETURN A STRAIGHT ARROW ------------ */

  // Should we just draw a straight line?
  if (!isColliding && straights && card % 0.5 === 0) {
    const [mpdx, mpdy] = getPointBetween(dix0, diy0, dix1, diy1, 0.5)
    return [dix0, diy0, mpdx, mpdy, dix1, diy1, angle, angle - PI, angle]
  }

  /* -------------- RETURN A CURVED ARROW ------------- */

  // How much are the two boxes overlapping?
  let overlapEffect = isColliding
    ? modulate(distanceBetween, [0, distance], [0, 1], true)
    : 0

  // How far away are the two boxes?
  const distEffect = 1 - distanceBetween / distance

  // How much should the stretch impact the arc?
  const stretchEffect = modulate(
    distanceBetween,
    [stretchMin, stretchMax],
    [1, 0],
    true
  )

  // What should the curved line's arc be?
  let arc = bow + stretchEffect * stretch

  // How much should the angle's intermediacy (45degree-ness) affect the angle?
  let angleOffset = modulate(
    card * card, // a better curve here?
    [0, 1],
    [PI * 0.125, 0],
    true
  )

  const distOffset = isColliding
    ? PI * 0.5 * card
    : modulate(
        distEffect, // a better curve here?
        [0.75, 1],
        [0, PI * 0.5],
        true
      ) * card

  const combinedOffset =
    distOffset + angleOffset * (isColliding ? 1 - overlapEffect : 1)

  /* ----------------- STARTING POINT ----------------- */

  // Angle of the first box
  let finalAngle0 =
    overlapEffect >= 0.5
      ? angle + PI * rot
      : angle + Math.max(MIN_ANGLE, combinedOffset) * rot

  // Deltas of starting angle
  const [dx0, dy0] = getDelta(+(finalAngle0 % PI2).toPrecision(3))

  // Get ray intersection with rounded rectangle
  const [[tsx, tsy]] = getRayRoundedRectangleIntersection(
    cx0,
    cy0,
    dx0,
    dy0,
    px0,
    py0,
    pw0,
    ph0,
    padStart
  )

  // Get midpoint of startingintersected segment
  const startSeg = getRectangleSegmentIntersectedByRay(
    px0,
    py0,
    pw0,
    ph0,
    cx0,
    cy0,
    dx0,
    dy0
  )

  if (!startSeg) throw Error

  // Find start point (quarter way between segment midpoint and ray intersection)
  const [ssx0, ssy0, ssx1, ssy1] = startSeg
  const [smpx, smpy] = getPointBetween(ssx0, ssy0, ssx1, ssy1, 0.5)
  ;[sx, sy] = getPointBetween(
    tsx,
    tsy,
    smpx,
    smpy,
    isColliding ? Math.max(overlapEffect, 0.15) : 0.15
  )

  arc *= 1 + (Math.max(-2, Math.min(distEffect, 2)) * card - overlapEffect) / 2

  if (isColliding) {
    arc = arc < 0 ? Math.min(arc, -0.5) : Math.max(arc, 0.5)
  }

  /* ------------------ ENDING POINT ------------------ */

  if (overlapEffect >= 0.5) {
    // If overlapping, use the same angle as the start
    const rayAngle = getAngle(cx0, cy0, smpx, smpy)
    const [dx1, dy1] = getDelta(rayAngle)
    ;[[ex, ey]] = getRayRoundedRectangleIntersection(
      cx1,
      cy1,
      dx1,
      dy1,
      px1,
      py1,
      pw1,
      ph1,
      padEnd
    )
  } else {
    // Calculate an angle based on distance, overlap and intermediacy
    const distOffset1 = modulate(distEffect, [0.75, 1], [0, 1], true)

    const overlapEffect1 = isColliding
      ? modulate(overlapEffect, [0, 1], [0, PI / 8], true)
      : 0

    const cardEffect1 = modulate(card * distOffset1, [0, 1], [0, PI / 16], true)

    const combinedOffset =
      distEffect * (PI / 12) +
      (cardEffect1 + overlapEffect1) +
      (distOffset + angleOffset) / 2

    let finalAngle1 =
      overlapEffect >= 0.5
        ? angle + PI * rot
        : angle + PI - Math.max(combinedOffset, MIN_ANGLE) * rot

    // Deltas of ending angle
    const [dx1, dy1] = getDelta(+(finalAngle1 % PI2).toPrecision(3))

    // Get ray intersection with ending rounded rectangle
    const [[tex, tey]] = getRayRoundedRectangleIntersection(
      cx1,
      cy1,
      dx1,
      dy1,
      px1,
      py1,
      pw1,
      ph1,
      padEnd
    )

    // Get midpoint of ending intersected segment
    const endSeg = getRectangleSegmentIntersectedByRay(
      px1,
      py1,
      pw1,
      ph1,
      cx1,
      cy1,
      dx1,
      dy1
    )

    if (!endSeg) throw Error

    const [sex0, sey0, sex1, sey1] = endSeg
    const [empx, empy] = getPointBetween(sex0, sey0, sex1, sey1, 0.5)

      // Offset end point toward segment midpoint
    ;[ex, ey] = getPointBetween(
      tex,
      tey,
      empx,
      empy,
      0.25 + overlapEffect * 0.25
    )
  }

  /* ------------------- DRAW ARROWS ------------------ */

  // Get midpoints.
  const [mx1, my1] = getPointBetween(sx, sy, ex, ey, 0.5)
  const [tix, tiy] = getPointBetween(
    sx,
    sy,
    ex,
    ey,
    Math.max(-1, Math.min(1, 0.5 + arc)) // Clamped to 2
  )

  // Rotate them (these are our two potential corners)
  const [cixA, ciyA] = rotatePoint(tix, tiy, mx1, my1, (PI / 2) * rot)
  const [cixB, ciyB] = rotatePoint(tix, tiy, mx1, my1, (PI / 2) * -rot)

  // If we're colliding, pick the furthest corner from the end point.
  let [cix, ciy] =
    isColliding &&
    getDistance(cixA, ciyA, cx1, cy1) < getDistance(cixB, ciyB, cx1, cy1)
      ? [cixB, ciyB]
      : [cixA, ciyA]

  // Start and end angles
  const as = getAngle(cix, ciy, sx, sy)
  const ae = getAngle(cix, ciy, ex, ey)

  return [sx, sy, cix, ciy, ex, ey, ae, as, getAngle(sx, sy, ex, ey)]
}
