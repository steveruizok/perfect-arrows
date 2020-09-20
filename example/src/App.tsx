import React from "react"
import PointToPoint from "./PointToPoint"
import BoxToBox from "./BoxToBox"
import BoxToSelf from "./BoxToSelf"

export default function App() {
  return (
    <div className="App">
      <PointToPoint />
      <BoxToBox />
      <BoxToSelf />
    </div>
  )
}
