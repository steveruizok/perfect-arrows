import { getBoxToBoxArrow, ArrowOptions } from "perfect-arrows"
import uniqueId from "lodash/uniqueId"
import clamp from "lodash/clamp"
import { IPoint, IBounds, IFrame, IBox, IArrow } from "../types"
import state from "./state/index"

const RESET_LOCAL_DATA = true

export let scale = 1
export const pressedKeys = {} as Record<string, boolean>
export const pointer = { x: 0, y: 0 }
export const origin = { x: 0, y: 0 }
export const cameraOrigin = { x: 0, y: 0 }
export const camera = { x: 0, y: 0, cx: 0, cy: 0, width: 0, height: 0 }

let dpr = 1

if (typeof window !== undefined) {
  dpr = window?.devicePixelRatio || 1
}

export function viewBoxToCamera(
  point: IPoint,
  viewBox: IFrame,
  camera: { x: number; y: number; zoom: number }
) {
  return {
    x: (camera.x + point.x - viewBox.x) / camera.zoom,
    y: (camera.y + point.y - viewBox.y) / camera.zoom,
  }
}

export function getBoundingBox(boxes: IBox[]): IBounds {
  if (boxes.length === 0) {
    return {
      x: 0,
      y: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
    }
  }

  const first = boxes[0]

  let x = first.x
  let maxX = first.x + first.width
  let y = first.y
  let maxY = first.y + first.height

  for (let box of boxes) {
    x = Math.min(x, box.x)
    maxX = Math.max(maxX, box.x + box.width)
    y = Math.min(y, box.y)
    maxY = Math.max(maxY, box.y + box.height)
  }

  return {
    x,
    y,
    width: maxX - x,
    height: maxY - y,
    maxX,
    maxY,
  }
}

export function mapValues<P, T>(
  obj: { [key: string]: T },
  fn: (value: T, index: number) => P
): { [key: string]: P } {
  return Object.fromEntries(
    Object.entries(obj).map(([id, value], index) => [id, fn(value, index)])
  )
}

export function getInitialIndex() {
  if (typeof window === undefined || !window.localStorage) return "0"

  let curIndex = "1"
  let prevIndex: any = localStorage.getItem("__index")
  if (prevIndex === null) {
    curIndex = "1"
  } else {
    const num = parseInt(JSON.parse(prevIndex), 10)
    curIndex = (num + 1).toString()
  }

  localStorage.setItem("__index", JSON.stringify(curIndex))
}

/**
 * Get an arrow between boxes.
 * @param a
 * @param b
 * @param options
 */
export function getArrow(
  a: IBox,
  b: IBox,
  options: Partial<ArrowOptions> = {}
) {
  const opts = {
    box: 0.05,
    stretchMax: 1200,
    padEnd: 12,
    ...options,
  }
  return getBoxToBoxArrow(
    a.x,
    a.y,
    a.width,
    a.height,
    b.x,
    b.y,
    b.width,
    b.height,
    opts
  )
}

const keyDownActions = {
  Escape: "CANCELLED",
  Alt: "ENTERED_ALT_MODE",
  " ": "ENTERED_SPACE_MODE",
  Shift: "ENTERED_SHIFT_MODE",
  Control: "ENTERED_CONTROL_MODE",
  Meta: "ENTERED_META_MODE",
}

const keyUpActions = {
  Alt: "EXITED_ALT_MODE",
  " ": "EXITED_SPACE_MODE",
  Shift: "EXITED_SHIFT_MODE",
  Control: "EXITED_CONTROL_MODE",
  Meta: "EXITED_META_MODE",
  f: "SELECTED_DRAWING",
  v: "SELECTED_SELECTING",
  r: "INVERTED_ARROWS",
  t: "FLIPPED_ARROWS",
  a: "STARTED_PICKING_ARROW",
}

export function testKeyCombo(event: string, ...keys: string[]) {
  if (keys.every(key => pressedKeys[key])) state.send(event)
}

export function handleKeyDown(e: KeyboardEvent) {
  pressedKeys[e.key] = true
  const action = keyDownActions[e.key]
  if (action) {
    state.send(action)
  }
  // Handle shift here?
}

export function handleKeyUp(e: KeyboardEvent) {
  if (
    pressedKeys.Option ||
    pressedKeys.Shift ||
    pressedKeys.Meta ||
    pressedKeys.Control
  ) {
    testKeyCombo("ALIGNED_LEFT", "Option", "a")
    testKeyCombo("ALIGNED_CENTER_X", "Option", "h")
    testKeyCombo("ALIGNED_RIGHT", "Option", "d")
    testKeyCombo("ALIGNED_TOP", "Option", "w")
    testKeyCombo("ALIGNED_CENTER_Y", "Option", "v")
    testKeyCombo("ALIGNED_BOTTOM", "Option", "s")
    testKeyCombo("DISTRIBUTED_X", "Option", "Control", "h")
    testKeyCombo("DISTRIBUTED_Y", "Option", "Control", "v")
    testKeyCombo("STRETCHED_X", "Option", "Shift", "h")
    testKeyCombo("STRETCHED_Y", "Option", "Shift", "v")
    testKeyCombo("BROUGHT_FORWARD", "Meta", "]")
    testKeyCombo("SENT_BACKWARD", "Meta", "[")
    testKeyCombo("BROUGHT_TO_FRONT", "Meta", "Shift", "]")
    testKeyCombo("SENT_TO_BACK", "Meta", "Shift", "[")
    testKeyCombo("PASTED", "Meta", "v")
    testKeyCombo("COPIED", "Meta", "c")
    testKeyCombo("UNDO", "Meta", "z")
    testKeyCombo("REDO", "Meta", "Shift", "z")
    return
  } else {
    const action = keyUpActions[e.key]
    if (action) state.send(action)
  }

  pressedKeys[e.key] = false
}

export function handleKeyPress(e: KeyboardEvent) {
  if (e.key === " " && !state.isInAny("editingLabel", "editingArrowLabel")) {
    e.preventDefault()
  }
}

export function pointInRectangle(a: IPoint, b: IFrame, padding = 0) {
  const r = padding / 2
  return !(
    a.x > b.x + b.width + r ||
    a.y > b.y + b.height + r ||
    a.x < b.x - r ||
    a.y < b.y - r
  )
}

export function pointInCorner(a: IPoint, b: IFrame, padding = 4) {
  let cx: number, cy: number
  const r = padding / 2
  const corners = getCorners(b.x, b.y, b.width, b.height)

  for (let i = 0; i < corners.length; i++) {
    ;[cx, cy] = corners[i]
    if (
      pointInRectangle(
        a,
        {
          x: cx - 4,
          y: cy - 4,
          width: 8,
          height: 8,
        },
        0
      )
    )
      return i
  }
}

export function lineToRectangle(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  padding = 8
) {
  const r = padding / 2
  if (x1 < x0) [x0, x1] = [x1, x0]
  if (y1 < y0) [y0, y1] = [y1, y0]
  return {
    x: x0 - r,
    y: y0 - r,
    width: x1 + r - (x0 - r),
    height: y1 + r - (y0 - r),
  }
}

export function pointInEdge(a: IPoint, b: IFrame, padding = 4) {
  const edges = getEdges(b.x, b.y, b.width, b.height)

  for (let i = 0; i < edges.length; i++) {
    const [[x0, y0], [x1, y1]] = edges[i]
    if (pointInRectangle(a, lineToRectangle(x0, y0, x1, y1), padding)) return i
  }
}

export function doBoxesCollide(a: IFrame, b: IFrame) {
  return !(
    a.x > b.x + b.width ||
    a.y > b.y + b.height ||
    a.x + a.width < b.x ||
    a.y + a.height < b.y
  )
}

export function getBox(
  x: number,
  y: number,
  width: number,
  height: number
): IBox {
  return {
    id: "box" + uniqueId(),
    x,
    y,
    width,
    height,
    label: "",
    color: "#ffffff",
  }
}

export function getEdges(x: number, y: number, w: number, h: number) {
  return [
    [
      [x, y],
      [x + w, y],
    ],
    [
      [x + w, y],
      [x + w, y + h],
    ],
    [
      [x + w, y + h],
      [x, y + h],
    ],
    [
      [x, y + h],
      [x, y],
    ],
  ]
}

export function getCorners(x: number, y: number, w: number, h: number) {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ]
}
