# Perfect Arrows

A set of functions for drawing perfect arrows between points and shapes.

- [`getArrow`](#getarrowx0-y0-x1-y1-options) - For point-to-point arrows.
- [`getBoxToBoxArrow`](#getboxtoboxarrowx0-y0-w0-h0-x1-y1-w1-h1-options) - For rectangle-to-rectangle arrows.

![Example](/example.gif)

👉 [Demo](https://perfect-arrows.now.sh/)

[![Edit example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/steveruizok/perfect-arrows/tree/master/example?fontsize=14&hidenavigation=1&theme=dark)

<div align="center">
<p>Other languages</p>
<p><a href=".github/README_pt_BR.md">Português (pt-BR)</a></p></div>

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
      viewBox="0 0 720 480"
      style={{ width: 720, height: 480 }}
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

---

### `getBoxToBoxArrow(x0, y0, w0, h0, x1, y1, w1, h1, options)`

The `getBoxToBoxArrow` function accepts the position and dimensions of two boxes (or rectangles) and returns an array containing information for:

- three points: a start, end, and control point
- three angles: an end, start, and center

You can use this information to draw an arc and arrow-heads. You can use the options object to tweak the return values.

**Note:** The options and values returned by `getBoxToBoxArrow` are in the same format as the options and values for `getArrow`.

```js
const arrow = getBoxToBoxArrow(0, 0, 96, 128, 400, 200, 128, 96, {
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
| `x0`     | number | The x position of the first rectangle.                                      |
| `y0`     | number | The y position of the first rectangle.                                      |
| `w0`     | number | The width of the first rectangle.                                           |
| `h0`     | number | The height of the first rectangle.                                          |
| `x1`     | number | The x position of the second rectangle.                                     |
| `y1`     | number | The y position of the second rectangle.                                     |
| `w1`     | number | The width of the second rectangle.                                          |
| `h1`     | number | The height of the second rectangle.                                         |
| options  | object | An (optional) object containing one or more of the options described below. |

#### Options

See options in `getArrow` above. (Both functions use the same options object.)

#### Returns

See returns in `getArrow` above. (Both functions return the same set of values.)

## Example: A React Box-to-box Arrow Component

```jsx
import * as React from "react"
import { getBoxToBoxArrow } from "perfect-arrows"

export function PerfectArrow() {
  const p1 = { x: 64, y: 64, w: 64, h: 64 }
  const p2 = { x: 128, y: 96, w: 64, h: 64 }

  const arrow = getBoxToBoxArrow(
    p1.x,
    p1.y,
    p1.w,
    p1.h,
    p2.x,
    p2.y,
    p2.w,
    p2.h,
    {
      bow: 0.2,
      stretch: 0.5,
      stretchMin: 40,
      stretchMax: 420,
      padStart: 0,
      padEnd: 20,
      flip: false,
      straights: true,
    }
  )

  const [sx, sy, cx, cy, ex, ey, ae, as, ec] = arrow

  const endAngleAsDegrees = ae * (180 / Math.PI)

  return (
    <svg
      viewBox="0 0 1280 720"
      style={{ width: 1280, height: 720 }}
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
