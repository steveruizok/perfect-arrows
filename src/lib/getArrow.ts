import { Line, Point } from "./"

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
 * @description Draw an arrow between two points.
 * @param x0 The x position of the "from" point.
 * @param y0 The y position of the "from" point.
 * @param x1 The x position of the "to" point.
 * @param y1 The y position of the "to" point.
 * @param options Additional options for computing the line.
 * @example
 * getArrow(0, 0, 100, 200, {
    bow: 1
    stretchMin: 20
    stretchMax: Infinity
    stretch: 1
    padStart: 0
    padEnd: 0
    flip: false
    straights: true
 * })
 */
export default function getArrow(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  options: ArrowOptions = {} as ArrowOptions
): number[] {
  let sx: number,
    sy: number,
    cx: number,
    cy: number,
    ex: number,
    ey: number,
    angle: number

  const {
    bow = 1,
    stretch = 1,
    stretchMin = 20,
    stretchMax = Infinity,
    padStart = 0,
    padEnd = 0,
    flip = false,
    straights = true,
  } = options

  const p1 = new Point(x0, y0)
  const p2 = new Point(x1, y1)

  const direct = new Line(p1.x, p1.y, p2.x, p2.y)
  const { angliness } = direct

  const tooShort = direct.length < (padStart + padEnd) * 2

  if (tooShort) {
    direct.expand(-padStart, 1)
    direct.expand(Math.max(-direct.length + 1, -padEnd), 0)
  }

  if (
    (straights &&
      (angliness === 0 || angliness === Infinity || direct.angliness === 1)) ||
    tooShort
  ) {
    if (!tooShort) {
      direct.expand(-padStart, 1)
      direct.expand(-padEnd, 0)
    }
    sx = direct.start.x
    sy = direct.start.y
    cx = direct.midPoint.x
    cy = direct.midPoint.y
    ex = direct.end.x
    ey = direct.end.y
    angle = direct.angle
  } else {
    const str = modulate(direct.length, [stretchMin, stretchMax], [1, 0], true)

    const cross = direct
      .clone()
      .rotate(Math.PI / 2)
      .scale(bow + str * stretch)

    const corner =
      Math.floor(direct.octant) % 2 === 0
        ? flip
          ? cross.start
          : cross.end
        : flip
        ? cross.end
        : cross.start

    const line1 = new Line(corner.x, corner.y, p1.x, p1.y).expand(-padStart, 0)

    const line2 = new Line(corner.x, corner.y, p2.x, p2.y).expand(-padEnd, 0)

    const direct2 = new Line(line1.end.x, line1.end.y, line2.end.x, line2.end.y)

    const cross2 = direct2
      .clone()
      .rotate(Math.PI / 2)
      .scale(bow + str * stretch)

    const corner2 =
      Math.floor(direct.octant) % 2 === 0
        ? flip
          ? cross2.start
          : cross2.end
        : flip
        ? cross2.end
        : cross2.start

    sx = direct2.start.x
    sy = direct2.start.y
    cx = corner2.x
    cy = corner2.y
    ex = direct2.end.x
    ey = direct2.end.y
    angle = padEnd > 0 ? direct2.end.angleTo(p2) : corner2.angleTo(p2)
  }

  return [sx, sy, cx, cy, ex, ey, angle]
}

function modulate(value: number, a: number[], b: number[], clamp = false) {
  const [low, high] = b[0] < b[1] ? [b[0], b[1]] : [b[1], b[0]]
  const result = b[0] + ((value - a[0]) / (a[1] - b[0])) * (b[1] - b[0])

  if (clamp) {
    if (result < low) return low
    if (result > high) return high
  }

  return result
}
