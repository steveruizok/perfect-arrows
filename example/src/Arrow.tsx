import * as React from "react"
import { getArrow } from "perfect-arrows"

type Props = {
  a: { x: number; y: number }
  b: { x: number; y: number }
}

const PerfectArrow: React.FC<Props> = ({ a, b }) => {
  const arrow = getArrow(a.x, a.y, b.x, b.y, {
    padEnd: 20,
  })

  const [sx, sy, cx, cy, ex, ey, as, ac, ae] = arrow

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

export default PerfectArrow
