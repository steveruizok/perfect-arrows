import React from "react"
import { getBoxToBoxArrow } from "perfect-arrows"

export default function Difficult() {
  const ref = React.useRef<HTMLElement>(null)

  const b1 = {
    x: -4710.06155657891,
    y: -1571.6917781196591,
    w: 545.7397072097903,
    h: 457.4198639994165,
  }

  const b2 = {
    x: -5335.457377534619,
    y: -768.3931456842388,
    w: 559.06478024143,
    h: 358.2843535608206,
  }

  const [sx, sy, cx, cy, ex, ey, ae, as, ac] = getBoxToBoxArrow(
    b1.x,
    b1.y,
    b1.w,
    b1.h,
    b2.x,
    b2.y,
    b2.w,
    b2.h
  )

  const endAngleAsDegrees = ae * (180 / Math.PI)

  const decorRadius = 6
  const decorOffsetX = ex - Math.cos(ae)
  const decorOffsetY = ey - Math.sin(ae)

  const decorationPoints = `0,${-decorRadius} ${decorRadius *
    2},0, 0,${decorRadius}`
  const decorationTranform = `translate(${decorOffsetX},${decorOffsetY}) rotate(${endAngleAsDegrees})`

  return (
    <section ref={ref}>
      <svg
        viewBox="-5300 -1600 3000 3000"
        style={{ width: 3000, height: 3000, border: "1px solid #000" }}
        stroke="#000"
        fill="#000"
        strokeWidth={3}
      >
        <circle name="start-cirlce" cx={sx} cy={sy} r={4} />

        <g transform={decorationTranform}>
          <polygon name="end-arrow" points={decorationPoints} />
        </g>
        <path
          name="line-between"
          d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`}
          strokeWidth={3}
          fill="none"
        />
        <rect
          name="b1"
          x={b1.x}
          y={b1.y}
          width={b1.w}
          height={b1.h}
          fill="none"
        />
        <rect
          name="b1"
          x={b2.x}
          y={b2.y}
          width={b2.w}
          height={b2.h}
          fill="none"
        />
        <circle
          name="start-point"
          cx={b1.x + b1.w / 2}
          cy={b1.y + b1.h / 2}
          r={3}
          fill={"#F00"}
          strokeWidth={0}
        />
        <circle
          name="end-point"
          cx={b2.x + b2.w / 2}
          cy={b2.y + b2.h / 2}
          r={3}
          fill={"#F00"}
          strokeWidth={0}
        />
      </svg>
    </section>
  )
}
