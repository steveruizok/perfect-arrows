import Point from "./point"

// Line

export default class Line {
  start: Point
  end: Point
  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.start = new Point(x1, y1)
    this.end = new Point(x2, y2)
  }

  clone() {
    return new Line(this.start.x, this.start.y, this.end.x, this.end.y)
  }

  scale(n: number, origin = 0.5) {
    const { x, y } = this.getPointOnLine(origin)

    this.start.set(x + (this.start.x - x) * n, y + (this.start.y - y) * n)
    this.end.set(x + (this.end.x - x) * n, y + (this.end.y - y) * n)

    return this
  }

  expand(n: number, origin = 0.5) {
    const length = this.length
    const scale = (length + n) / length

    this.scale(scale, origin)

    return this
  }

  rotate(radians: number, origin = 0.5) {
    const { x, y } = this.getPointOnLine(origin)
    const [sx, sy] = this.start.rotate(x, y, radians)
    const [ex, ey] = this.end.rotate(x, y, radians)

    this.start.set(sx, sy)
    this.end.set(ex, ey)

    return this
  }

  get offset() {
    return new Point(
      (this.end.x - this.start.x) / 2,
      (this.end.y - this.start.y) / 2
    )
  }

  get midPoint() {
    return this.getPointOnLine(0.5)
  }

  get length() {
    return Math.hypot(this.start.y - this.end.y, this.start.x - this.end.x)
  }

  get angle() {
    return this.start.angleTo(this.end)
  }

  get angliness() {
    return Math.abs(this.offset.x) / Math.abs(this.offset.y)
  }

  get slope() {
    return (this.start.y - this.end.y) / (this.start.x - this.end.x)
  }

  get yIntercept() {
    return this.start.y - this.slope * this.start.x
  }

  get quadrant() {
    return (((this.angle / (Math.PI * 2)) % 4) + 0.5) * 4
  }

  get octant() {
    return (((this.angle / (Math.PI * 2)) % 8) + 0.5) * 8
  }

  // Methods

  set(x1: number, y1: number, x2: number, y2: number) {
    this.start.set(x1, y1)
    this.end.set(x2, y2)

    return this
  }

  getPointOnLine(origin = 0.5) {
    return new Point(
      this.start.x + (this.end.x - this.start.x) * origin,
      this.start.y + (this.end.y - this.start.y) * origin
    )
  }

  getIntersection(b: Line) {
    const { x: x1, y: y1 } = this.start
    const { x: x2, y: y2 } = this.end
    const { x: x3, y: y3 } = b.start
    const { x: x4, y: y4 } = b.end

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
    const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
    const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

    if (denom === 0) {
      if (numeA === 0 && numeB === 0) {
        return undefined // Colinear
      }
      return undefined // Parallel
    }

    const uA = numeA / denom
    const uB = numeB / denom

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      return new Point(x1 + uA * (x2 - x1), y1 + uA * (y2 - y1))
    }

    return undefined // No intersection
  }
}
