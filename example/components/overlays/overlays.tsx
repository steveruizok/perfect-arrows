import * as React from "react"
import Positions from "./positions"

export default function Overlays() {
  const [showPositions, setShowPositions] = React.useState(true)

  return (
    <div
      style={{
        position: "absolute",
        userSelect: "none",
        pointerEvents: "none",
        bottom: 8,
        left: 8,
      }}
    >
      {showPositions && <Positions />}
      <button
        style={{ marginTop: 8, pointerEvents: "all" }}
        onClick={() => setShowPositions(!showPositions)}
      >
        {showPositions ? "Hide" : "Show"}
      </button>
    </div>
  )
}
