import * as React from "react"

function SvgCenterY(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path stroke="#000" strokeLinecap="round" d="M4.5 12h15" />
      <path
        d="M7 6.5h4a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5zM14 8.5h3a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V9a.5.5 0 01.5-.5z"
        fill="currentColor"
        stroke="#000"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgCenterY
