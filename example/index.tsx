import "react-app-polyfill/ie11"
import * as React from "react"
import ReactDOM from "react-dom"
import { styled } from "./theme"

import useWindowEvents from "./hooks/useWindowEvents"
import useViewBox from "./hooks/useViewBox"

import Canvas from "./components/canvas/canvas"
import Toolbar from "./components/toolbar/toolbar"
import ZoomIndicator from "./components/overlays/zoom-indicator"
import Positions from "./components/overlays/positions"

const Container = styled.div({
  width: "100vw",
  height: "100vh",
  position: "absolute",
  top: 0,
  left: 0,
})

export default function App() {
  const { ref, width, height } = useViewBox()

  useWindowEvents()

  const [showPositions, setShowPositions] = React.useState(true)

  return (
    <Container ref={ref}>
      <Canvas width={width} height={height} style={{ userSelect: "none" }} />
      {/* <div style={{ position: "absolute", bottom: 8, left: 8 }}>
        {showPositions && <Positions />}
        <button
          style={{ marginTop: 8 }}
          onClick={() => setShowPositions(!showPositions)}
        >
          {showPositions ? "Hide" : "Show"}
        </button>
      </div> */}
      <ZoomIndicator />
      <Toolbar />
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
