import * as React from "react"

function SvgUndo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 10l2.5 5L9 10H4z" fill="#000" />
      <path d="M6.5 10.75a6.75 6.75 0 116.75 6.75" stroke="#000" />
      <circle
        r={1.5}
        transform="matrix(-1 0 0 1 13 18)"
        fill="currentColor"
        stroke="#000"
      />
    </svg>
  )
}

export default SvgUndo
