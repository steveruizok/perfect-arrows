import React, { useState, MouseEvent } from 'react';
import { getBoxToSelfArrow } from "perfect-arrows"


export default () => {
  const ref = React.useRef<HTMLElement>(null)

  const box = {
    x: 300,
    y: 200,
    width: 300,
    height: 200,
  }

  const [angle, setAngle] = useState(0)
  const [radius, setCircleRadius] = useState(50)
  const [padStart, setPadStart] = useState(0)
  const [padEnd, setPadEnd] = useState(15)


  const arc = getBoxToSelfArrow(
    box.x,
    box.y,
    box.width,
    box.height,
    radius,
    angle / (180 / Math.PI),
    padStart,
    padEnd
  )

  const largeArc = arc && (arc.endAngle - arc.startAngle <= Math.PI)

  const path = arc && [
    "M", arc.start.x, arc.start.y,
    "A", arc.radius, arc.radius, 0, largeArc ? '0' : '1', 1, arc.end.x, arc.end.y
  ].join(" ")

  const decorRadius = 6

  const decorationPoints =
    `0,${-decorRadius} ${decorRadius * 2},0, 0,${decorRadius}`

  const decorationTransform = arc &&
    `translate(${arc.end.x},${arc.end.y}) rotate(${arc.endAngle * (180 / Math.PI)})`


  return <>
    <section ref={ref}>
      <svg
        viewBox="0 0 1280 720"
        style={{ width: 1280, height: 720, border: "1px solid #000" }}
        stroke="#000"
        fill="#000"
        strokeWidth={3}
      >
        <rect
          name="ohmybox"
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
          fill="none"
        />
        {arc && <rect
          name="tipStart"
          x={arc.start.x - 2}
          y={arc.start.y - 2}
          width={4}
          height={4}
          fill="none"
        />}

        {decorationTransform && <g transform={decorationTransform}>
          <polygon name="end-arrow" points={decorationPoints} />
        </g>}

        {path && <>
          <path d={path} fill="none" />
        </>
        }
      </svg>
    </section>
    <br />
    <label>
      <input
        type="range"
        min={0}
        max={359}
        step={1}
        value={angle}
        onChange={e => setAngle(parseFloat(e.target.value))}
      />
          Angle
      </label>
    <br />
    <label>
      <input
        type="range"
        min={10}
        max={100}
        step={1}
        value={radius}
        onChange={e => setCircleRadius(parseFloat(e.target.value))}
      />
          Radius
      </label>
    <br />
    <label>
      <input
        type="range"
        min={0}
        max={30}
        step={1}
        value={padStart}
        onChange={e => setPadStart(parseFloat(e.target.value))}
      />
          Pad Start
      </label>
    <br />
    <label>
      <input
        type="range"
        min={0}
        max={30}
        step={1}
        value={padEnd}
        onChange={e => setPadEnd(parseFloat(e.target.value))}
      />
          Pad End
      </label>
  </>
}
