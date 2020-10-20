import * as React from "react"

function SvgArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 16.5c0-5.417 4.5-10 9-10"
        stroke="#000"
        strokeLinecap="round"
      />
      <circle cx={6} cy={18} r={1.5} fill="currentColor" stroke="#000" />
      <path
        d="M15.5 8.191V4.809L18.882 6.5 15.5 8.191z"
        fill="#000"
        stroke="#000"
      />
    </svg>
  )
}

export default SvgArrow
