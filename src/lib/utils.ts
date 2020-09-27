const PI = Math.PI

/**
 * Modulate a value between two ranges.
 * @param value
 * @param rangeA from [low, high]
 * @param rangeB to [low, high]
 * @param clamp
 */
export function modulate(
  value: number,
  rangeA: number[],
  rangeB: number[],
  clamp = false
) {
  const [fromLow, fromHigh] = rangeA
  const [toLow, toHigh] = rangeB
  const result =
    toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow)
  if (clamp === true) {
    if (toLow < toHigh) {
      if (result < toLow) {
        return toLow
      }
      if (result > toHigh) {
        return toHigh
      }
    } else {
      if (result > toLow) {
        return toLow
      }
      if (result < toHigh) {
        return toHigh
      }
    }
  }
  return result
}

/**
 * Rotate a point around a center.
 * @param x The x-axis coordinate of the point.
 * @param y The y-axis coordinate of the point.
 * @param cx The x-axis coordinate of the point to rotate round.
 * @param cy The y-axis coordinate of the point to rotate round.
 * @param angle The distance (in radians) to rotate.
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
 * @param x0 The x-axis coordinate of the first point.
 * @param y0 The y-axis coordinate of the first point.
 * @param x1 The x-axis coordinate of the second point.
 * @param y1 The y-axis coordinate of the second point.
 */
export function getDistance(x0: number, y0: number, x1: number, y1: number) {
  return Math.hypot(y1 - y0, x1 - x0)
}

/**
 * Get an angle (radians) between two points.
 * @param x0 The x-axis coordinate of the first point.
 * @param y0 The y-axis coordinate of the first point.
 * @param x1 The x-axis coordinate of the second point.
 * @param y1 The y-axis coordinate of the second point.
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
 * @param x0 The x-axis coordinate of the first point.
 * @param y0 The y-axis coordinate of the first point.
 * @param x1 The x-axis coordinate of the second point.
 * @param y1 The y-axis coordinate of the second point.
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
 * @param a The angle to check.
 * @param s The number of sectors to check.
 */
export function getSector(a: number, s = 8) {
  return Math.floor(s * (0.5 + ((a / (PI * 2)) % s)))
}

/**
 * Get a normal value representing how close two points are from being at a 45 degree angle.
 * @param x0 The x-axis coordinate of the first point.
 * @param y0 The y-axis coordinate of the first point.
 * @param x1 The x-axis coordinate of the second point.
 * @param y1 The y-axis coordinate of the second point.
 */
export function getAngliness(x0: number, y0: number, x1: number, y1: number) {
  return Math.abs((x1 - x0) / 2 / ((y1 - y0) / 2))
}

/**
 * Get the points at which an ellipse intersects a rectangle.
 * @param x
 * @param y
 * @param w
 * @param h
 * @param cx
 * @param cy
 * @param rx
 * @param ry
 * @param angle
 */
export function getEllipseRectangleIntersectionPoints(
  x: number,
  y: number,
  w: number,
  h: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle: number
) {
  let points: number[][] = []

  for (let [px0, py0, px1, py1] of [
    [x, y, x + w, y],
    [x + w, y, x + w, y + h],
    [x + w, y + h, x, y + h],
    [x, y + h, x, y],
  ]) {
    const ints = getEllipseSegmentIntersections(
      px0,
      py0,
      px1,
      py1,
      cx,
      cy,
      rx,
      ry,
      angle
    )

    if (ints.length > 0) {
      points.push(...ints)
    }
  }

  points = points.sort(([x0, y0], [x1, y1]) => {
    return Math.sin(getAngle(cx, cy, x0, y0) - getAngle(cx, cy, x1, y1)) > 0
      ? -1
      : 1
  })

  return points
}

/**
 * Find the point(s) where a line segment intersects an ellipse.
 * @param x0 The x-axis coordinate of the line's start point.
 * @param y0 The y-axis coordinate of the line's start point.
 * @param x1 The x-axis coordinate of the line's end point.
 * @param y1 The y-axis coordinate of the line's end point.
 * @param cx The x-axis (horizontal) coordinate of the ellipse's center.
 * @param cy The y-axis (vertical) coordinate of the ellipse's center.
 * @param rx The ellipse's major-axis radius. Must be non-negative.
 * @param ry The ellipse's minor-axis radius. Must be non-negative.
 * @param rotation The rotation of the ellipse, expressed in radians.
 * @param segment_only When true, will test the segment as a line (of infinite length).
 */
export function getEllipseSegmentIntersections(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rotation = 0,
  segment_only = true
) {
  // If the ellipse or line segment are empty, return no tValues.
  if (rx === 0 || ry === 0 || (x0 === x1 && y0 === y1)) {
    return []
  }

  // Get the semimajor and semiminor axes.
  rx = rx < 0 ? rx : -rx
  ry = ry < 0 ? ry : -ry

  // Rotate points.
  if (rotation !== 0) {
    ;[x0, y0] = rotatePoint(x0, y0, cx, cy, -rotation)
    ;[x1, y1] = rotatePoint(x1, y1, cx, cy, -rotation)
  }

  // Translate so the ellipse is centered at the origin.
  x0 -= cx
  y0 -= cy
  x1 -= cx
  y1 -= cy

  // Calculate the quadratic parameters.
  var A = ((x1 - x0) * (x1 - x0)) / rx / rx + ((y1 - y0) * (y1 - y0)) / ry / ry
  var B = (2 * x0 * (x1 - x0)) / rx / rx + (2 * y0 * (y1 - y0)) / ry / ry
  var C = (x0 * x0) / rx / rx + (y0 * y0) / ry / ry - 1

  // Make a list of t values (normalized points on the line where intersections occur).
  var tValues: number[] = []

  // Calculate the discriminant.
  var discriminant = B * B - 4 * A * C

  if (discriminant === 0) {
    // One real solution.
    tValues.push(-B / 2 / A)
  } else if (discriminant > 0) {
    // Two real solutions.
    tValues.push((-B + Math.sqrt(discriminant)) / 2 / A)
    tValues.push((-B - Math.sqrt(discriminant)) / 2 / A)
  }

  return (
    tValues
      // Filter to only points that are on the segment.
      .filter(t => !segment_only || (t >= 0 && t <= 1))
      // Solve for points.
      .map(t => [x0 + (x1 - x0) * t + cx, y0 + (y1 - y0) * t + cy])
      // Counter-rotate points
      .map(p =>
        rotation === 0 ? p : rotatePoint(p[0], p[1], cx, cy, rotation)
      )
  )
}

/**
 * Check whether two rectangles will collide (overlap).
 * @param x0 The x-axis coordinate of the first rectangle.
 * @param y0 The y-axis coordinate of the first rectangle.
 * @param w0 The width of the first rectangle.
 * @param h0 The height of the first rectangle.
 * @param x1 The x-axis coordinate of the second rectangle.
 * @param y1 The y-axis coordinate of the second rectangle.
 * @param w1 The width of the second rectangle.
 * @param h1 The height of the second rectangle.
 */
export function doRectanglesCollide(
  x0: number,
  y0: number,
  w0: number,
  h0: number,
  x1: number,
  y1: number,
  w1: number,
  h1: number
) {
  return !(x0 >= x1 + w1 || x1 >= x0 + w0 || y0 >= y1 + h1 || y1 >= y0 + h0)
}

/**
 * Find the point(s) where a segment intersects a rectangle.
 * @param x0 The x-axis coordinate of the segment's starting point.
 * @param y0 The y-axis coordinate of the segment's starting point.
 * @param x1 The x-axis coordinate of the segment's ending point.
 * @param y1 The y-axis coordinate of the segment's ending point.
 * @param x The x-axis coordinate of the rectangle.
 * @param y The y-axis coordinate of the rectangle.
 * @param w The width of the rectangle.
 * @param h The height of the rectangle.
 */
export function getSegmentRectangleIntersectionPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x: number,
  y: number,
  w: number,
  h: number
) {
  let points: number[][] = []

  for (let [px0, py0, px1, py1] of [
    [x, y, x + w, y],
    [x + w, y, x + w, y + h],
    [x + w, y + h, x, y + h],
    [x, y + h, x, y],
  ]) {
    const ints = getSegmentSegmentIntersection(
      px0,
      py0,
      px1,
      py1,
      x0,
      y0,
      x1,
      y1
    )
    if (ints) {
      points.push(ints)
    }
  }

  return points
}

/**
 * Find the point, if any, where two segments intersect.
 * @param x0 The x-axis coordinate of the first segment's starting point.
 * @param y0 The y-axis coordinate of the first segment's starting point.
 * @param x1 The x-axis coordinate of the first segment's ending point.
 * @param y1 The y-axis coordinate of the first segment's ending point.
 * @param x2 The x-axis coordinate of the second segment's starting point.
 * @param y2 The y-axis coordinate of the second segment's starting point.
 * @param x3 The x-axis coordinate of the second segment's ending point.
 * @param y3 The y-axis coordinate of the second segment's ending point.
 */
export function getSegmentSegmentIntersection(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  const denom = (y3 - y2) * (x1 - x0) - (x3 - x2) * (y1 - y0)
  const numeA = (x3 - x2) * (y0 - y2) - (y3 - y2) * (x0 - x2)
  const numeB = (x1 - x0) * (y0 - y2) - (y1 - y0) * (x0 - x2)

  if (denom === 0) {
    if (numeA === 0 && numeB === 0) {
      return undefined // Colinear
    }
    return undefined // Parallel
  }

  const uA = numeA / denom
  const uB = numeB / denom

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return [x0 + uA * (x1 - x0), y0 + uA * (y1 - y0)]
  }

  return undefined // No intersection
}

/**
 * Get the intersection points between a line segment and a rectangle with rounded corners.
 * @param x0 The x-axis coordinate of the segment's starting point.
 * @param y0 The y-axis coordinate of the segment's ending point.
 * @param x1 The delta-x of the ray.
 * @param y1 The delta-y of the ray.
 * @param x The x-axis coordinate of the rectangle.
 * @param y The y-axis coordinate of the rectangle.
 * @param w The width of the rectangle.
 * @param h The height of the rectangle.
 * @param r The corner radius of the rectangle.
 */
export function getSegmentRoundedRectangleIntersectionPoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const mx = x + w,
    my = y + h,
    rx = x + r,
    ry = y + r,
    mrx = x + w - r,
    mry = y + h - r

  const segments = [
    [x, mry, x, ry, x, y],
    [rx, y, mrx, y, mx, y],
    [mx, ry, mx, mry, mx, my],
    [mrx, my, rx, my, x, my],
  ]

  const corners = [
    [rx, ry, PI, PI * 1.5],
    [mrx, ry, PI * 1.5, PI * 2],
    [mrx, mry, 0, PI * 0.5],
    [rx, mry, PI * 0.5, PI],
  ]

  let points: number[][] = []

  segments.forEach((segment, i) => {
    const [px0, py0, px1, py1] = segment
    const [cx, cy, as, ae] = corners[i]

    getSegmentCircleIntersections(cx, cy, r, x0, y0, x1, y1)
      .filter(pt => {
        const pointAngle = normalizeAngle(getAngle(cx, cy, pt[0], pt[1]))
        return pointAngle > as && pointAngle < ae
      })
      .forEach(pt => points.push(pt))

    const segmentInt = getSegmentSegmentIntersection(
      x0,
      y0,
      x1,
      y1,
      px0,
      py0,
      px1,
      py1
    )

    if (!!segmentInt) {
      points.push(segmentInt)
    }
  })

  return points
}

/**
 * Get the point(s) where a line segment intersects a circle.
 * @param cx The x-axis coordinate of the circle's center.
 * @param cy The y-axis coordinate of the circle's center.
 * @param r The circle's radius.
 * @param x0 The x-axis coordinate of the segment's starting point.
 * @param y0 The y-axis coordinate of ththe segment's ending point.
 * @param x1 The delta-x of the ray.
 * @param y1 The delta-y of the ray.
 */
export function getSegmentCircleIntersections(
  cx: number,
  cy: number,
  r: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  var b: number,
    c: number,
    d: number,
    u1: number,
    u2: number,
    ret: number[][],
    retP1: number[],
    retP2: number[],
    v1 = [x1 - x0, y1 - y0],
    v2 = [x0 - cx, y0 - cy]

  b = v1[0] * v2[0] + v1[1] * v2[1]
  c = 2 * (v1[0] * v1[0] + v1[1] * v1[1])
  b *= -2
  d = Math.sqrt(b * b - 2 * c * (v2[0] * v2[0] + v2[1] * v2[1] - r * r))
  if (isNaN(d)) {
    // no intercept
    return []
  }
  u1 = (b - d) / c // these represent the unit distance of point one and two on the line
  u2 = (b + d) / c
  retP1 = [] // return points
  retP2 = []
  ret = [] // return array

  if (u1 <= 1 && u1 >= 0) {
    // add point if on the line segment
    retP1[0] = x0 + v1[0] * u1
    retP1[1] = y0 + v1[1] * u1
    ret[0] = retP1
  }

  if (u2 <= 1 && u2 >= 0) {
    // second add point if on the line segment
    retP2[0] = x0 + v1[0] * u2
    retP2[1] = y0 + v1[1] * u2
    ret[ret.length] = retP2
  }

  return ret
}

/**
 * Normalize an angle (in radians)
 * @param radians The radians quantity to normalize.
 */
export function normalizeAngle(radians: number) {
  return radians - PI * 2 * Math.floor(radians / (PI * 2))
}

/**
 *
 * @param x The x-axis coordinate of the ray's origin.
 * @param y The y-axis coordinate of the ray's origin.
 * @param w
 * @param h
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
export function getRayRectangleIntersectionPoints(
  ox: number,
  oy: number,
  dx: number,
  dy: number,
  x: number,
  y: number,
  w: number,
  h: number
) {
  let points: number[][] = []

  for (let [px0, py0, px1, py1] of [
    [x, y, x + w, y],
    [x + w, y, x + w, y + h],
    [x + w, y + h, x, y + h],
    [x, y + h, x, y],
  ]) {
    const ints = getRaySegmentIntersection(ox, oy, dx, dy, px0, py0, px1, py1)
    if (ints) {
      points.push(ints)
    }
  }

  return points
}

/**
 * Get the point at which a ray intersects a segment.
 * @param x The x-axis coordinate of the ray's origin.
 * @param y The y-axis coordinate of the ray's origin.
 * @param dx The x-axis delta of the angle.
 * @param dy The y-axis delta of the angle.
 * @param x0 The x-axis coordinate of the segment's start point.
 * @param y0 The y-axis coordinate of the segment's start point.
 * @param x1 The x-axis coordinate of the segment's end point.
 * @param y1 The y-axis coordinate of the segment's end point.
 */
export function getRaySegmentIntersection(
  x: number,
  y: number,
  dx: number,
  dy: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  let r: number, s: number, d: number

  if (dy * (x1 - x0) !== dx * (y1 - y0)) {
    d = dx * (y1 - y0) - dy * (x1 - x0)
    if (d !== 0) {
      r = ((y - y0) * (x1 - x0) - (x - x0) * (y1 - y0)) / d
      s = ((y - y0) * dx - (x - x0) * dy) / d
      if (r >= 0 && s >= 0 && s <= 1) {
        return [x + r * dx, y + r * dy]
      }
    }
  }
  return undefined
}

/**
 * Get the normalized delta (x and y) for an angle.
 * @param angle The angle in radians
 */
export function getDelta(angle: number) {
  return [Math.cos(angle), Math.sin(angle)]
}

export function getIntermediate(angle: number) {
  return Math.abs(Math.abs(angle % (PI / 2)) - PI / 4) / (PI / 4)
}

/**
 * Get a line between two rounded rectangles.
 * @param x0
 * @param y0
 * @param w0
 * @param h0
 * @param r0
 * @param x1
 * @param y1
 * @param w1
 * @param h1
 * @param r1
 */
export function getLineBetweenRoundedRectangles(
  x0: number,
  y0: number,
  w0: number,
  h0: number,
  r0: number,
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  r1: number
) {
  const cx0 = x0 + w0 / 2,
    cy0 = y0 + h0 / 2,
    cx1 = x1 + w1 / 2,
    cy1 = y1 + h1 / 2,
    [[di0x, di0y]] = getRayRoundedRectangleIntersection(
      cx0,
      cy0,
      cx1 - cx0,
      cy1 - cy0,
      x0,
      y0,
      w0,
      h0,
      r0
    ) || [[cx0, cy0]],
    [[di1x, di1y]] = getRayRoundedRectangleIntersection(
      cx1,
      cy1,
      cx0 - cx1,
      cy0 - cy1,
      x1,
      y1,
      w1,
      h1,
      r1
    ) || [[cx1, cy1]]

  return [di0x, di0y, di1x, di1y]
}

/**
 * Get the intersection points between a ray and a rectangle with rounded corners.
 * @param ox The x-axis coordinate of the ray's origin.
 * @param oy The y-axis coordinate of the ray's origin.
 * @param dx The delta-x of the ray.
 * @param dy The delta-y of the ray.
 * @param x The x-axis coordinate of the rectangle.
 * @param y The y-axis coordinate of the rectangle.
 * @param w The width of the rectangle.
 * @param h The height of the rectangle.
 * @param r The corner radius of the rectangle.
 */
export function getRayRoundedRectangleIntersection(
  ox: number,
  oy: number,
  dx: number,
  dy: number,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const mx = x + w,
    my = y + h,
    rx = x + r - 1,
    ry = y + r - 1,
    mrx = x + w - r + 1,
    mry = y + h - r + 1

  const segments = [
    [x, mry, x, ry],
    [rx, y, mrx, y],
    [mx, ry, mx, mry],
    [mrx, my, rx, my],
  ]

  const corners = [
    [rx, ry, Math.PI, Math.PI * 1.5],
    [mrx, ry, Math.PI * 1.5, Math.PI * 2],
    [mrx, mry, 0, Math.PI * 0.5],
    [rx, mry, Math.PI * 0.5, Math.PI],
  ]

  let points: number[][] = []

  segments.forEach((segment, i) => {
    const [px0, py0, px1, py1] = segment
    const [cx, cy, as, ae] = corners[i]

    const intersections = getRayCircleIntersection(cx, cy, r, ox, oy, dx, dy)

    intersections &&
      intersections
        .filter(pt => {
          const pointAngle = normalizeAngle(getAngle(cx, cy, pt[0], pt[1]))
          return pointAngle > as && pointAngle < ae
        })
        .forEach(pt => points.push(pt))

    const segmentInt = getRaySegmentIntersection(
      ox,
      oy,
      dx,
      dy,
      px0,
      py0,
      px1,
      py1
    )

    if (!!segmentInt) {
      points.push(segmentInt)
    }
  })

  return points
}

export function getRectangleSegmentIntersectedByRay(
  x: number,
  y: number,
  w: number,
  h: number,
  ox: number,
  oy: number,
  dx: number,
  dy: number
) {
  return getRectangleSegments(x, y, w, h).find(([sx0, sy0, sx1, sy1]) =>
    getRaySegmentIntersection(ox, oy, dx, dy, sx0, sy0, sx1, sy1)
  )
}

export function getRectangleSegments(
  x: number,
  y: number,
  w: number,
  h: number
) {
  return [
    [x, y, x + w, y],
    [x + w, y, x + w, y + h],
    [x + w, y + h, x, y + h],
    [x, y + h, x, y],
  ]
}

export function getRoundedRectangleSegments(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rx = x + r,
    ry = y + r,
    mx = x + w,
    my = y + h,
    mrx = x + w - r,
    mry = y + h - r

  return [
    [x, mry, x, ry, x, y],
    [rx, y, mrx, y, mx, y],
    [mx, ry, mx, mry, mx, my],
    [mrx, my, rx, my, x, my],
  ]
}

export function getRayCircleIntersection(
  cx: number,
  cy: number,
  r: number,
  ox: number,
  oy: number,
  dx: number,
  dy: number
) {
  // This is a shitty hack
  return getSegmentCircleIntersections(
    cx,
    cy,
    r,
    ox,
    oy,
    dx * 999999,
    dy * 999999
  )
}
