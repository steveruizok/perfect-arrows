import * as React from "react"
import ReactDOM from "react-dom"
import { styled } from "./theme"

import useKeyboardEvents from "./hooks/useKeyboardEvents"
import useWindowEvents from "./hooks/useWindowEvents"
import useViewBox from "./hooks/useViewBox"

import Canvas from "./components/canvas/canvas"
import Toolbar from "./components/toolbar/toolbar"
import ZoomIndicator from "./components/overlays/zoom-indicator"
import Overlays from "./components/overlays/overlays"

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
  useKeyboardEvents()

  return (
    <Container ref={ref}>
      <Canvas width={width} height={height} style={{ userSelect: "none" }} />
      <Overlays />
      <ZoomIndicator />
      <Toolbar />
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
