# Perfect Arrows

A set of functions for drawing perfect arrows between points and shapes.

🔗 [Demo](https://example.steveruizok.vercel.app/)

- [x] `getArrow` - For point-to-point arrows.
- [ ] `getArrowBetweenRectangles` - For rectangle-to-rectangle arrows.

## Installation

```
npm i perfect-arrows
```

_or_

```
yarn add perfect-arrows
```

## Usage

The functions in this library provide only the information needed to draw an arrow. You'll need to draw the arrow yourself using your technology of choice. See below for an example React component.

### `getArrow(x0, y0, x1, y1, options)`

The `getArrow` function accepts the position of two points and returns three points—a start, end, and control point—and an angle. You can use this information to draw an arc and arrow-head. You can use the options object to tweak the return values.

```js
const arrow = getArrow(0, 0, 100, 200, {
  bow: 1
  stretchMin: 20
  stretchMax: Infinity
  stretch: 1
  padStart: 0
  padEnd: 0
  flip: false
  straights: true
})

const [sx, sy, cx, cy, ex, ey, angle] = arrow
```

#### Arguments

| Argument | Type   | Description                                                                 |
| -------- | ------ | --------------------------------------------------------------------------- |
| x0       | number | The x position of the starting point.                                       |
| y0       | number | The y position of the starting point.                                       |
| x1       | number | The x position of the ending point.                                         |
| y1       | number | The y position of the ending point.                                         |
| options  | object | An (optional) object containing one or more of the options described below. |

#### Options

| Option       | Type    | Default  | Description                                                                                                                                                    |
| ------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bow`        | number  | 1        | A value representing the natural bow of the arrow. At `0`, all lines will be straight.                                                                         |
| `stretch`    | number  | 1        | The effect that the arrow's length will have, relative to its `minStretch` and `maxStretch`, on the bow of the arrow. At `0`, the stretch will have no effect. |
| `minStretch` | number  | 20       | The length of the arrow where the line should be most stretched. Shorter distances than this will have no additional effect on the bow of the arrow.           |
| `maxStretch` | number  | Infinity | The length of the arrow at which the stretch should have no effect.                                                                                            |
| `padStart`   | number  | 0        | How far the arrow's starting point should be from the provided start point.                                                                                    |
| `padEnd`     | number  | 0        | How far the arrow's ending point should be from the provided end point.                                                                                        |
| `flip`       | boolean | false    | Whether to reflect the arrow's bow angle.                                                                                                                      |
| `straights`  | boolean | true     | Whether to use straight lines at 45 degree angles.                                                                                                             |

## Example: A React Arrow Component

```jsx
import * as React from "react"
import { getArrow } from "perfect-arrows"

export function PerfectArrow() {
  const p1 = { x: 64, y: 64 }
  const p2 = { x: 128, y: 96 }

  const arrow = getArrow(p1.x, p1.y, p2.x, p2.y, {
    padEnd: 20,
  })

  const [sx, sy, cx, cy, ex, ey, angle] = arrow

  const angleAsDegrees = angle * (180 / Math.PI)

  return (
    <svg
      viewBox="0 0 640 480"
      style={{ height: 640, width: 480 }}
      stroke="#000"
      fill="#000"
      strokeWidth={3}
    >
      <circle cx={sx} cy={sy} r={4} />
      <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" />
      <polygon
        points="0,-6 12,0, 0,6"
        transform={`translate(${ex},${ey}) rotate(${angleAsDegrees})`}
      />
    </svg>
  )
}
```

## Author

[@steveruizok](https://twitter.com/steveruizok)
