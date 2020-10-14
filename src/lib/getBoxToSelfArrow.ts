import {
  getSegmentCircleIntersections,
  getSegmentRectangleIntersectionPoints,
} from "./utils"

/**
 * dotProduct
 * Get the angle (in radians) between two segments with a common point
 * @param cx The x-axis coordinate of the common point
 * @param cy The y-axis coordinate of the common point.
 * @param p0x The x-axis coordinate of the first segment end point.
 * @param p0y The y-axis coordinate of the first segment end point.
 * @param p1x The x-axis coordinate of the second segment end point.
 * @param p1y The y-axis coordinate of the second segment end point.
 */
function dotProduct(
  cx: number,
  cy: number,
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number
) {
  const x1 = p0x - cx
  const y1 = p0y - cy
  const x2 = p1x - cx
  const y2 = p1y - cy

  const angle = Math.acos(
    (x1 * x2 + y1 * y2) /
      (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2))
  )

  return angle
}

/**
 * getCircleRectangleIntersectionPoints
 * Get all the points where the circumference intersects the box
 * @param cx The x-axis coordinate of the circle.
 * @param cy The y-axis coordinate of the circle.
 * @param r The width of the circle.
 * @param x The x-axis coordinate of the box.
 * @param y The y-axis coordinate of the box.
 * @param w The width of the box.
 * @param h The height of the box.
 */
function getCircleRectangleIntersectionPoints(
  cx: number,
  cy: number,
  r: number,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const segments = [
    [x, y, x + w, y],
    [x, y + h, x + w, y + h],
    [x, y, x, y + h],
    [x + w, y, x + w, y + h],
  ]

  let intersectionPoints = []

  for (let segment of segments) {
    let points = getSegmentCircleIntersections(
      cx,
      cy,
      r,
      segment[0],
      segment[1],
      segment[2],
      segment[3]
    )

    if (points.length) {
      for (let point of points) {
        intersectionPoints.push(point)
      }
    }
  }

  return intersectionPoints
}

/**
 * getPointSide
 * Get side (left | right | none) of the point against segment
 * @param x0 The x-axis coordinate of the segment start.
 * @param y0 The y-axis coordinate of the segment start.
 * @param x1 The x-axis coordinate of the segment end.
 * @param y1 The y-axis coordinate of the segment end.
 * @param px The x-axis coordinate of the point.
 * @param py The y-axis coordinate of the point.
 */
function getPointSide(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  px: number,
  py: number
): "left" | "right" | "none" {
  x1 -= x0
  y1 -= y0
  px -= x0
  py -= y0

  // Determining cross Product
  let cross_product = x1 * py - y1 * px

  if (cross_product > 0) return "right"

  if (cross_product < 0) return "left"

  return "none"
}

/**
 * polarToCartesian
 * Conversts polar coordinate to cartesian
 * @param cx The x-axis coordinate of the circle.
 * @param cy The y-axis coordinate of the circle.
 * @param r The radius of the circle.
 * @param angle The polar coordinate angle (radians).
 */
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  angle -= Math.PI / 2

  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

/**
 * getBoxToSelfArrow
 * Get the arrow points for linking box to itself
 * @param x The x-axis coordinate of the box.
 * @param y The y-axis coordinate of the box.
 * @param w The width of the box.
 * @param h The height of the box.
 * @param r The radius of the arrow arc.
 * @param angle The angle (radians) between the center of the box and the center of the arc.
 * @param padStart The start point padding.
 * @param padEnd The end point padding.
 */
export default function getBoxToSelfArrow(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  angle: number,
  padStart: number,
  padEnd: number
):
  | {
      radius: number
      start: {
        x: number
        y: number
      }
      end: {
        x: number
        y: number
      }
      startAngle: number
      endAngle: number
    }
  | undefined {
  // Define radius-vector variables.
  // Radius-vector is a ray with len = max(w,h) from the center of the box
  const rvAngle = angle - Math.PI / 2
  const rvLength = Math.max(w, h)
  const rvStartX = x + w / 2
  const rvStartY = y + h / 2

  const rv = {
    x0: rvStartX,
    y0: rvStartY,
    x1: rvStartX + rvLength * Math.cos(rvAngle),
    y1: rvStartY + rvLength * Math.sin(rvAngle),
  }

  // Get the points (always a single point) where radius-vector intersects the box
  const rvIntersectPoints = getSegmentRectangleIntersectionPoints(
    rv.x0,
    rv.y0,
    rv.x1,
    rv.y1,
    x,
    y,
    w,
    h
  )

  const rvIntersection = {
    x: rvIntersectPoints[0][0],
    y: rvIntersectPoints[0][1],
  }
  console.log("rv:", x, y, w, h, rvIntersection)

  const circumferenceLength = Math.PI * r * 2
  const padStartAngle =
    ((padStart / circumferenceLength) * 360) / (180 / Math.PI)
  const padEndAngle = ((padEnd / circumferenceLength) * 360) / (180 / Math.PI)

  // Put the circle at the radius-vector origin and
  // get instersection points between circle and the box
  const circleIntersectionPoints = getCircleRectangleIntersectionPoints(
    rvIntersection.x,
    rvIntersection.y,
    r,
    x,
    y,
    w,
    h
  )

  if (!circleIntersectionPoints.length) {
    return undefined
  }

  // Sort intersection points clockwise
  const dir = getPointSide(
    rv.x0,
    rv.y0,
    rv.x1,
    rv.y1,
    circleIntersectionPoints[0][0],
    circleIntersectionPoints[0][1]
  )

  const leftPoint =
    dir === "left"
      ? [circleIntersectionPoints[0][0], circleIntersectionPoints[0][1]]
      : [circleIntersectionPoints[1][0], circleIntersectionPoints[1][1]]

  const rightPoint =
    dir === "left"
      ? [circleIntersectionPoints[1][0], circleIntersectionPoints[1][1]]
      : [circleIntersectionPoints[0][0], circleIntersectionPoints[0][1]]

  const arcAngleStart = dotProduct(
    rvIntersection.x,
    rvIntersection.y,
    leftPoint[0],
    leftPoint[1],
    rv.x1,
    rv.y1
  )

  const arcAngleEnd = dotProduct(
    rvIntersection.x,
    rvIntersection.y,
    rightPoint[0],
    rightPoint[1],
    rv.x1,
    rv.y1
  )

  const startAngle = angle - arcAngleStart + padStartAngle
  const endAngle = angle + arcAngleEnd - padEndAngle

  const start = polarToCartesian(
    rvIntersection.x,
    rvIntersection.y,
    r,
    startAngle
  )
  const end = polarToCartesian(rvIntersection.x, rvIntersection.y, r, endAngle)

  return {
    radius: r,
    start,
    end,
    startAngle,
    endAngle,
  }
}
