import { IPoint, IBox } from "../../types"
import RBush from "rbush"

class Bush extends RBush<{
  id: string
  minX: number
  minY: number
  maxX: number
  maxY: number
}> {}

const tree = new Bush()

export function getBoxSelecter(initialBoxes: IBox[], origin: IPoint) {
  let x0: number, y0: number, x1: number, y1: number, t: number
  const { x: ox, y: oy } = origin

  tree.clear()

  tree.load(
    initialBoxes.map(box => ({
      id: box.id,
      minX: box.x,
      minY: box.y,
      maxX: box.x + box.width,
      maxY: box.y + box.height,
    }))
  )

  return function select(point: IPoint) {
    x0 = ox
    y0 = oy
    x1 = point.x
    y1 = point.y

    if (x1 < x0) {
      t = x0
      x0 = x1
      x1 = t
    }

    if (y1 < y0) {
      t = y0
      y0 = y1
      y1 = t
    }

    const results = tree
      .search({ minX: x0, minY: y0, maxX: x1, maxY: y1 })
      .map(b => b.id)

    return results
  }
}

export type BoxSelecter = ReturnType<typeof getBoxSelecter>
