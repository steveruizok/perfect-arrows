import * as React from "react"

function SvgBottom(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path stroke="#000" strokeLinecap="round" d="M4.5 17.5h15" />
      <path
        d="M7 5.5h4a.5.5 0 01.5.5v11a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5zM14 10.5h3a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-6a.5.5 0 01.5-.5z"
        fill="currentColor"
        stroke="#000"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgBottom
