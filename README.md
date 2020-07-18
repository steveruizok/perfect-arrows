# Perfect Arrows

A set of functions for drawing perfect arrows between points and shapes.

![Example](/example.gif)

👉 [Demo](https://example.steveruizok.vercel.app/)

[![Edit example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/steveruizok/perfect-arrows/tree/master/example?fontsize=14&hidenavigation=1&theme=dark)

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

The functions in this library provide only the information needed to draw an arrow. You'll need to draw the arrow yourself using your technology of choice. See below for an example React component with SVG.

### `getArrow(x0, y0, x1, y1, options)`

The `getArrow` function accepts the position of two points and returns an array containing information for:

- three points: a start, end, and control point
- three angles: an end, start, and center

You can use this information to draw an arc and arrow-heads. You can use the options object to tweak the return values.

```js
const arrow = getArrow(0, 0, 100, 200, {
  bow: 0,
  stretch: 0.5,
  stretchMin: 0,
  stretchMax: 420,
  padStart: 0,
  padEnd: 0,
  flip: false,
  straights: true,
})

const [sx, sy, cx, cy, ex, ey, ae, as, sc] = arrow
```

#### Arguments

| Argument | Type   | Description                                                                 |
| -------- | ------ | --------------------------------------------------------------------------- |
| `x0`     | number | The x position of the starting point.                                       |
| `y0`     | number | The y position of the starting point.                                       |
| `x1`     | number | The x position of the ending point.                                         |
| `y1`     | number | The y position of the ending point.                                         |
| options  | object | An (optional) object containing one or more of the options described below. |

#### Options

| Option       | Type    | Default | Description                                                                                                                                                    |
| ------------ | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bow`        | number  | 0       | A value representing the natural bow of the arrow. At `0`, all lines will be straight.                                                                         |
| `stretch`    | number  | .5      | The effect that the arrow's length will have, relative to its `minStretch` and `maxStretch`, on the bow of the arrow. At `0`, the stretch will have no effect. |
| `minStretch` | number  | 0       | The length of the arrow where the line should be most stretched. Shorter distances than this will have no additional effect on the bow of the arrow.           |
| `maxStretch` | number  | 420     | The length of the arrow at which the stretch should have no effect.                                                                                            |
| `padStart`   | number  | 0       | How far the arrow's starting point should be from the provided start point.                                                                                    |
| `padEnd`     | number  | 0       | How far the arrow's ending point should be from the provided end point.                                                                                        |
| `flip`       | boolean | false   | Whether to reflect the arrow's bow angle.                                                                                                                      |
| `straights`  | boolean | true    | Whether to use straight lines at 45 degree angles.                                                                                                             |

#### Returns

| Argument | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| `x0`     | number | The x position of the (padded) starting point.   |
| `y0`     | number | The y position of the (padded) starting point.   |
| `x1`     | number | The x position of the (padded) ending point.     |
| `y1`     | number | The y position of the (padded) ending point.     |
| `ae`     | number | The angle (in radians) for an ending arrowhead.  |
| `as`     | number | The angle (in radians) for a starting arrowhead. |
| `ac`     | number | The angle (in radians) for a center arrowhead.   |

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

  const [sx, sy, cx, cy, ex, ey, ae, as, ec] = arrow

  const endAngleAsDegrees = ae * (180 / Math.PI)

  return (
    <svg
      viewBox="0 0 640 480"
      style={{ width: 640, height: 480 }}
      stroke="#000"
      fill="#000"
      strokeWidth={3}
    >
      <circle cx={sx} cy={sy} r={4} />
      <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" />
      <polygon
        points="0,-6 12,0, 0,6"
        transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`}
      />
    </svg>
  )
}
```

## Author

[@steveruizok](https://twitter.com/steveruizok)
