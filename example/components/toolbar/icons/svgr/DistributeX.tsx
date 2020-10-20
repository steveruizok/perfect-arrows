import * as React from "react"

function SvgDistributeX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path stroke="#000" strokeLinecap="round" d="M12 14.5v-5" />
      <path
        d="M6 6.5h4a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H6a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5zM14 6.5h4a.5.5 0 01.5.5v10a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5z"
        fill="currentColor"
        stroke="#000"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgDistributeX
