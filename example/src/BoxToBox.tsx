import React from "react"
import { getBoxToBoxArrow } from "perfect-arrows"

export default function BoxToBox() {
  const ref = React.useRef<HTMLElement>(null)
  const [b1, setB1] = React.useState({ x: 350, y: 200, w: 128, h: 200 })
  const [b2, setB2] = React.useState({ x: 500, y: 301, w: 128, h: 128 })

  const [bow, setBow] = React.useState(0.25)
  const [stretch, setStretch] = React.useState(0.5)
  const [padStart, setPadStart] = React.useState(0)
  const [padEnd, setPadEnd] = React.useState(16)
  const [minDistance, setMinDistance] = React.useState(0)
  const [stretchMin, setStretchMin] = React.useState(0)
  const [stretchMax, setStretchMax] = React.useState(360)
  const [flip, setFlip] = React.useState(false)
  const [straights, setStraights] = React.useState(true)
  const [showDecorations, setShowDecorations] = React.useState(true)

  const [sx, sy, cx, cy, ex, ey, ae, as, ac] = getBoxToBoxArrow(
    b1.x,
    b1.y,
    b1.w,
    b1.h,
    b2.x,
    b2.y,
    b2.w,
    b2.h,
    {
      padStart,
      padEnd,
      bow,
      straights,
      stretch,
      stretchMax,
      stretchMin,
      flip,
      minDistance,
    }
  )

  const endAngleAsDegrees = ae * (180 / Math.PI)

  const decorRadius = 6
  const boxBorderWidth = 2
  const decorationSize = decorRadius * 2 + boxBorderWidth
  const decorOffsetX = ex - Math.cos(ae)
  const decorOffsetY = ey - Math.sin(ae)

  const decorationPoints = `0,${-decorRadius} ${decorRadius *
    2},0, 0,${decorRadius}`
  const decorationTranform = `translate(${decorOffsetX},${decorOffsetY}) rotate(${endAngleAsDegrees})`

  return (
    <section ref={ref}>
      <svg
        viewBox="0 0 1280 720"
        style={{ width: 1280, height: 720, border: "1px solid #000" }}
        onClick={e => {
          const { pageX, pageY } = e
          setB2(b => ({
            ...b,
            x: pageX - b.w / 2 - (ref.current?.offsetLeft || 0),
            y: pageY - b.h / 2 - (ref.current?.offsetTop || 0),
          }))
        }}
        onMouseMove={e => {
          if (e.buttons !== 1) return
          const { pageX, pageY } = e
          setB2(b => ({
            ...b,
            x: pageX - b.w / 2 - (ref.current?.offsetLeft || 0),
            y: pageY - b.h / 2 - (ref.current?.offsetTop || 0),
          }))
        }}
        stroke="#000"
        fill="#000"
        strokeWidth={3}
      >
        {showDecorations && (
          <>
            <circle name="start-cirlce" cx={sx} cy={sy} r={4} />

            <g transform={decorationTranform}>
              <polygon name="end-arrow" points={decorationPoints} />
            </g>
          </>
        )}
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
        <label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={minDistance}
            onChange={e => setMinDistance(parseFloat(e.target.value))}
          />
          Min Distance
        </label>
      </div>
    </section>
  )
}
