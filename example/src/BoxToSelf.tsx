import React from "react"
import { getBoxToSelfArrow } from "perfect-arrows"

export default function BoxToBox() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [b1, setB1] = React.useState({ x: 350, y: 250, w: 128, h: 200 })
  const [angle, setAngle] = React.useState(0)
  const [radius, setRadius] = React.useState(24)

  const [bow, setBow] = React.useState(0)
  const [stretch, setStretch] = React.useState(0.5)
  const [padStart, setPadStart] = React.useState(0)
  const [padEnd, setPadEnd] = React.useState(20)
  const [stretchMin, setStretchMin] = React.useState(0)
  const [stretchMax, setStretchMax] = React.useState(360)
  const [flip, setFlip] = React.useState(false)
  const [straights, setStraights] = React.useState(true)
  const [showDecorations, setShowDecorations] = React.useState(true)

  const [sx, sy, cx, cy, ex, ey, ae, as] = getBoxToSelfArrow(
    b1.x,
    b1.y,
    b1.w,
    b1.h,
    {
      padStart,
      padEnd,
      flip,
      angle,
    }
  )

  const endAngleAsDegrees = ae * (180 / Math.PI) + 90

  const arcPath = getArcPath(cx, cy, radius, as, ae)

  console.log(angle)

  return (
    <section ref={ref}>
      <svg
        viewBox="0 0 1280 720"
        style={{ width: 1280, height: 720, border: "1px solid #000" }}
        // onClick={e => {
        //   const { pageX, pageY } = e
        //   setB2(b => ({
        //     ...b,
        //     x: pageX - b.w / 2 - (ref.current?.offsetLeft || 0),
        //     y: pageY - b.h / 2 - (ref.current?.offsetTop || 0),
        //   }))
        // }}
        onMouseMove={e => {
          const current = ref.current
          if (!current) return
          if (e.buttons !== 1) return
          const { pageX, pageY } = e
          const x = pageX - current.offsetLeft
          const y = pageY - current.offsetTop
          setAngle(Math.atan2(y - (b1.y + b1.h / 2), x - (b1.x + b1.w / 2)))
        }}
        stroke="#000"
        fill="#000"
        strokeWidth={3}
      >
        {showDecorations && (
          <>
            <circle name="start-cirlce" cx={cx} cy={cy} r={2} />
            <circle name="start-cirlce" cx={sx} cy={sy} r={4} />
            <polygon
              name="end-arrow"
              points="0,-6 12,0, 0,6"
              transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`}
            />
          </>
        )}
        {/* <circle cx={cx} cy={cy} r={radius} fill="none" strokeWidth={3} /> */}
        <path
          name="line-between"
          d={arcPath}
          strokeWidth={3}
          fill="none"
          stroke="#000"
        />
        <rect
          name="b1"
          x={b1.x}
          y={b1.y}
          width={b1.w}
          height={b1.h}
          fill="none"
        />
      </svg>
      <div style={{ display: "grid" }}>
        <label>
          <input
            type="checkbox"
            checked={showDecorations}
            onChange={() => setShowDecorations(!showDecorations)}
          />
          Show Decorations
        </label>
        <label>
          <input
            type="checkbox"
            checked={flip}
            onChange={() => setFlip(!flip)}
          />
          Flip
        </label>
        <label>
          <input
            type="checkbox"
            checked={straights}
            onChange={() => setStraights(!straights)}
          />
          Straights
        </label>
        <label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={bow}
            onChange={e => setBow(parseFloat(e.target.value))}
          />
          Bow
        </label>
        <label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={stretch}
            onChange={e => setStretch(parseFloat(e.target.value))}
          />
          Stretch
        </label>
        <label>
          <input
            type="range"
            min={0}
            max={600}
            step={1}
            value={stretchMin}
            onChange={e => setStretchMin(parseFloat(e.target.value))}
          />
          Stretch Min
        </label>
        <label>
          <input
            type="range"
            min={0}
            max={999}
            step={1}
            value={stretchMax}
            onChange={e => setStretchMax(parseFloat(e.target.value))}
          />
          Stretch Max
        </label>
        <label>
          <input
            type="range"
            min={0}
            max={32}
            step={1}
            value={padStart}
            onChange={e => setPadStart(parseFloat(e.target.value))}
          />
          Pad Start
        </label>
        <label>
          <input
            type="range"
            min={0}
            max={32}
            step={1}
            value={padEnd}
            onChange={e => setPadEnd(parseFloat(e.target.value))}
          />
          Pad End
        </label>
      </div>
    </section>
  )
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadians: number
) {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function getArcPath(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  var start = polarToCartesian(x, y, radius, endAngle)
  var end = polarToCartesian(x, y, radius, startAngle)
  var largeArcFlag = endAngle - startAngle <= Math.PI / 2 ? "0" : "1"

  console.log(startAngle, start.x, start.y, endAngle, end.x, end.y)

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ")

  return d
}
