import { IBoxSnapshot, IPoint, IPointer, IBounds, IBox } from "../../types"

export function stretchBoxesX(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let min = first.x
  let max = first.x + first.width
  for (let box of rest) {
    min = Math.min(min, box.x)
    max = Math.max(max, box.x + box.width)
  }
  for (let box of boxes) {
    box.x = min
    box.width = max - min
  }
}
export function stretchBoxesY(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let min = first.y
  let max = first.y + first.height
  for (let box of rest) {
    min = Math.min(min, box.y)
    max = Math.max(max, box.y + box.height)
  }
  for (let box of boxes) {
    box.y = min
    box.height = max - min
  }
}
export function distributeBoxesX(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let min = first.x
  let max = first.x + first.width
  let sum = first.width

  for (let box of rest) {
    min = Math.min(min, box.x)
    max = Math.max(max, box.x + box.width)
    sum += box.width
  }

  let t = min
  const gap = (max - min - sum) / (boxes.length - 1)
  for (let box of [...boxes].sort((a, b) => a.x - b.x)) {
    box.x = t
    t += box.width + gap
  }
}
export function distributeBoxesY(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let min = first.y
  let max = first.y + first.height
  let sum = first.height

  for (let box of rest) {
    min = Math.min(min, box.y)
    max = Math.max(max, box.y + box.height)
    sum += box.height
  }

  let t = min
  const gap = (max - min - sum) / (boxes.length - 1)
  for (let box of [...boxes].sort((a, b) => a.y - b.y)) {
    box.y = t
    t += box.height + gap
  }
}
export function alignBoxesCenterX(boxes: IBox[]) {
  let midX = 0
  for (let box of boxes) {
    midX += box.x + box.width / 2
  }
  midX /= boxes.length
  for (let box of boxes) box.x = midX - box.width / 2
}
export function alignBoxesCenterY(boxes: IBox[]) {
  let midY = 0
  for (let box of boxes) midY += box.y + box.height / 2
  midY /= boxes.length
  for (let box of boxes) box.y = midY - box.height / 2
}

export function alignBoxesTop(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let y = first.y
  for (let box of rest) if (box.y < y) y = box.y
  for (let box of boxes) box.y = y
}

export function alignBoxesBottom(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let maxY = first.y + first.height
  for (let box of rest) if (box.y + box.height > maxY) maxY = box.y + box.height
  for (let box of boxes) box.y = maxY - box.height
}

export function alignBoxesLeft(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let x = first.x
  for (let box of rest) if (box.x < x) x = box.x
  for (let box of boxes) box.x = x
}

export function alignBoxesRight(boxes: IBox[]) {
  const [first, ...rest] = boxes
  let maxX = first.x + first.width
  for (let box of rest) if (box.x + box.width > maxX) maxX = box.x + box.width
  for (let box of boxes) box.x = maxX - box.width
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
    maxX,
    maxY,
    width: maxX - x,
    height: maxY - y,
  }
}

function getSnapshots(
  boxes: IBox[],
  bounds: IBounds
): Record<string, IBoxSnapshot> {
  const acc = {} as Record<string, IBoxSnapshot>

  for (let box of boxes) {
    acc[box.id] = {
      ...box,
      nx: (box.x - bounds.x) / bounds.width,
      ny: (box.y - bounds.y) / bounds.height,
      nmx: 1 - (box.x + box.width - bounds.x) / bounds.width,
      nmy: 1 - (box.y + box.height - bounds.y) / bounds.height,
      nw: box.width / bounds.width,
      nh: box.height / bounds.height,
    }
  }

  return acc
}

export function getEdgeResizer(
  initialBoxes: IBox[],
  initialBounds: IBounds,
  edge: number
) {
  const snapshots = getSnapshots(initialBoxes, initialBounds)

  let { x: x0, y: y0, maxX: x1, maxY: y1 } = initialBounds
  let { x: mx, y: my, width: mw, height: mh } = initialBounds

  return function edgeResize(point: IPoint, boxes: IBox[], bounds: IBounds) {
    const { x, y } = point
    if (edge === 0 || edge === 2) {
      edge === 0 ? (y0 = y) : (y1 = y)
      my = y0 < y1 ? y0 : y1
      mh = Math.abs(y1 - y0)
      for (let box of boxes) {
        const { ny, nmy, nh } = snapshots[box.id]
        box.y = my + (y1 < y0 ? nmy : ny) * mh
        box.height = nh * mh
      }
    } else {
      edge === 1 ? (x1 = x) : (x0 = x)
      mx = x0 < x1 ? x0 : x1
      mw = Math.abs(x1 - x0)
      for (let box of boxes) {
        const { nx, nmx, nw } = snapshots[box.id]
        box.x = mx + (x1 < x0 ? nmx : nx) * mw
        box.width = nw * mw
      }
    }

    bounds.x = mx
    bounds.y = my
    bounds.width = mw
    bounds.height = mh
    bounds.maxX = mx + mw
    bounds.maxY = my + mh
  }
}

/**
 * Returns a function that can be used to calculate corner resize transforms.
 * @param boxes An array of the boxes being resized.
 * @param corner A number representing the corner being dragged. Top Left: 0, Top Right: 1, Bottom Right: 2, Bottom Left: 3.
 * @example
 * const resizer = getCornerResizer(selectedBoxes, 3)
 * resizer(selectedBoxes, )
 */
export function getCornerResizer(
  initialBoxes: IBox[],
  initialBounds: IBounds,
  corner: number
) {
  const snapshots = getSnapshots(initialBoxes, initialBounds)

  let { x: x0, y: y0, maxX: x1, maxY: y1 } = initialBounds
  let { x: mx, y: my, width: mw, height: mh } = initialBounds

  return function cornerResizer(point: IPoint, boxes: IBox[], bounds: IBounds) {
    const { x, y } = point
    corner < 2 ? (y0 = y) : (y1 = y)
    my = y0 < y1 ? y0 : y1
    mh = Math.abs(y1 - y0)

    corner === 1 || corner === 2 ? (x1 = x) : (x0 = x)
    mx = x0 < x1 ? x0 : x1
    mw = Math.abs(x1 - x0)

    for (let box of boxes) {
      const { nx, nmx, nw, ny, nmy, nh } = snapshots[box.id]
      box.x = mx + (x1 < x0 ? nmx : nx) * mw
      box.y = my + (y1 < y0 ? nmy : ny) * mh
      box.width = nw * mw
      box.height = nh * mh
    }

    bounds.x = mx
    bounds.y = my
    bounds.width = mw
    bounds.height = mh
    bounds.maxX = mx + mw
    bounds.maxY = my + mh
  }
}

export type EdgeResizer = ReturnType<typeof getEdgeResizer>
export type CornerResizer = ReturnType<typeof getCornerResizer>
