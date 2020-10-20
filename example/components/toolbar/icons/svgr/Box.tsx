import * as React from "react"

function SvgBox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 4.5h14a.5.5 0 01.5.5v14a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V5a.5.5 0 01.5-.5z"
        fill="currentColor"
        stroke="#000"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgBox
