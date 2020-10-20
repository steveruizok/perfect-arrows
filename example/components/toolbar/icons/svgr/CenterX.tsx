import * as React from "react"

function SvgCenterX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path stroke="#000" strokeLinecap="round" d="M12 19.5v-15" />
      <path
        d="M6.5 17v-4a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5zM8.5 10V7a.5.5 0 01.5-.5h6a.5.5 0 01.5.5v3a.5.5 0 01-.5.5H9a.5.5 0 01-.5-.5z"
        fill="currentColor"
        stroke="#000"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgCenterX
