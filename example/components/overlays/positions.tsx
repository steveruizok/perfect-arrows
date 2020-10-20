import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state, { pointerState } from "../state"
import Value from "./value"

export default function Positions() {
  const pointer = useStateDesigner(pointerState)
  const local = useStateDesigner(state)
  const { camera, viewBox } = local.data
  const { screen, document } = pointer.data

  return (
    <div
      style={{
        display: "grid",
        alignItems: "baseline",
        gridTemplateColumns: "64px 64px 80px auto",
        pointerEvents: "none",
        gap: "8px",
        fontSize: 16,
        padding: "2px 0",
        textAlign: "left",
      }}
    >
      <Value label="x">{Math.trunc(camera.x)}</Value>
      <Value label="y">{Math.trunc(camera.y)}</Value>
      <Value label="zoom">{camera.zoom.toFixed(2)}</Value>
      <div>Camera</div>

      <Value label="w">{Math.trunc(viewBox.width)}</Value>
      <Value label="h">{Math.trunc(viewBox.height)}</Value>
      <div style={{ gridColumn: "span 2" }}>View Box</div>

      <Value label="w">{Math.trunc(viewBox.width / camera.zoom)}</Value>
      <Value label="h">{Math.trunc(viewBox.height / camera.zoom)}</Value>
      <div style={{ gridColumn: "span 2" }}>Camera Frame</div>

      <Value label="x">{Math.trunc(document.x)}</Value>
      <Value label="y">{Math.trunc(document.y)}</Value>
      <div style={{ gridColumn: "span 2" }}>Pointer (Document)</div>

      <Value label="x">{Math.trunc(screen.x)}</Value>
      <Value label="y">{Math.trunc(screen.y)}</Value>
      <div style={{ gridColumn: "span 2" }}>Pointer (Screen)</div>
    </div>
  )
}
