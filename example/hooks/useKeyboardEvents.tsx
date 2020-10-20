import { useEffect } from "react"
import { handleKeyDown, handleKeyUp } from "../components/utils"

export default function useKeyboardEvents() {
  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown)
    document.body.addEventListener("keyup", handleKeyUp)

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown)
      document.body.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
}
