import * as React from "react"

function SvgFlipArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5.727 17.5c-2.197-5.74.88-11 5.273-11" stroke="#BABABA" />
      <circle cx={6} cy={18} r={1.5} fill="currentColor" stroke="#000" />
      <path d="M11 4l5 2.5L11 9V4z" fill="#BABABA" />
      <circle cx={6} cy={18} r={1.5} fill="currentColor" stroke="#000" />
      <circle
        r={1.5}
        transform="matrix(0 -1 -1 0 6 18)"
        fill="currentColor"
        stroke="#000"
      />
      <circle
        r={1.5}
        transform="matrix(0 -1 -1 0 6 18)"
        fill="currentColor"
        stroke="#000"
      />
      <path
        d="M6.5 18.273c5.74 2.197 11-.88 11-5.273"
        stroke="#000"
        strokeLinecap="round"
      />
      <path
        d="M15.809 12.5h3.382L17.5 9.118 15.809 12.5z"
        fill="#000"
        stroke="#000"
      />
      <circle cx={6} cy={18} r={1.5} fill="currentColor" stroke="#000" />
    </svg>
  )
}

export default SvgFlipArrow
