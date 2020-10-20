import { styled } from "../../theme"

// Toolbar

export const ToolbarWrapper = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  position: "absolute",
  top: 0,
  left: 0,
  height: 40,
  width: "100vw",
  maxWidth: "100vw",
  flexWrap: "wrap",
  borderBottom: "1px solid $muted",
  backgroundColor: "$toolbar",
  backdropFilter: "blur(4px)",
})

export const ButtonGroup = styled.div({
  display: "flex",
  userSelect: "none",
  minWidth: 0,
  padding: "0 $1",
  gap: "$0",
  flexWrap: "wrap",
})

export const Divider = styled.span({
  padding: 4,
  color: "rgba(0,0,0,.5)",
})

// Buttons

export const ButtonWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > *:nth-child(2)": {
    visibility: "hidden",
  },
  "&:hover > *:nth-child(2)": {
    visibility: "visible",
  },
})

export const Button = styled.button({
  height: 40,
  width: 32,
  p: 0,
  outline: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  // borderWidth: 2,
  // borderStyle: "outset",
  // borderColor: "$muted",
  border: "none",
  borderRadius: "$1",
  backgroundColor: "transparent",
  transition: "opacity, filter .16s",
  gridRow: 1,
  color: "$icon",
  "&:disabled": {
    opacity: 0.5,
  },
  "&:hover": {
    filter: "brightness(.95)",
    bg: "$background",
  },
  "&:active": {
    filter: "brightness(.9)",
    transform: "translate(0 1px)",
  },
  variants: {
    status: {
      "": {},
      active: {
        color: "$accent",
        borderColor: "$accent",
      },
    },
  },
})

export const ShortcutHint = styled.div({
  py: "$0",
  px: "$1",
  mt: "$0",
  borderRadius: "$1",
  fontSize: "$0",
  fontWeight: "bold",
  backgroundColor: "$muted",
})

export const Spacer = styled.div({
  flexGrow: 2,
})
