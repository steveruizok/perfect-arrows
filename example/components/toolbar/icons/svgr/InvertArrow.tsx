import * as React from "react"

function SvgInvertArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5.727 17.5c-2.197-5.74.88-11 5.273-11" stroke="#BABABA" />
      <circle cx={6} cy={18} r={1.5} fill="currentColor" stroke="#BABABA" />
      <path d="M11 4l5 2.5L11 9V4z" fill="#BABABA" />
      <path
        d="M18.273 6.5c2.197 5.74-.88 11-5.273 11"
        stroke="#000"
        strokeLinecap="round"
      />
      <path
        d="M12.5 15.809v3.382L9.118 17.5l3.382-1.691z"
        fill="#000"
        stroke="#000"
      />
      <path
        d="M18 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        fill="currentColor"
        stroke="#000"
      />
    </svg>
  )
}

export default SvgInvertArrow
