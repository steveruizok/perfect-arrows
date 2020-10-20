import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state from "../state"

export default function ZoomIndicator() {
  const local = useStateDesigner(state)
  const { zoom } = local.data.camera

  return (
    <span
      style={{
        position: "absolute",
        bottom: 8,
        right: 8,
        padding: "4px 12px",
        textAlign: "right",
      }}
    >
      {Math.trunc(zoom * 100)}%
    </span>
  )
}
