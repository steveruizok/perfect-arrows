// Point

export default class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  // Methods

  clone() {
    return new Point(this.x, this.y)
  }

  set(x: number, y: number) {
    this.x = x
    this.y = y
  }

  rotate(cx: number, cy: number, angle: number) {
    const { x, y } = this
    const s = Math.sin(angle)
    const c = Math.cos(angle)

    const px = x - cx
    const py = y - cy

    const nx = px * c - py * s
    const ny = px * s + py * c

    return [nx + cx, ny + cy]
  }

  distanceTo(b: Point) {
    return Math.hypot(this.y - b.y, this.x - b.x)
  }

  angleTo(b: Point) {
    return Math.atan2(b.y - this.y, b.x - this.x)
  }

  add(b: Point) {
    return new Point(this.x + b.x, this.y + b.y)
  }

  subtract(b: Point) {
    return new Point(this.x - b.x, this.y - b.y)
  }

  multiply(b: Point) {
    return new Point(this.x * b.x, this.y * b.y)
  }

  multiplyScalar(scalar: number) {
    return new Point(this.x * scalar, this.y * scalar)
  }

  divide(b: Point) {
    return new Point(this.x / b.x, this.y / b.y)
  }

  divideScalar(scalar: number) {
    return new Point(this.x / scalar, this.y / scalar)
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  normalize() {
    return this.divideScalar(this.length())
  }
}
