import * as React from "react"

function SvgSelect(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 5.506l.13 13.634a.5.5 0 00.887.312l3.936-4.815a.5.5 0 01.356-.183l6.207-.378a.5.5 0 00.266-.902L7.796 5.098A.5.5 0 007 5.506z"
        fill="currentColor"
        stroke="#000"
      />
    </svg>
  )
}

export default SvgSelect
