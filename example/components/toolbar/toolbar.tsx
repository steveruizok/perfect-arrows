import * as React from "react"
import state from "../state"
import { useStateDesigner } from "@state-designer/react"
import { ToolbarWrapper, ButtonGroup, Divider } from "./styled"
import IconButton from "./icon-button"

export default function Toolbar() {
  const local = useStateDesigner(state)

  const { selectedBoxIds = [], selectedArrowIds = [] } = local.data

  const hasSelection = selectedBoxIds.length + selectedArrowIds.length > 0
  const hasSelectedBox = selectedBoxIds.length > 0
  const hasSelectedBoxes = selectedBoxIds.length > 1
  const hasManySelectedBoxes = selectedBoxIds.length > 2

  return (
    <ToolbarWrapper onClick={e => e.stopPropagation()}>
      <ButtonGroup>
        <IconButton
          src="Select"
          isActive={local.isIn("selectTool")}
          event="SELECTED_SELECT_TOOL"
          shortcut="V"
        />
        <IconButton
          src="Box"
          isActive={local.isIn("boxTool")}
          onClick={() => state.send("SELECTED_BOX_TOOL")}
          event="SELECTED_BOX_TOOL"
          shortcut="F"
        />
        <IconButton
          src="Arrow"
          event="STARTED_PICKING_ARROW"
          shortcut="A"
          disabled={!hasSelectedBox}
        />
        <Divider />
        <IconButton
          src="FlipArrow"
          event="FLIPPED_ARROWS"
          shortcut="T"
          disabled={!hasSelection}
        />
        <IconButton
          src="InvertArrow"
          event="INVERTED_ARROWS"
          shortcut="R"
          disabled={!hasSelection}
        />
        <Divider />
        <IconButton
          src="Left"
          event="ALIGNED_LEFT"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ A"
        />
        <IconButton
          src="CenterX"
          event="ALIGNED_CENTER_X"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ H"
        />
        <IconButton
          src="Right"
          event="ALIGNED_RIGHT"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ D"
        />
        <IconButton
          src="Top"
          event="ALIGNED_TOP"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ W"
        />
        <IconButton
          src="CenterY"
          event="ALIGNED_CENTER_Y"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ V"
        />
        <IconButton
          src="Bottom"
          event="ALIGNED_BOTTOM"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ S"
        />
        <IconButton
          src="StretchX"
          event="STRETCHED_X"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ ⇧ H"
        />
        <IconButton
          src="StretchY"
          event="STRETCHED_Y"
          disabled={!hasSelectedBoxes}
          shortcut="⌥ ⇧ V"
        />

        <IconButton
          src="DistributeX"
          event="DISTRIBUTED_X"
          disabled={!hasManySelectedBoxes}
          shortcut="⌥ ⌃ H"
        />
        <IconButton
          src="DistributeY"
          event="DISTRIBUTED_Y"
          disabled={!hasManySelectedBoxes}
          shortcut="⌥ ⌃ V"
        />
        <Divider />
        <IconButton
          src="Delete"
          event="DELETED_SELECTED"
          shortcut="⌫"
          disabled={!hasSelection}
        />
      </ButtonGroup>
      <ButtonGroup>
        <IconButton
          src="Undo"
          event="UNDO"
          shortcut="⌘ Z"
          disabled={local.values.undosLength === 0}
        />
        <IconButton
          src="Redo"
          event="REDO"
          shortcut="⌘ ⇧ Z"
          disabled={local.values.redosLength === 0}
        />
      </ButtonGroup>
    </ToolbarWrapper>
  )
}
