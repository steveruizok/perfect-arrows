import sortBy from "lodash/sortBy"
import { doBoxesCollide, pointInRectangle, getCorners } from "../utils"
import { S } from "@state-designer/react"
import { getArrow, getBoxToBoxArrow } from "../../../"
import {
  IBox,
  IPoint,
  IBrush,
  IFrame,
  IBounds,
  IArrow,
  IArrowType,
} from "../../types"
import state, { pointerState } from "../state"

const PI2 = Math.PI * 2

export enum HitType {
  Canvas = "canvas",
  Bounds = "bounds",
  BoundsCorner = "bounds-corner",
  BoundsEdge = "bounds-edge",
  Box = "box",
}

export type Hit =
  | { type: HitType.Canvas }
  | { type: HitType.Bounds }
  | { type: HitType.BoundsCorner; corner: number }
  | { type: HitType.BoundsEdge; edge: number }
  | { type: HitType.Box; id: string }

class Surface {
  _lineWidth = 2
  _stroke: string
  _fill: string
  _unsub: () => void
  _diffIndex = 0
  _looping = true

  allBoxes: IBox[] = []
  inView: IBox[] = []
  hit: Hit = { type: HitType.Canvas }

  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  state = state

  constructor(canvas: HTMLCanvasElement) {
    this.cvs = canvas
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    this.stroke = "#000"
    this.fill = "rgba(255, 255, 255, .5)"
    this.save()

    this.allBoxes = Object.values(state.data.boxes)
    this.inView = this.allBoxes
      .filter(box => doBoxesCollide(box, state.data.viewBox.document))
      .sort((a, b) => b.z - a.z)

    this.loop()
  }

  private loop = () => {
    if (!this._looping) return

    this.hit = this.hitTest()
    this.cvs.style.setProperty("cursor", this.getCursor(this.hit))

    if (state.index === this._diffIndex) {
      requestAnimationFrame(this.loop)
      return
    }

    this.allBoxes = Object.values(state.data.boxes)
    this.inView = this.allBoxes
      .filter(box => doBoxesCollide(box, state.data.viewBox.document))
      .sort((a, b) => a.z - b.z)

    this.clear()
    this.draw()

    this._diffIndex = state.index
    requestAnimationFrame(this.loop)
  }

  destroy() {
    this._looping = false
  }

  draw() {
    this.setupCamera()
    this.renderCanvasThings()
    if (!this.state.isIn("dragging")) {
      this.renderSelection()
      this.renderBrush()
    }
  }

  setupCamera() {
    const { camera } = this.state.data

    const dpr = window.devicePixelRatio || 1

    this.ctx.translate(-camera.x * dpr, -camera.y * dpr)
    this.ctx.scale(camera.zoom * dpr, camera.zoom * dpr)
    this.lineWidth = 1 / camera.zoom
  }

  renderCanvasThings() {
    const { arrows } = this.state.data

    this.stroke = "#000"
    this.fill = "rgba(255, 255, 255, .9)"

    for (let box of this.inView) {
      this.drawBox(box)
    }

    for (let arrow of Object.values(arrows)) {
      this.drawArrow(arrow)
    }

    const allSpawningBoxes = Object.values(state.data.spawning.boxes)
    const inViewSpawningBoxes = allSpawningBoxes.filter(box =>
      doBoxesCollide(box, state.data.viewBox.document)
    )

    for (let box of inViewSpawningBoxes) {
      this.save()
      this.stroke = "blue"
      this.drawBox(box)
      this.restore()
    }
  }

  renderSelection() {
    const { camera, bounds, boxes, selectedBoxIds } = this.state.data

    if (selectedBoxIds.length > 0) {
      this.save()
      this.stroke = "blue"

      // draw box outlines
      for (let id of selectedBoxIds) {
        let box = boxes[id]
        this.ctx.strokeRect(box.x, box.y, box.width, box.height)
      }

      if (bounds) {
        // draw bounds outline
        this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height)
        this.save()
        this.fill = "blue"
        for (let [x, y] of getCorners(
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height
        )) {
          this.drawDot(x, y, 3 / camera.zoom)
        }
        this.restore()
      }

      this.restore()
    }
  }

  renderBrush() {
    const { brush } = this.state.data
    if (brush) {
      this.save()
      this.stroke = "rgba(0,0,0,.2)"
      this.fill = "rgba(0,0,0,.1)"
      this.drawBrush(brush)
      this.restore()
    }
  }

  hitTest(): Hit {
    const point = pointerState.data.document
    const { camera, viewBox, boxes, bounds, selectedBoxIds } = this.state.data

    if (bounds) {
      // Test if point collides the (padded) bounds
      if (pointInRectangle(point, bounds, 16)) {
        const { x, y, width, height, maxX, maxY } = bounds
        const p = 5 / camera.zoom
        const pp = p * 2

        const cornerBoxes = [
          { x: x - p, y: y - p, width: pp, height: pp },
          { x: maxX - p, y: y - p, width: pp, height: pp },
          { x: maxX - p, y: maxY - p, width: pp, height: pp },
          { x: x - p, y: maxY - p, width: pp, height: pp },
        ]

        for (let i = 0; i < cornerBoxes.length; i++) {
          if (pointInRectangle(point, cornerBoxes[i])) {
            return { type: HitType.BoundsCorner, corner: i }
          }
        }

        const edgeBoxes = [
          { x: x + p, y: y - p, width: width - pp, height: pp },
          { x: maxX - p, y: y + p, width: pp, height: height - pp },
          { x: x + p, y: maxY - p, width: width - pp, height: pp },
          { x: x - p, y: y + p, width: pp, height: height - pp },
        ]

        for (let i = 0; i < edgeBoxes.length; i++) {
          if (pointInRectangle(point, edgeBoxes[i])) {
            return { type: HitType.BoundsEdge, edge: i }
          }
        }
        // Point is in the middle of the bounds
        return { type: HitType.Bounds }
      }
    }

    // Either we don't have bounds or we're out of bounds
    for (let box of this.inView) {
      // Test if point collides the (padded) box
      if (pointInRectangle(point, box)) {
        // Point is in the middle of the box
        return { type: HitType.Box, id: box.id }
      }
    }

    return { type: HitType.Canvas }
  }

  clear() {
    const { cvs, ctx } = this
    ctx.resetTransform()
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    this.restore()
  }

  drawBox(box: IBox | IFrame) {
    const { ctx } = this
    const { x, y, width, height } = box
    const path = new Path2D()
    path.rect(x, y, width, height)
    ctx.fill(path)
    ctx.stroke(path)
  }

  drawDot(x: number, y: number, radius = 4) {
    const { ctx } = this
    ctx.beginPath()
    ctx.ellipse(x, y, radius, radius, 0, 0, PI2, false)
    ctx.fill()
  }

  drawEdge(start: IPoint, end: IPoint) {
    const { ctx } = this
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  }

  drawBrush(brush: IBrush) {
    const { ctx } = this
    const { x0, y0, x1, y1 } = brush
    const path = new Path2D()
    path.rect(
      Math.min(x1, x0),
      Math.min(y1, y0),
      Math.abs(x1 - x0),
      Math.abs(y1 - y0)
    )
    ctx.fill(path)
    ctx.stroke(path)
  }

  drawArrow(arrow: IArrow) {
    const { ctx } = this

    switch (arrow.type) {
      case IArrowType.BoxToBox: {
        const from = this.state.data.boxes[arrow.from]
        const to = this.state.data.boxes[arrow.to]
        // if (from.id === to.id) {
        //   // Box to Self Arrow
        //   const angle = from.width / from.height
        //   const arc = getBoxToSelfArrow(
        //     from.x,
        //     from.y,
        //     from.width,
        //     from.height,
        //     20,
        //     angle,
        //     0,
        //     20
        //   )
        //   if (arc === undefined) return
        //   const largeArc = arc && arc.endAngle - arc.startAngle <= Math.PI
        //   const p = new Path2D(
        //     [
        //       "M",
        //       arc.start.x,
        //       arc.start.y,
        //       "A",
        //       arc.radius,
        //       arc.radius,
        //       0,
        //       largeArc ? "0" : "1",
        //       1,
        //       arc.end.x,
        //       arc.end.y,
        //     ].join(" ")
        //   )
        //   ctx.save()
        //   this.stroke = "#000"
        //   this.fill = "#000"
        //   this.lineWidth = 2
        //   ctx.stroke(p)
        //   this.drawDot(arc.start.x, arc.start.y)
        //   this.drawArrowhead(arc.end.x, arc.end.y, arc.endAngle)
        //   ctx.restore()
        //   return
        // } else {
        // Box to Box Arrow
        const [sx, sy, cx, cy, ex, ey, ea] = getBoxToBoxArrow(
          from.x,
          from.y,
          from.width,
          from.height,
          to.x,
          to.y,
          to.width,
          to.height
        )
        ctx.save()
        this.stroke = "#000"
        this.fill = "#000"
        this.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.quadraticCurveTo(cx, cy, ex, ey)
        ctx.stroke()
        this.drawDot(sx, sy)
        this.drawArrowhead(ex, ey, ea)
        ctx.restore()
        // }
        break
      }
      case IArrowType.BoxToPoint: {
        const from = this.state.data.boxes[arrow.from]
        const to = arrow.to
        // Box to Box Arrow
        const [sx, sy, cx, cy, ex, ey, ea] = getBoxToBoxArrow(
          from.x,
          from.y,
          from.width,
          from.height,
          to.x,
          to.y,
          1,
          1
        )

        ctx.save()
        this.stroke = "#000"
        this.fill = "#000"
        this.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.quadraticCurveTo(cx, cy, ex, ey)
        ctx.stroke()
        this.drawDot(sx, sy)
        this.drawArrowhead(ex, ey, ea)
        ctx.restore()

        break
      }
      case IArrowType.PointToBox: {
        const from = arrow.from
        const to = this.state.data.boxes[arrow.to]
        // Box to Box Arrow
        const [sx, sy, cx, cy, ex, ey, ea] = getBoxToBoxArrow(
          from.x,
          from.y,
          1,
          1,
          to.x,
          to.y,
          to.width,
          to.height
        )

        ctx.save()
        this.stroke = "#000"
        this.fill = "#000"
        this.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.quadraticCurveTo(cx, cy, ex, ey)
        ctx.stroke()
        this.drawDot(sx, sy)
        this.drawArrowhead(ex, ey, ea)
        ctx.restore()

        break
      }
      case IArrowType.PointToPoint: {
        const { from, to } = arrow
        // Box to Box Arrow
        const [sx, sy, cx, cy, ex, ey, ea] = getArrow(
          from.x,
          from.y,
          to.x,
          to.y
        )

        ctx.save()
        this.stroke = "#000"
        this.fill = "#000"
        this.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.quadraticCurveTo(cx, cy, ex, ey)
        ctx.stroke()
        this.drawDot(sx, sy)
        this.drawArrowhead(ex, ey, ea)
        ctx.restore()
        break
      }
    }
  }

  drawArrowhead(x: number, y: number, angle: number) {
    const { ctx } = this
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.moveTo(0, -6)
    ctx.lineTo(12, 0)
    ctx.lineTo(0, 6)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  getCursor(hit: Hit) {
    const { isIn } = this.state

    if (isIn("dragging")) return "none"

    switch (hit.type) {
      case "box":
      case "bounds": {
        return "default"
      }
      case "bounds-corner": {
        return hit.corner % 2 === 0 ? "nwse-resize" : "nesw-resize"
      }
      case "bounds-edge": {
        return hit.edge % 2 === 0 ? "ns-resize" : "ew-resize"
      }
      case "canvas": {
        return "default"
      }
    }

    return "default"
  }

  save() {
    this.ctx.save()
  }

  restore() {
    this.ctx.restore()
  }

  // Getters / Setters ----------------

  get stroke() {
    return this._stroke
  }

  set stroke(color: string) {
    this._stroke = color
    this.ctx.strokeStyle = color
  }

  get fill() {
    return this._fill
  }

  set fill(color: string) {
    this._fill = color
    this.ctx.fillStyle = color
  }

  get lineWidth() {
    return this._lineWidth
  }

  set lineWidth(width: number) {
    this._lineWidth = width
    this.ctx.lineWidth = width
  }
}

export default Surface
