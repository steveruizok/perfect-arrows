import * as React from "react"

function SvgRedo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M20 10l-2.5 5-2.5-5h5z" fill="#000" />
      <path d="M17.5 10.75a6.75 6.75 0 10-6.75 6.75" stroke="#000" />
      <circle cx={11} cy={18} r={1.5} fill="currentColor" stroke="#000" />
    </svg>
  )
}

export default SvgRedo
