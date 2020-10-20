import * as React from "react"

function SvgDelete(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M18.5 7.5v9a.5.5 0 01-.5.5h-7.134a.5.5 0 01-.323-.118l-5.318-4.5a.5.5 0 010-.764l5.318-4.5A.5.5 0 0110.866 7H18a.5.5 0 01.5.5z"
        fill="currentColor"
        stroke="#000"
        strokeLinejoin="round"
      />
      <path
        d="M10.646 14.146a.5.5 0 00.708.708l-.708-.708zm5.708-4.292a.5.5 0 00-.708-.708l.708.708zm-5 5l5-5-.708-.708-5 5 .708.708z"
        fill="#000"
      />
      <path
        d="M16.354 14.146a.5.5 0 01-.708.708l.708-.708zm-5.708-4.292a.5.5 0 01.708-.708l-.708.708zm5 5l-5-5 .708-.708 5 5-.708.708z"
        fill="#000"
      />
    </svg>
  )
}

export default SvgDelete
