import * as React from "react"
import Positions from "./positions"
import state from "../state"

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
      <input
        type="range"
        min={0}
        max={5000}
        style={{ width: "600px", pointerEvents: "all", marginBottom: 80 }}
        step={100}
        onChange={e => {
          state.send("RESET_BOXES", e.currentTarget.value)
        }}
      />
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
