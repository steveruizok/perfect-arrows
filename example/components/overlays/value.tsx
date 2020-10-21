import * as React from "react"

export default function Value({
  label,
  children,
  style = {},
}: {
  label: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        textAlign: "right",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "rgba(0,0,0,.1)",
        padding: "2px 4px",
        borderRadius: 4,
        fontSize: 14,
        ...style,
      }}
    >
      {children}
      <small> {label}</small>
    </div>
  )
}
