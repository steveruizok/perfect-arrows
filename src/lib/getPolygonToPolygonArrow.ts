import polylabel from "polylabel"
import Offset from "polygon-offset"

import {
  getDistance,
  getSector,
  modulate,
  getDelta,
  getAngle,
  rotatePoint,
  getPointBetween,
  doPolygonsCollide,
  getIntermediate,
  pointInPolygon,
  castRay,
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
const MIN_ANGLE = PI / 24

export default function getPolygonToPolygonArrow(
  pointsA: number[][],
  pointsB: number[][],
  options: ArrowOptions = {} as ArrowOptions
) {
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

  if (pointsA.length + pointsB.length < 4) {
    throw Error("Polygons must each have two vertices.")
  }

  let vertsA = [pointsA]
  let vertsB = [pointsB]

  if (padStart > 0) {
    vertsA = new Offset().data(pointsA).margin(padStart)
  }
  if (padEnd > 0) {
    vertsB = new Offset().data(pointsB).margin(padEnd)
  }

  const [cx0, cy0] = polylabel(vertsA, 1)
  const [cx1, cy1] = polylabel(vertsB, 1)

  // Angle between centers
  const angle = getAngle(cx0, cy0, cx1, cy1)

  // Distance between centers
  const distance = getDistance(cx0, cy0, cx1, cy1)
  const [dx, dy] = [cx1 - cx0, cy1 - cy0]

  let {
    point: [sx, sy],
  } = castRay([cx0, cy0], [dx, dy], ({ point }) => {
    if (!pointInPolygon(point, vertsA[0])) return true
    return
  })

  let {
    point: [ex, ey],
  } = castRay([sx, sy], [dx, dy], ({ point }) => {
    if (pointInPolygon(point, vertsB[0])) return true
    return
  })

  // Rotation of the arrow, clockwise or anticlockwise
  const rot = (getSector(angle) % 2 === 0 ? -1 : 1) * (flip ? -1 : 1)

  // How cardinal is the angle? 0 = 45deg, 1 = 90deg
  let card = getIntermediate(angle)

  if (card < 1 && card > 0.85) card = 0.99

  // // Are the boxes colliding / overlapping?
  const isColliding = doPolygonsCollide(vertsA[0], vertsB[0])

  // Length of the direct line between boxes
  const distanceBetween = getDistance(sx, sy, ex, ey)

  // /* ------------- RETURN A STRAIGHT ARROW ------------ */

  // Should we just draw a straight line?
  if (!isColliding && straights && card % 0.5 === 0) {
    const [mpdx, mpdy] = getPointBetween(sx, sy, ex, ey, 0.5)
    return [sx, ey, mpdx, mpdy, sx, ey, angle, angle - PI, angle]
  }

  // /* -------------- RETURN A CURVED ARROW ------------- */

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

  arc *= 1 + (Math.max(-2, Math.min(distEffect, 2)) * card - overlapEffect) / 2

  if (isColliding) {
    arc = arc < 0 ? Math.min(arc, -0.5) : Math.max(arc, 0.5)
  }

  // /* ----------------- STARTING POINT ----------------- */

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

  const combinedOffset0 =
    distOffset + angleOffset * (isColliding ? 1 - overlapEffect : 1)

  // Angle of the first box
  const finalAngle0 =
    overlapEffect >= 0.5
      ? angle + PI * rot
      : angle + Math.max(MIN_ANGLE, combinedOffset0) * rot

  // Deltas of starting angle
  const [dx0, dy0] = getDelta(finalAngle0)

  const start = castRay([cx0, cy0], [dx0, dy0], ({ point }) => {
    if (!pointInPolygon(point, vertsA[0])) return true
    return
  })
  ;[sx, sy] = start.point

  // /* ------------------ ENDING POINT ------------------ */

  const distOffset1 = modulate(distEffect, [0.75, 1], [0, 1], true)

  const overlapEffect1 = isColliding
    ? modulate(overlapEffect, [0, 1], [0, PI / 8], true)
    : 0

  const cardEffect1 = modulate(card * distOffset1, [0, 1], [0, PI / 16], true)

  const combinedOffset1 =
    distEffect * (PI / 12) +
    (cardEffect1 + overlapEffect1) +
    (distOffset + angleOffset) / 2

  const finalAngle1 =
    overlapEffect >= 0.5
      ? angle + PI * rot
      : angle + PI - Math.max(combinedOffset1, MIN_ANGLE) * rot

  // Deltas of ending angle
  const [dx1, dy1] = getDelta(finalAngle1)

  const end = castRay([cx1, cy1], [dx1, dy1], ({ point }) => {
    if (!pointInPolygon(point, vertsB[0])) return true
    return
  })
  ;[ex, ey] = end.point

  // /* ------------------- DRAW ARROWS ------------------ */

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
